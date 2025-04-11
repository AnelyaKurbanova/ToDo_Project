from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud, database

router = APIRouter(prefix="/todos", tags=["todos"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[schemas.Todo])
def read_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)


@router.post("/", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo)

@router.delete("/{todo_id}", response_model=schemas.Todo)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    return crud.delete_todo(db, todo_id)

@router.put("/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.update_todo(db, todo_id, todo)
