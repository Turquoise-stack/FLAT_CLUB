from pydantic import BaseModel

class DirectMessageRequest(BaseModel):
    recipient_id: int
    content: str

class GroupMessageRequest(BaseModel):
    content: str
