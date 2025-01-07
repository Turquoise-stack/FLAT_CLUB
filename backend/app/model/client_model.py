from database import Base
from sqlalchemy import Column, Integer, String, JSON, DateTime, Enum
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    preferences = Column(JSON, nullable=True)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
