from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func
from sqlalchemy.orm import Session
from service.auth import get_current_user, get_user_id
from schemas.listing_schemas import GroupCreate, GroupResponse, ListingCreate, ListingResponse, ListingUpdateRequest
from model.client_model import Group, Listing, User
from dependencies import get_db
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/listings", status_code=status.HTTP_201_CREATED)
def create_listing(
    listing: ListingCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
    ):

    new_listing = Listing(
        title=listing.title,
        description=listing.description,
        price=listing.price,
        location=listing.location,
        isRental=listing.isRental,
        status=listing.status,
        preferences=listing.preferences.dict() if listing.preferences else None, 
        owner_id=current_user.user_id  # Replace with actual owner_id logic (e.g., from JWT)
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    
    return {"success": True, "data": new_listing}

@router.get("/listings/search", response_model=List[ListingResponse])
def search_listings(
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    pet_friendly: Optional[bool] = None,
    smoking: Optional[bool] = None,
    party_friendly: Optional[bool] = None,
    vegan: Optional[bool] = None,
    quiet_hours_start: Optional[str] = None,
    quiet_hours_end: Optional[str] = None,
    language: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
):
    filters = []
    
    # Location filter
    if location:
        filters.append(Listing.location.ilike(f"%{location}%"))

    # Price range filters
    if min_price is not None:
        filters.append(Listing.price >= min_price)
    if max_price is not None:
        filters.append(Listing.price <= max_price)

    # Preferences filters
    if pet_friendly is not None:
        filters.append(Listing.preferences.like('%"pet_friendly": true%'))
    if smoking is not None:
        filters.append(Listing.preferences.like(f'%"smoking": {str(smoking).lower()}%'))
    if party_friendly is not None:
        filters.append(Listing.preferences.like(f'%"party_friendly": {str(party_friendly).lower()}%'))
    if vegan is not None:
        filters.append(Listing.preferences.like(f'%"vegan": {str(vegan).lower()}%'))

    # Quiet hours filter
    if quiet_hours_start:
        filters.append(Listing.preferences.like(f'%"quiet_hours": {{"start": "{quiet_hours_start}"%'))
    if quiet_hours_end:
        filters.append(Listing.preferences.like(f'%"quiet_hours": %%"end": "{quiet_hours_end}"%'))

    # Language filter
    if language:
        for lang in language:
            filters.append(Listing.preferences.like(f'%"language": %%"{lang}"%'))

    # Log all filters before query execution
    logger.info("Constructed filters: %s", filters)

    # Query the database
    listings = db.query(Listing).filter(and_(*filters)).all()

    # Log the number of results
    logger.info("Number of listings found: %d", len(listings))

    # Optionally, log each listing for debugging
    for listing in listings:
        logger.debug("Listing found: %s", listing.__dict__)

    # Convert datetime fields to strings
    formatted_listings = [
        {
            **listing.__dict__,
            "created": listing.created.isoformat(),
            "updated": listing.updated.isoformat() if listing.updated else None,
        }
        for listing in listings
    ]

    return formatted_listings



@router.get("/listings/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.listing_id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {
        "listing_id": listing.listing_id,
        "owner_id" : listing.owner_id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "location": listing.location,
        "isRental" : listing.isRental,
        "images": listing.images,
        "created": listing.created.isoformat(),
        "updated": listing.updated.isoformat(),
        "status": listing.status,
        "preferences": listing.preferences,
    }


@router.put("/listings/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_update: ListingUpdateRequest, 
    db: Session = Depends(get_db),
    ):

    listing = db.query(Listing).filter(Listing.listing_id == listing_id).first()

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Update the fields if its provided
    if listing_update.title is not None:
        listing.title = listing_update.title
    if listing_update.description is not None:
        listing.description = listing_update.description
    if listing_update.price is not None:
        listing.price = listing_update.price
    if listing_update.location is not None:
        listing.location = listing_update.location
    if listing_update.isRental is not None:
        listing.isRental = listing_update.isRental
    if listing_update.status is not None:
        listing.status = listing_update.status

    db.commit()
    db.refresh(listing)

    return {
        "listing_id": listing.listing_id,
        "owner_id" : listing.owner_id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "location": listing.location,
        "isRental" : listing.isRental,
        "images": listing.images,
        "created": listing.created.isoformat(),
        "updated": listing.updated.isoformat(),
        "status": listing.status
    }

@router.delete("/listings/{listing_id}")
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.listing_id == listing_id).first()

    # Only admins or the user themselves can delete their own lsitng
    if current_user.role != "admin" and current_user.user_id != listing.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    # Fetch the listing
    if not listing:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the listing
    db.delete(listing)
    db.commit()
    
    return {"message": f"Listing with ID {listing_id} has been deleted"}


@router.post("/groups", response_model=GroupResponse)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Get the current user
):
    # Check if the listing exists
    listing = db.query(Listing).filter(Listing.listing_id == group.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    # Create the group with the current user as the owner
    db_group = Group(
        name=group.name,
        description=group.description,
        listing_id=group.listing_id,
        owner_id=current_user.user_id  # Set the current user as the owner
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


