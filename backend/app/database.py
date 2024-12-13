from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Replace the URL with your database connection string
DATABASE_URL = "sqlite:///./test.db"  # Example: SQLite database file

# Create the database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models to inherit
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
