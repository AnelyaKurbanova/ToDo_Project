from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

        