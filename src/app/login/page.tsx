"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: username }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("Authorization", data.token);
        router.push("/chat");
      } else {
        setError("用户名或密码错误");
      }
    } catch (error) {
      setError("网络错误，请稍后再试");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-zinc-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">登录</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white mb-2">
              密钥
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md focus:outline-none"
              placeholder="请输入密钥"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;