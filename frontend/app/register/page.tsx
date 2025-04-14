'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api"; // или "../lib/api" — в зависимости от структуры

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { username, password });
      router.push("/login"); // После успешной регистрации — на страницу логина
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Ошибка регистрации");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
        >
          Зарегистрироваться
        </button>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-sm text-blue-500 hover:underline self-start"
        >
          Уже есть аккаунт? Войти →
        </button>
      </form>
    </div>
  );
}
