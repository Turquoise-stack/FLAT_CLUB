from schemas.message_schemas import DirectMessageRequest, GroupMessageRequest
from model.client_model import Group, GroupMember, Message, Notification, User
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


@router.post("/groups/{group_id}/messages")
def send_group_message(
    group_id: int,
    request: GroupMessageRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Ensure the group exists
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Ensure the user is a member of the group
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id, GroupMember.user_id == current_user.user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of the group")

    # Create the message
    message = Message(
        content=request.content,  
        sender_id=current_user.user_id,
        recipient_id=group_id,
        recipient_type_id=1,  # 1 for group messages
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return {"message": "Message sent successfully", "message_id": message.message_id}

@router.get("/groups/{group_id}/messages")
def fetch_group_messages(group_id: int, db: Session = Depends(get_db)):
    # Fetch the group to ensure it exists
    group = db.query(Group).filter(Group.group_id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Fetch all messages for the group
    messages = (
        db.query(Message)
        .filter(Message.recipient_type_id == 1, Message.recipient_id == group_id)
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
        }
        for message in messages
    ]


@router.get("/notifications")
def fetch_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.user_id
    ).order_by(Notification.created_at.desc()).all()

    return [
        {
            "notification_id": notification.notification_id,
            "content": notification.content,
            "created_at": notification.created_at,
            "is_read": notification.is_read,
        }
        for notification in notifications
    ]


@router.put("/notifications/{notification_id}")
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Fetch the notification
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id,
        Notification.user_id == current_user.user_id
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Mark as read
    notification.is_read = True
    db.commit()

    return {"message": "Notification marked as read"}
