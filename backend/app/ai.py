import json
from dotenv import load_dotenv
import os
from google import genai
from app import schemas

load_dotenv() 

gemini_api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=gemini_api_key)

prompt = """List a tasks from user input to create tasks for all user's day in JSON format. Разделяй задачу на подзадачи, если это необходимо и возвращай список этих подзадач. Если задача очень простая - не разбивай ее, а если задача усложненная, то делай от 1 до 5 подзадач 

Use this JSON schema:

Task = {'task': str}
Return: list[Task]"""

def get_ai_task(ai_text):
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=f"{prompt} This user's input: {ai_text}",
    )

    print(response.text)

    return parse_ai_tasks(response.text)

def parse_ai_tasks(response_str: str) -> list[schemas.TodoAI]:
    
    cleaned = response_str.strip().strip("`")
    if cleaned.startswith("json"):
        cleaned = cleaned[4:].strip()
    
  
    try:
        data = json.loads(cleaned)
        return [schemas.TodoAI(**item) for item in data]
    except json.JSONDecodeError:
        raise ValueError("Ошибка парсинга JSON из AI-ответа")