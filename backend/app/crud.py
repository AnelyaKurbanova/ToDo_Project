from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext
from app.models import User
from app.schemas import UserCreate

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

def get_user_todo_by_id(db: Session, todo_id: int, user: models.User):
    return db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.owner_id == user.id
    ).first()

def get_user_todos(db: Session, user: models.User):
    return db.query(models.Todo).filter(models.Todo.owner_id == user.id).all()

def create_user_todo(db: Session, todo: schemas.TodoCreate, user: models.User):
    db_todo = models.Todo(
        title=todo.title,
        completed=todo.completed,
        owner_id=user.id
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_user_todo(db: Session, todo_id: int, todo: schemas.TodoUpdate, user: models.User):
    db_todo = get_user_todo_by_id(db, todo_id, user)
    if not db_todo:
        return None
    db_todo.title = todo.title
    db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_user_todo(db: Session, todo_id: int, user: models.User):
    db_todo = get_user_todo_by_id(db, todo_id, user)
    if not db_todo:
        return None
    db.delete(db_todo)
    db.commit()
    return db_todo
