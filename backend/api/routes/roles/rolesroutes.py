from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator, ConfigDict
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from api.dependencies.database.database import get_db
from api.dependencies.database.dbSchemas import Roles

router = APIRouter(prefix="/roles", tags=["Roles"])


class RoleCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    description: str | None = Field(default=None, max_length=255)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Role name cannot be empty")
        return value


class RoleResponse(RoleCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


@router.post(
    "/",
    response_model=RoleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_role(payload: RoleCreate, db: Session = Depends(get_db)):
    existing_role = db.scalar(
        select(Roles).where(Roles.name == payload.name)
    )

    if existing_role:
        raise HTTPException(
            status_code=409,
            detail="Role already exists",
        )

    new_role = Roles(
        name=payload.name,
        description=payload.description,
    )

    db.add(new_role)

    try:
        db.commit()
        db.refresh(new_role)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Role already exists",
        )

    return new_role


@router.get("/", response_model=list[RoleResponse])
def read_roles(db: Session = Depends(get_db)):
    # Fetch all roles from the Roles table
    roles = db.scalars(select(Roles)).all()
    return roles


@router.get("/{role_id}", response_model=RoleResponse)
def read_role(role_id: int, db: Session = Depends(get_db)):
    # Find the role using its unique ID
    role = db.get(Roles, role_id)

    # Return 404 if the requested role does not exist
    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    # Return the matching role
    return role

class RoleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=50)
    description: str | None = Field(default=None, max_length=255)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("Role name cannot be empty")
        return value

@router.patch("/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: int,
    payload: RoleUpdate,
    db: Session = Depends(get_db),
):
    role = db.get(Roles, role_id)

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )
    updates = payload.model_dump(exclude_unset=True)


    if "name" in updates and updates["name"] is None:
        raise HTTPException(
            status_code=422,
            detail="Role name cannot be null",
        )

    for field, value in updates.items():
        setattr(role, field, value)

    try:
        db.commit()
        db.refresh(role)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Role name already exists",
        )

    return role


@router.delete(
    "/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
):
    role = db.get(Roles, role_id)

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Role not found",
        )

    db.delete(role)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Role cannot be deleted because it is in use",
        )
    return None