import React, { useState, useRef, useEffect } from "react";
import handleSubmit from "./getStory";

const MIN_WIDTH = 260;
const MAX_WIDTH = 480;

// Helper to extract first valid JSON and non-JSON text
function extractFirstJson(text) {
  if (!text) return { json: null, before: "", after: text };
  let start = text.indexOf("{");
  while (start !== -1) {
    let stack = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === "{") stack++;
      if (text[i] === "}") stack--;
      if (stack === 0 && text[i] === "}") {
        const jsonStr = text.slice(start, i + 1);
        try {
          const json = JSON.parse(jsonStr);
          return {
            json,
            before: text.slice(0, start).trim(),
            after: text.slice(i + 1).trim(),
          };
        } catch (e) {
          // Not valid JSON, keep searching
        }
      }
    }
    start = text.indexOf("{", start + 1);
  }
  return { json: null, before: text, after: "" };
}

const StoryChatbox = ({ onStoryData }) => {
  const [width, setWidth] = useState(260);
  const isResizing = useRef(false);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "Welcome! Type a prompt and press Run.", isMarkdown: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingText, setPendingText] = useState("");

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
  }, [messages, isLoading]);

  // When pendingText is set (after response), extract JSON and update chat/canvas
  useEffect(() => {
    if (!pendingText) return;
    const { json, before, after } = extractFirstJson(pendingText);
    if (json) {
      // Smooth transition: fade out loader, fade in canvas (optional, for now just setTimeout)
      setTimeout(() => {
        onStoryData && onStoryData(json);
      }, 200); // slight delay for smoothness
    }
    setMessages((prev) => {
      let newMsgs = [...prev];
      if (before) newMsgs.push({ id: Date.now() + 1, sender: "system", text: before, isMarkdown: false });
      if (after) newMsgs.push({ id: Date.now() + 2, sender: "system", text: after, isMarkdown: false });
      if (!before && !after && json) newMsgs.push({ id: Date.now() + 3, sender: "system", text: "(story sent to canvas)", isMarkdown: false });
      return newMsgs;
    });
    setPendingText("");
    setIsLoading(false);
  }, [pendingText, onStoryData]);

  // Custom handleSubmit for loader + artifact logic
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setMessages((prev) => {
      // Remove welcome message if present
      let filtered = prev.filter(
        (m) => !(m.sender === "system" && m.text.startsWith("Welcome!"))
      );
      return [
        ...filtered,
        { id: Date.now(), sender: "user", text: input.trim(), isMarkdown: false },
      ];
    });
    setInput("");
    setIsLoading(true);
    setTimeout(async () => {
      let responseText = await handleSubmit(null, input, () => {}, messages, () => {});
      setPendingText(responseText);
    }, 500);
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
        <div className="story-chat-header">AI Services</div>

        <div className="story-chat-content" ref={contentRef}>
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
                {!m.isMarkdown && m.text}
              </div>
            ))}
            {isLoading && (
              <div className="story-chat-msg" style={{ color: '#b32626', fontStyle: 'italic', opacity: 0.85, transition: 'opacity 0.3s' }}>
                <span className="loader" style={{ marginRight: 8 }}>⏳</span> Generating story artifact...
              </div>
            )}
          </div>
        </div>

        <form className="story-chat-input-bar" onSubmit={onSubmit}>
          <input
            type="text"
            className="story-chat-input"
            placeholder="Type prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="story-chat-send-btn"
            type="submit"
            disabled={isLoading}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? "..." : "Run"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default StoryChatbox;
