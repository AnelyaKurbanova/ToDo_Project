from fastapi import FastAPI
from app.routers import todos, auth
from app import models
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",  # твой фронтенд
    # добавь другие, если нужно
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # можно использовать ["*"] на dev-этапе
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)
app.include_router(auth.router)

