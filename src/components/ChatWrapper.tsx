"use client";

import { useChat } from "ai/react";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 用于页面跳转

export const ChatWrapper = () => {
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL; // 从环境变量读取 baseURL

  const [sessionId, setSessionId] = useState<string>(""); // 初始值设置为空字符串
  const [authorization, setAuthorization] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  // 使用 useChat 钩子，传递 sessionId 和 Authorization
  const { messages, handleInputChange, input, handleSubmit, setInput } = useChat({
    streamProtocol: 'text',
    api: `${baseURL}/chat`,
    body: { sessionId }, // 确保 sessionId 传递正确
    headers: { Authorization: `Bearer ${authorization}` }, // 确保 Authorization 传递正确
    onError: (error) => {
      console.error("Error during chat request:", error);
    },
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      // 从 localStorage 获取 Authorization
      const token = localStorage.getItem("Authorization");

      // 如果没有 Authorization，弹出提示并跳转到登录页面
      if (!token) {
        alert("没有权限，请先登录！");
        router.push("/login");
        return;
      }

      // 保存 Authorization 到状态中
      setAuthorization(token);

      try {
        // 发出 GET 请求访问 /createchat，附带本地 Authorization 作为请求头
        const res = await fetch(`${baseURL}/createchat`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token, // 读取的 Authorization 作为请求头
          },
        });

        if (res.status === 200) {
          const data = await res.json(); // 解析 JSON 响应
          setSessionId(data.chatID); // 设置 chatID
          setIsLoading(false); // 加载完成，设置为 false
        } else {
          // 如果状态码不是 200，弹出提示并跳转到登录页面
          alert("登录状态无效，请重新登录！");
          router.push("/login");
        }
      } catch (error) {
        console.error("网络错误:", error);
        // 处理网络错误时，弹出提示并跳转到登录页面
        alert("网络错误，请稍后再试！");
        router.push("/login");
      }
    };

    checkLoginStatus();
  }, [router, baseURL]); // 将 router 和 baseURL 作为依赖项

  // 加载期间显示的内容
  if (isLoading) {
    return <div>正在加载...</div>;
  }

  return (
    <div
      className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2"
    >
      <div className="flex-1 text-black bg-zinc-800 justify-between flex flex-col">
        <Messages messages={messages} />
      </div>
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setInput={setInput}
      />
    </div>
  );
};
