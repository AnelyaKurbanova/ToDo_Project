'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";

type Todo = {
  id: number;
  title: string;
  is_done: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDone, setFilterDone] = useState<"all" | "done" | "pending">("all");

  const router = useRouter();

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch {
      alert("Ошибка получения задач");
      router.push("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTodos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !title.trim()) return;

    await api.post(
      "/todos/",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    fetchTodos();
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token || !editTitle.trim()) return;

    await api.put(
      `/todos/${id}`,
      { title: editTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingId(null);
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await api.delete(`/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTodos();
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterDone === "all" ||
      (filterDone === "done" && todo.is_done) ||
      (filterDone === "pending" && !todo.is_done);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 Мои задачи</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-xl shadow-sm"
        >
          Выйти
        </button>
      </div>

      <form onSubmit={handleAddTodo} className="mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow w-full"
        >
          ➕ Добавить
        </button>
      </form>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="🔍 Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterDone}
          onChange={(e) => setFilterDone(e.target.value as any)}
          className="border border-gray-300 rounded-xl px-2 py-2 shadow-sm"
        >
          <option value="all">Все</option>
          <option value="done">✔ Выполненные</option>
          <option value="pending">⏳ Ожидают</option>
        </select>
      </div>

      {filteredTodos.map((todo) => (
        <div
          key={todo.id}
          className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-md transition hover:shadow-lg"
        >
          {editingId === todo.id ? (
            <div className="flex flex-col gap-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Новое название"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleUpdate(todo.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-xl"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded-xl"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-lg font-medium ${todo.is_done ? "line-through text-gray-400" : ""}`}>
                  {todo.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Статус: {todo.is_done ? "✔ Выполнено" : "⏳ В процессе"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditTitle(todo.title);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-xl text-sm flex items-center gap-1"
                >
                  ✏️ <span className="hidden sm:inline">Редакт.</span>
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-xl text-sm flex items-center gap-1"
                >
                  🗑️ <span className="hidden sm:inline">Удалить</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
