import React, { useState, useRef, useCallback, useEffect } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid"
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null); // Reference for auto-scrolling

  const PHP_BACKEND_URL = "http://localhost:8000/server.php"; // Replace with your backend URL

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const newUserMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const response = await axios.post(
        PHP_BACKEND_URL,
        { messages: [newUserMessage] },
        { headers: { "Content-Type": "application/json" } }
      );

      const botMessage = {
        role: "assistant",
        content: response.data.choices?.[0]?.message?.content || "No response received.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response from PHP backend:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Abeg, no vex. My Server get issue. Try am again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white p-4">
    <div className="h-[3rem] sticky flex items-center justify-between top-2 w-full p-2 px-3 bg-gray-900 rounded-xl">
      <h1 className="font-bold text-xl text-blue-500">
      No Joy Ai
      </h1>
      <div className="font-bold text-lg text-gray-500">
        <span>Developer ||</span>
        <span className="text-blue-500"> JoeCode</span>
      </div>
    </div>
      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto  rounded-lg shadow-md mt-4 p-1 mb-[5rem]"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`max-w-[70%] relative overflow-hidden text-wrap  p p-3 rounded-lg ${msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
                }`}
            >
              <p className="text-sm w-full break-words">{msg.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-3 rounded-lg text-gray-200">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2 fixed bg-gray-800 bottom-1 w-full p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
          rows="1"
          style={{ minHeight: "4rem", maxHeight: "200px" }}
        />

        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="p-2  h-[4rem]  flex items-center"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-1 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <ArrowUpCircleIcon className="h-[4rem] w-[3rem] text-blue-600 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;