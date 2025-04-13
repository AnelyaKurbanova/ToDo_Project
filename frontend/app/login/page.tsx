'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";
  
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", new URLSearchParams({
        username,
        password,
      }));
  
      console.log("Ответ от сервера:", res.data); // <-- ЭТА СТРОКА!
  
      localStorage.setItem("token", res.data.access_token);
      router.push("/todos");
    } catch (err) {
      console.error("Ошибка при логине:", err);
      alert("Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4">
      <h2 className="text-xl font-bold mb-2">Вход</h2>
      <input placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} className="block mb-2 border p-1" />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} className="block mb-2 border p-1" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Войти</button>
    </form>
  );
}