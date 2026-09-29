

from pydantic import BaseModel


class NotFoundResponse(BaseModel):
    message: str