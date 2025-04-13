import React, { useState, useEffect, useRef } from "react";
import styles from "./MemoryLaneChat.module.css";

const MemoryLaneChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      type: "user",
      text: input,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title:
            "User is wantig to talk to you, kriyana. Please give consider the length of your reply also this is a chat system from memory vault app so be short while replying",
          description: input,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        text: data.response,
        time: getTime(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const botMessage = {
        type: "bot",
        text: "Sorry, there was an issue with the bot. Please try again later.",
        time: getTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatContainer}>
        <div className={styles.chatBody}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${
                msg.type === "user" ? styles.userMessage : styles.botMessage
              }`}
            >
              <div>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              Kriyana is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className={styles.chatFooter}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default MemoryLaneChat;
