from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import todos, auth
from app import models
from app.database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = [
"*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(todos.router)
app.include_router(auth.router)
