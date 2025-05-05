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

from pydantic import BaseModel

class MemberActionRequest(BaseModel):
    user_id: int

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
def create_group(group: GroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_group = Group(
        name=group.name,
        description=group.description,
        listing_id=group.listing_id,
        owner_id=current_user.user_id,
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    # ✅ Add leader as ACTIVE member
    leader_member = GroupMember(
        group_id=new_group.group_id,
        user_id=current_user.user_id,
        status="active"
    )
    db.add(leader_member)
    db.commit()

    # Build and return response
    return {
        "group_id": new_group.group_id,
        "name": new_group.name,
        "description": new_group.description,
        "listing_id": new_group.listing_id,
        "owner_id": new_group.owner_id,
        "lifestyle_preference": new_group.lifestyle_preference,
        "members": [
            {
                "user_id": current_user.user_id,
                "name": current_user.name,
                "surname": current_user.surname,
                "username": current_user.username,
                "status": "active"
            }
        ]
    }


@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group_details(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    members = [
        {
            "user_id": member.user.user_id,
            "name": member.user.name,
            "surname": member.user.surname,
            "username": member.user.username,
            "status": member.status 
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
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # chket if the current user is authorized (only group owner can update preferences)
    if group.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update preferences")

    group.lifestyle_preference = request.lifestyle_preference.dict()
    db.commit()
    db.refresh(group)

    return {"message": "Group preferences updated successfully", "lifestyle_preference": group.lifestyle_preference}


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
                    "status": member.status  

                }
                for member in group.members
            ],
        })

    return formatted_groups


@router.post("/groups/{group_id}/join-request")
def join_request(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if group.owner_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Group owner cannot request to join their own group.")

    existing = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.user_id
    ).first()

    if existing:
        if existing.status == "pending":
            raise HTTPException(status_code=400, detail="You have already sent a join request.")
        elif existing.status == "active":
            raise HTTPException(status_code=400, detail="You are already a member of this group.")
        else:
            raise HTTPException(status_code=400, detail="Join request already exists.")

    new_request = GroupMember(group_id=group_id, user_id=current_user.user_id, status="pending")
    db.add(new_request)
    db.commit()
    return {"message": "Join request sent successfully."}


@router.post("/groups/{group_id}/approve-member")
def approve_member(
    group_id: int,
    payload: MemberActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = payload.user_id

    group = db.query(Group).filter(Group.group_id == group_id).first()
    if group.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Only owner can approve")

    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id,
        GroupMember.status == "pending"
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Request not found")

    member.status = "active"
    db.commit()
    return {"message": "Member approved"}


@router.post("/groups/{group_id}/reject-member")
def reject_member(
    group_id: int,
    payload: MemberActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = payload.user_id

    group = db.query(Group).filter(Group.group_id == group_id).first()
    if group.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Only owner can reject")

    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id,
        GroupMember.status == "pending"
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Request not found")

    db.delete(member)
    db.commit()
    return {"message": "Request rejected"}


@router.delete("/groups/{group_id}/remove-member")
def remove_member(
    group_id: int,
    payload: MemberActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = payload.user_id

    group = db.query(Group).filter(Group.group_id == group_id).first()
    if group.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="only owner can remove members")

    member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id,
        GroupMember.status == "active"
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(member)
    db.commit()
    return {"message": "Meber removed"}

