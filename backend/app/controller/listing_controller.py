from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, status
from sqlalchemy import and_, func
from sqlalchemy.orm import Session, joinedload
from service.auth import get_current_user, get_user_id
from schemas.listing_schemas import GroupCreate, GroupResponse, ListingCreate, ListingResponse, ListingUpdateRequest, UpdateGroupPreferenceRequest
from model.client_model import Group, GroupMember, Listing, User
from dependencies import get_db
import logging
from fastapi import UploadFile, File, Form

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/listings", response_model=List[ListingResponse])
def get_all_listings(db: Session = Depends(get_db)):
    listings = db.query(Listing).all()
    formatted_listings = [
        {
            **listing.__dict__,
            "created": listing.created.isoformat(),
            "updated": listing.updated.isoformat() if listing.updated else None,
        }
        for listing in listings
    ]
    return formatted_listings

@router.post("/listings", status_code=status.HTTP_201_CREATED)
async def create_listing(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    location: str = Form(...),
    isRental: bool = Form(...),
    status: Optional[str] = Form("active"),
    preferences: Optional[str] = Form(None),
    images: List[UploadFile] = File(None), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved_image_paths = []
    if images:
        for img in images:
            file_location = f"uploads/{img.filename}"
            with open(file_location, "wb") as buffer:
                buffer.write(await img.read())
            saved_image_paths.append(file_location)

    import json
    preferences_data = json.loads(preferences) if preferences else None

    new_listing = Listing(
        title=title,
        description=description,
        price=price,
        location=location,
        isRental=isRental,
        status=status,
        preferences=preferences_data,
        owner_id=current_user.user_id,
        images=saved_image_paths,
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
    
    if location:
        filters.append(Listing.location.ilike(f"%{location}%"))

    if min_price is not None:
        filters.append(Listing.price >= min_price)
    if max_price is not None:
        filters.append(Listing.price <= max_price)

    if pet_friendly is not None:
        filters.append(Listing.preferences.like('%"pet_friendly": true%'))
    if smoking is not None:
        filters.append(Listing.preferences.like(f'%"smoking": {str(smoking).lower()}%'))
    if party_friendly is not None:
        filters.append(Listing.preferences.like(f'%"party_friendly": {str(party_friendly).lower()}%'))
    if vegan is not None:
        filters.append(Listing.preferences.like(f'%"vegan": {str(vegan).lower()}%'))

    if quiet_hours_start:
        filters.append(Listing.preferences.like(f'%"quiet_hours": "start": "{quiet_hours_start}"%'))
    if quiet_hours_end:
        filters.append(Listing.preferences.like(f'%"quiet_hours": %%"end": "{quiet_hours_end}"%'))

    if language:
        for lang in language:
            filters.append(Listing.preferences.like(f'%"language": %%"{lang}"%'))

    logger.info("Constructed filters: %s", filters)

    listings = db.query(Listing).filter(and_(*filters)).all()

    logger.info("Number of listings found: %d", len(listings))

    for listing in listings:
        logger.debug("Listing found: %s", listing.__dict__)

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
    current_user: User = Depends(get_current_user),
):
    # Initialize lifestyle preferences with default values
    default_preferences = {
        "rent_division": {},
        "quiet_hours": {"start": "22:00", "end": "07:00"},
        "ready_to_sign": [],
    }

    # Create the group
    db_group = Group(
        name=group.name,
        description=group.description,
        listing_id=group.listing_id,
        owner_id=current_user.user_id,
        lifestyle_preference=default_preferences,  
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)

    # Add the owner as a member of the group
    group_member = GroupMember(
        group_id=db_group.group_id,
        user_id=current_user.user_id,
    )
    db.add(group_member)
    db.commit()

    return {
        "group_id": db_group.group_id,
        "name": db_group.name,
        "description": db_group.description,
        "listing_id": db_group.listing_id,
        "owner_id": db_group.owner_id,
        "lifestyle_preference": db_group.lifestyle_preference,
        "members": [
            {
                "user_id": current_user.user_id,
                "name": current_user.name,
                "surname": current_user.surname,
                "username": current_user.username,
            }
        ],
    }

@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group_details(group_id: int, db: Session = Depends(get_db)):
    # Fetch the group with its members
    group = db.query(Group).filter(Group.group_id == group_id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Manually serialize the members
    members = [
        {
            "user_id": member.user.user_id,
            "name": member.user.name,
            "surname": member.user.surname,
            "username": member.user.username,
        }
        for member in group.members
    ]

    # Ensure lifestyle_preference has default values
    lifestyle_preference = group.lifestyle_preference

    return {
        "group_id": group.group_id,
        "name": group.name,
        "description": group.description,
        "listing_id": group.listing_id,
        "owner_id": group.owner_id,
        "members": members,
        "lifestyle_preference": lifestyle_preference,
    }


@router.post("/groups/{group_id}/join")
def join_group(group_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Check if the group exists
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Check if the user is already a member of the group
    existing_membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.user_id
    ).first()
    if existing_membership:
        raise HTTPException(status_code=400, detail="You are already a member of this group")

    # Add the user to the group
    group_member = GroupMember(
        group_id=group_id,
        user_id=current_user.user_id
    )
    db.add(group_member)
    db.commit()
    db.refresh(group_member)

    return {"message": f"You have successfully joined the group '{group.name}'"}

@router.patch("/groups/{group_id}/preferences")
def update_group_preferences(
    group_id: int,
    request: UpdateGroupPreferenceRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Fetch the group
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Check if the current user is authorized (only group owner can update preferences)
    if group.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update preferences")

    # Update the lifestyle preferences
    group.lifestyle_preference = request.lifestyle_preference.dict()
    db.commit()
    db.refresh(group)

    return {"message": "Group preferences updated successfully", "lifestyle_preference": group.lifestyle_preference}

@router.post("/groups/{group_id}/ready-to-sign", response_model=GroupResponse)
def set_ready_to_sign(
    group_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"Current user: {current_user.user_id}, Group ID: {group_id}")

    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        logger.error(f"Group with ID {group_id} not found")
        raise HTTPException(status_code=404, detail="Group not found")

    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id, GroupMember.user_id == current_user.user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of the group")

    # Initialize or update lifestyle preferences
    if not group.lifestyle_preference:
        group.lifestyle_preference = {"ready_to_sign": []}
    elif "ready_to_sign" not in group.lifestyle_preference:
        group.lifestyle_preference["ready_to_sign"] = []

    if current_user.user_id not in group.lifestyle_preference["ready_to_sign"]:
        group.lifestyle_preference["ready_to_sign"].append(current_user.user_id)

    try:
        db.commit()
        db.refresh(group)
    except Exception as e:
        logger.error(f"Database commit failed: {e}")
        raise HTTPException(status_code=500, detail="Could not update group")

    members = [
        {
            "user_id": member.user.user_id,
            "name": member.user.name,
            "surname": member.user.surname,
            "username": member.user.username,
        }
        for member in group.members
    ]

    return {
        "group_id": group.group_id,
        "name": group.name,
        "description": group.description,
        "listing_id": group.listing_id,
        "owner_id": group.owner_id,
        "members": members,
        "lifestyle_preference": group.lifestyle_preference,
    }



@router.post("/groups/{group_id}/forfeit-sign")
def forfeit_ready_to_sign(
    group_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Fetch the group
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Check if the user is a member of the group
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id, GroupMember.user_id == current_user.user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of the group")

    # Update the ready_to_sign list
    lifestyle_preferences = group.lifestyle_preference or {}
    ready_to_sign = lifestyle_preferences.get("ready_to_sign", [])
    if current_user.user_id in ready_to_sign:
        ready_to_sign.remove(current_user.user_id)
        lifestyle_preferences["ready_to_sign"] = ready_to_sign
        group.lifestyle_preference = lifestyle_preferences
        db.commit()
        db.refresh(group)



@router.get("/listings/{listing_id}/groups", response_model=List[GroupResponse])
def get_groups_for_listing(listing_id: int, db: Session = Depends(get_db)):
    # Query the database to get all groups for the listing
    groups = (
        db.query(Group)
        .options(joinedload(Group.members).joinedload(GroupMember.user))  
        .filter(Group.listing_id == listing_id)
        .all()
    )

    if not groups:
        raise HTTPException(status_code=404, detail="No groups found for this listing")

    # Serialize each group
    serialized_groups = []
    for group in groups:
        members = [
            {
                "user_id": member.user.user_id,
                "name": member.user.name,
                "surname": member.user.surname,
                "username": member.user.username,
            }
            for member in group.members
        ]

        lifestyle_preference = group.lifestyle_preference or {}
        lifestyle_preference.setdefault("rent_division", {})
        lifestyle_preference.setdefault("quiet_hours", {"start": "22:00", "end": "07:00"})
        lifestyle_preference.setdefault("ready_to_sign", [])

        serialized_groups.append({
            "group_id": group.group_id,
            "name": group.name,
            "description": group.description,
            "listing_id": group.listing_id,
            "owner_id": group.owner_id,
            "members": members,
            "lifestyle_preference": lifestyle_preference,
        })

    return serialized_groups

@router.get("/groups", response_model=List[GroupResponse])
def get_all_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()

    formatted_groups = []
    for group in groups:
        formatted_groups.append({
            "group_id": group.group_id,
            "name": group.name,
            "description": group.description,
            "listing_id": group.listing_id,
            "owner_id": group.owner_id,
            "lifestyle_preference": group.lifestyle_preference,
            "members": [
                {
                    "user_id": member.user_id,
                    "name": member.user.name if member.user else None,
                    "surname": member.user.surname if member.user else None,
                    "username": member.user.username if member.user else None,
                }
                for member in group.members
            ],
        })

    return formatted_groups