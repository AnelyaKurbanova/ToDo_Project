'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";

type Todo = {
  id: number;
  title: string;
  description: string;
  is_done: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => setTodos(res.data))
    .catch(() => {
      alert("Ошибка получения задач");
      router.push("/login");
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.post(
        "/todos/",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      location.reload(); 
    } catch (err) {
      alert("Ошибка при добавлении задачи");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Мои задачи</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Выйти
        </button>
      </div>

      <form onSubmit={handleAddTodo} className="mb-6">
        <h2 className="text-lg font-bold mb-2">Добавить задачу</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          className="block border mb-2 p-1"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
          className="block border mb-2 p-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1">
          Добавить
        </button>
      </form>

      {todos.map(todo => (
        <div key={todo.id} className="border p-2 mb-2 rounded">
          <h3 className="font-semibold">{todo.title}</h3>
          <p>{todo.description}</p>
          <p className="text-sm text-gray-500">
            Статус: {todo.is_done ? "✔ Выполнено" : "⏳ В процессе"}
          </p>
        </div>
      ))}
    </div>
  );
}
