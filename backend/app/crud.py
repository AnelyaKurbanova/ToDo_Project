from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext
from app.models import User
from app.schemas import UserCreate



def get_todos(db: Session):
    return db.query(models.Todo).all()

def create_todo(db: Session, todo: schemas.TodoCreate):
    db_todo = models.Todo(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int):
    db_todo = db.query(models.Todo).get(todo_id)
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo

def update_todo(db: Session, todo_id: int, todo: schemas.TodoCreate):
    db_todo = db.query(models.Todo).get(todo_id)
    if db_todo:
        db_todo.title = todo.title
        db_todo.completed = todo.completed
        db.commit()
        db.refresh(db_todo)
    return db_todo




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
