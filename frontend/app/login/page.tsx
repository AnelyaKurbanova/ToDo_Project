'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/auth/login",
        new URLSearchParams({ username, password })
      );

      localStorage.setItem("token", res.data.access_token);
      router.push("/todos");
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Вход</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          Войти
        </button>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-sm text-blue-500 hover:underline self-start"
        >
          Нет аккаунта? Зарегистрироваться →
        </button>
      </form>
    </div>
  );
}
