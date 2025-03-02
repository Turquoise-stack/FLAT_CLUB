from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum, JSON, Float, Boolean, DateTime, create_engine
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

# Status Enum for Listings
class ListingStatus(enum.Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"

class User(Base):
    __tablename__ = "users"
    
    # pk
    user_id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=True) 
    surname = Column(String, nullable=True)  
    username = Column(String, unique=True, nullable=False)  
    email = Column(String, unique=True, nullable=True)  
    phone_number = Column(String, nullable=True)  
    password = Column(String, nullable=False)

    # preferences and other info
    role = Column(String, nullable=False)  # Example: tenant ovner and admin
    preference = Column(JSON, nullable=True)  # JSON for dynamic preferences
    bio = Column(String, nullable=True)
    pets = Column(JSON, nullable=True) 

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # relationships
    listings = relationship("Listing", back_populates="owner")  
    groups_owned = relationship("Group", back_populates="owner")  
    group_memberships = relationship("GroupMember", back_populates="user")  
    messages_sent = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender") 
    messages_received = relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")  
    ratings = relationship("Rating", back_populates="user") 
    media = relationship("Media", back_populates="user")  # Media Uploaded
    notifications = relationship("Notification", back_populates="user")  

class Listing(Base):
    __tablename__ = "listings"
    
    listing_id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    isRental = Column(Boolean, nullable=False)
    location = Column(String, nullable=False)
    images = Column(Integer)  #   Media table
    preferences = Column(JSON, nullable=True)
    created = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="listings")
    groups = relationship("Group", back_populates="listing")
    ratings = relationship("Rating", back_populates="listing")

class Group(Base):
    __tablename__ = "groups"
    group_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    lifestyle_preference = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.listing_id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="groups_owned")
    listing = relationship("Listing", back_populates="groups")
    members = relationship("GroupMember", back_populates="group")

class GroupMember(Base):
    __tablename__ = "group_members"
    group_member = Column(Integer, primary_key=True, index=True)
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    group_id = Column(Integer, ForeignKey("groups.group_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    # Relationships
    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="group_memberships")

# Messages Model
class Message(Base):
    __tablename__ = "messages"
    message_id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    recipient_type_id = Column(Integer, ForeignKey("recipient_type.type_id"), nullable=False)

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="messages_sent")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="messages_received")
    recipient_type = relationship("RecipientType", back_populates="messages")

class RecipientType(Base):
    __tablename__ = "recipient_type"
    type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String, nullable=False)

    # Relationships
    messages = relationship("Message", back_populates="recipient_type")

class Rating(Base):
    __tablename__ = "ratings"
    rating_id = Column(Integer, primary_key=True, index=True)
    rating_value = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.listing_id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="ratings")
    listing = relationship("Listing", back_populates="ratings")

class Media(Base):
    __tablename__ = "media"
    media_id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    listing_id = Column(Integer, ForeignKey("listings.listing_id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="media")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)

    # Relationships
    user = relationship("User", back_populates="notifications")
