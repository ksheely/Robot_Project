from fastapi import APIRouter, Depends, Body
from ...dependencies.database.database import get_db
from ...dependencies.database.dbSchemas import Messages
from sqlalchemy.orm import Session
from sqlalchemy import select, insert
from pydantic import BaseModel
import json
from typing import Optional, Union
from ...dependencies.libs.resposeObjects import NotFoundResponse
from dataclasses import asdict



# Define a Pydantic model for the user response since the ORM model cannot be directly serialized to JSON
class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: Optional[str] = None

    class Config:
        from_attributes = True


router = APIRouter()

@router.get("/messages/{message_id}", response_model=Union[MessageResponse, NotFoundResponse])
async def get_message(message_id: int, db: Session = Depends(get_db)):
    query = select(Messages).where(Messages.id == message_id)
    result = db.execute(query)

    print("MESSAGE RESULT: ", result)
    # message = MessageResponse.model_validate(result).model_dump()
    message = result.scalars().one_or_none()
    if message is None:
        return {"message": "Message not found"}

    print("MESSAGE: ", message)
    # message_json = json.dumps(message.__dict__)
    
    # print("MESSAGE JSON: ", message_json)
    if not result:
        return {"message": "Message not found"}

    return message


@router.post('/messages')
async def post_message(payload: dict = Body(), db: Session = Depends(get_db)):
    print("Inserting message into database...")
    query = insert(Messages).values(**payload)
    result = db.execute(query)
    db.commit()
    print("CREATE MESSAGE RESULT: ", result)

    return True
