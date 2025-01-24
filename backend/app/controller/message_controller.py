from schemas.message_schemas import DirectMessageRequest
from model.client_model import Message, User
from service.auth import get_current_user
from dependencies import get_db
from sqlalchemy.sql import text  
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post("/messages")
def send_direct_message(
    request: DirectMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Ensure the recipient exists
    recipient = db.query(User).filter(User.user_id == request.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    # Create the message
    message = Message(
        content=request.content,
        sender_id=current_user.user_id,
        recipient_id=request.recipient_id,
        recipient_type_id=2,  # 2 for direct messages
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return {"message": "Message sent successfully", "message_id": message.message_id}

@router.get("/messages")
def fetch_direct_messages(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fetch all messages sent or received by the current user
    messages = (
        db.query(Message)
        .filter(
            (Message.sender_id == current_user.user_id) |
            (Message.recipient_id == current_user.user_id)
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    return [
        {
            "message_id": message.message_id,
            "content": message.content,
            "created_at": message.created_at,
            "sender_id": message.sender_id,
            "sender_username": message.sender.username,
            "recipient_id": message.recipient_id,
            "recipient_username": message.recipient.username,
        }
        for message in messages
    ]
