from fastapi import FastAPI
from app.routers import todos, auth
from app import models
from app.database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(todos.router)
app.include_router(auth.router)
