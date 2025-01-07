from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from service.auth import get_current_user, get_user_id
from schemas.listing_schemas import ListingCreate, ListingResponse, ListingUpdateRequest
from model.client_model import Listing, User
from dependencies import get_db

router = APIRouter()

@router.post("/listings", status_code=status.HTTP_201_CREATED)
def create_listing(listing: ListingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_listing = Listing(
        title=listing.title,
        description=listing.description,
        price=listing.price,
        location=listing.location,
        isRental=listing.isRental,
        status=listing.status,
        owner_id=current_user.user_id  # Replace with actual owner_id logic (e.g., from JWT)
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return {"success": True, "data": new_listing}

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
        "status": listing.status
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