// Chatbox.jsx
import React, { useState, useRef, useEffect } from "react";
import '../Css/chatbot.css'

const MIN_WIDTH = 220;
const MAX_WIDTH = 480;

const Chatbox = () => {
  const [width, setWidth] = useState(260); // default width
  const isResizing = useRef(false);

  // mouse move / up on the whole window
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;

      setWidth((prev) => {
        const newWidth = prev - e.movementX; // drag from left
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

  return (
    <div className="chat-wrapper" style={{ width }}>
      {/* drag handle on the left */}
      <div
        className="chat-resizer"
        onMouseDown={() => {
          isResizing.current = true;
        }}
      />

      <aside className="column chat-column">
        <div className="chat-header">External Services</div>

        <div className="chat-content">
          <div className="chat-group-title">General AI Settings</div>
          <div className="chat-placeholder">
            Prompt and options will go here.
          </div>
        </div>

        <div className="chat-input-bar">
          <input
            type="text"
            className="chat-input"
            placeholder="Type prompt..."
          />
          <button className="chat-send-btn">Run</button>
        </div>
      </aside>
    </div>
  );
};

export default Chatbox;
