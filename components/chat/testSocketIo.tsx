"use client";

import React, { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

type Message = {
  sender: string;
  message: string;
};

const TestSocketIo = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    socketRef.current = io("http://localhost:7777");

    socketRef.current.on("receive_message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (currentMessage.trim() && username.trim()) {
      const newMessage = { sender: username, message: currentMessage };
      socketRef.current?.emit("send_message", newMessage); // Send message to server
      setCurrentMessage(""); // Clear input field
    }
  };

  return (
    <div
      className="App"
      style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
    >
      <h1>Real-time Chat App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px", width: "100%" }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default TestSocketIo;
