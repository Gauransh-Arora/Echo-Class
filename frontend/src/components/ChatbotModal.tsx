"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

type ChatbotModalProps = {
  onClose: () => void;
};

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatbotModal({ onClose }: ChatbotModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const placeholders = [
    "What is Beer Lambert Law?",
    "Explain the concept of absorbance",
    "How does concentration affect absorbance?",
    "Write the formula for absorbance",
    "Where can this law be applied?",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: "user", text: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    const accessToken = localStorage.getItem("access");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/classrooms/chatbot/",
        { message: userMessage.text },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage: Message = { role: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      alert("Something went wrong while contacting the chatbot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-md flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Chatbot
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t dark:border-neutral-700">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
