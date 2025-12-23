import React, { useState, useRef, useEffect } from "react";

const MIN_WIDTH = 260;
const MAX_WIDTH = 480;

const StoryChatbox = () => {
  const [width, setWidth] = useState(260);
  const isResizing = useRef(false);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "Welcome! Type a prompt and press Run." },
  ]);

  const contentRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      setWidth((prev) => {
        const newWidth = prev - e.movementX;
        if (newWidth < MIN_WIDTH) return MIN_WIDTH;
        if (newWidth > MAX_WIDTH) return MAX_WIDTH;
        return newWidth;
      });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // scroll to bottom when messages change
  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="story-chat-wrapper" style={{ width }}>
      <div
        className="story-chat-resizer"
        onMouseDown={() => {
          isResizing.current = true;
        }}
      />

      <aside className="story-chat-column">
        <div className="story-chat-header">External Services</div>

        <div className="story-chat-content" ref={contentRef}>
          <div className="story-chat-group-title">General AI Settings</div>

          <div className="story-chat-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.sender === "user"
                    ? "story-chat-msg story-chat-msg-user"
                    : "story-chat-msg"
                }
              >
                {m.text}
              </div>
            ))}
          </div>
        </div>

        <form className="story-chat-input-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            className="story-chat-input"
            placeholder="Type prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="story-chat-send-btn" type="submit">
            Run
          </button>
        </form>
      </aside>
    </div>
  );
};

export default StoryChatbox;
