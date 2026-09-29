from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String
from .configs import Engine

# 1. Create a Base class for your models to inherit from
class Base(DeclarativeBase):
    pass

# 2. Define your models
class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    location = Column(String)

class Messages(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, index=True)
    receiver_id = Column(Integer, index=True)
    content = Column(String)
    timestamp = Column(String)  # You might want to use DateTime type for timestamps
# class Robot(Base):
#     __tablename__ = "robot_status"

# #  NEED TO COMPLETE WITH ALL COLUMNS
# # INSERT INTO public.robot_status(
# # 	robot_id, robot_name, status, , last_seen_at, current_location_id, active_request_id, error_code, error_message, created_at, updated_at)
# # 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

#     id = Column(Integer, primary_key=True, index=True)
#     robot_name = Column(String)
#     status = Column(String)
#     battery_percent = Column(Integer)

# 3. Create tables
def create_tables():
    # Create all database tables at startup.
    engine = Engine.get()
    print(engine)
    Base.metadata.create_all(bind=engine)