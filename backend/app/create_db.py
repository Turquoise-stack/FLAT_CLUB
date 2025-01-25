from database import engine
from model.client_model import Base

Base.metadata.create_all(bind=engine)
