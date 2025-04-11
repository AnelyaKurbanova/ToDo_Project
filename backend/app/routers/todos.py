from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud, database
from app.dependencies import get_current_user
from app.models import User
from app.database import get_db



router = APIRouter(prefix="/todos", tags=["todos"])

@router.post("/", response_model=schemas.Todo)
def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_user_todo(db, todo, current_user)


@router.get("/", response_model=List[schemas.Todo])
def get_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_user_todos(db, current_user)


@router.put("/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int,
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = crud.update_user_todo(db, todo_id, todo, current_user)
    if not updated:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return updated



@router.delete("/{todo_id}", response_model=schemas.Todo)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = crud.delete_user_todo(db, todo_id, current_user)
    if not deleted:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return deleted

@router.get("/me", response_model=List[schemas.Todo])
def get_my_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_user_todos(db, current_user)
