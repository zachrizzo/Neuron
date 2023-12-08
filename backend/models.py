# models.py
from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    content: str

class MessageModel(BaseModel):
    conversation: List[Message]
    model_type: Optional[str] = None

class AssistantModel(BaseModel):
    name: str
    description: str
    instructions: str
    model: str

class RunModel(BaseModel):
    instructions: str
    assistant_id: Optional[str] = None

class JustMessage(BaseModel):
    content: str
