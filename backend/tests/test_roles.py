
from unittest.mock import MagicMock
from api.routes.roles.rolesroutes import read_roles, read_role
from api.dependencies.database.dbSchemas import Roles

import pytest
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from api.routes.roles.rolesroutes import RoleCreate, create_role


def test_create_role_success():
    db = MagicMock()
    db.scalar.return_value = None

    payload = RoleCreate(
        name="operator",
        description="Manages robot deliveries",
    )

    result = create_role(payload, db)

    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(result)
    assert result.name == "operator"


def test_create_duplicate_role():
    db = MagicMock()
    db.scalar.return_value = object()

    with pytest.raises(HTTPException) as error:
        create_role(RoleCreate(name="admin"), db)

    assert error.value.status_code == 409
    db.add.assert_not_called()


def test_create_role_blank_name():
    with pytest.raises(ValidationError):
        RoleCreate(name="   ")


def test_create_role_database_conflict():
    db = MagicMock()
    db.scalar.return_value = None
    db.commit.side_effect = IntegrityError(
        "INSERT INTO roles",
        {},
        Exception("duplicate key"),
    )

    with pytest.raises(HTTPException) as error:
        create_role(RoleCreate(name="admin"), db)

    assert error.value.status_code == 409
    db.rollback.assert_called_once()


# Test retrieving all existing roles
def test_read_all_roles():
    db = MagicMock()

    # Simulate two roles stored in the database
    mock_roles = [
        Roles(id=1, name="admin", description="Administrator"),
        Roles(id=2, name="operator", description="Robot operator"),
    ]

    db.scalars.return_value.all.return_value = mock_roles

    # Call the endpoint function
    result = read_roles(db)

    # Verify both roles were returned
    assert len(result) == 2
    assert result[0].name == "admin"
    assert result[1].name == "operator"

    db.scalars.assert_called_once()


# Test retrieving a specific role by ID
def test_read_role_by_id():
    db = MagicMock()

    # Simulate an existing role
    expected_role = Roles(id=1, name="admin")
    db.get.return_value = expected_role

    result = read_role(1, db)

    assert result.id == 1
    assert result.name == "admin"
    db.get.assert_called_once_with(Roles, 1)


# Test handling a role that does not exist
def test_read_role_not_found():
    db = MagicMock()

    # Simulate a database lookup with no matching role
    db.get.return_value = None

    with pytest.raises(HTTPException) as error:
        read_role(999, db)

    assert error.value.status_code == 404
    assert error.value.detail == "Role not found"


# Test retrieving roles when the database is empty
def test_read_roles_empty():
    db = MagicMock()

    db.scalars.return_value.all.return_value = []

    result = read_roles(db)

    assert result == []

# F2P-9: UPDATE ROLES TESTS
from api.routes.roles.rolesroutes import RoleUpdate, update_role, delete_role


def test_update_role_success():
    db = MagicMock()
    role = Roles(id=1, name="operator", description="Old description")
    db.get.return_value = role

    result = update_role(1, RoleUpdate(name="senior_operator"), db)

    assert result.name == "senior_operator"
    assert result.description == "Old description"
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(role)


def test_update_role_not_found():
    db = MagicMock()
    db.get.return_value = None

    with pytest.raises(HTTPException) as error:
        update_role(999, RoleUpdate(name="admin"), db)

    assert error.value.status_code == 404


def test_update_duplicate_role():
    db = MagicMock()
    db.get.return_value = Roles(id=1, name="operator")
    db.commit.side_effect = IntegrityError(
        "UPDATE roles", {}, Exception("duplicate key")
    )

    with pytest.raises(HTTPException) as error:
        update_role(1, RoleUpdate(name="admin"), db)

    assert error.value.status_code == 409
    db.rollback.assert_called_once()


# F2P-10: DELETE ROLES TESTS

def test_delete_role_success():
    db = MagicMock()
    role = Roles(id=1, name="operator")
    db.get.return_value = role

    result = delete_role(1, db)

    assert result is None
    db.delete.assert_called_once_with(role)
    db.commit.assert_called_once()


def test_delete_role_not_found():
    db = MagicMock()
    db.get.return_value = None

    with pytest.raises(HTTPException) as error:
        delete_role(999, db)

    assert error.value.status_code == 404
    db.delete.assert_not_called()


def test_delete_role_database_conflict():
    db = MagicMock()
    db.get.return_value = Roles(id=1, name="admin")
    db.commit.side_effect = IntegrityError(
        "DELETE FROM roles", {}, Exception("foreign key violation")
    )

    with pytest.raises(HTTPException) as error:
        delete_role(1, db)

    assert error.value.status_code == 409
    db.rollback.assert_called_once()