import React, { useState, useRef, useEffect } from "react";
import handleSubmit from "./getStory";

const MIN_WIDTH = 260;
const MAX_WIDTH = 480;

// Enhanced JSON extraction + validation
function extractStoryJson(text) {
  if (!text) return { isValidStory: false, json: null, storyText: "", chatText: text };
  
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
          // ✅ Validate it's a STORY (has required story fields)
          if (json.story_metadata && json.main_characters && json.story_arcs) {
            return {
              isValidStory: true,
              json,
              storyText: "(Story generated and sent to canvas)",
              chatText: text.slice(0, start).trim()
            };
          }
        } catch (e) {
          // Not valid JSON, continue searching
        }
      }
    }
    start = text.indexOf("{", start + 1);
  }
  
  return { 
    isValidStory: false, 
    json: null, 
    storyText: "", 
    chatText: text 
  };
}

const StoryChatbox = ({ onStoryData }) => {
  const [width, setWidth] = useState(260);
  const isResizing = useRef(false);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "Welcome! Describe your manga idea or chat about stories.", isMarkdown: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(""); // Dynamic loading text
  const [pendingText, setPendingText] = useState("");

  const contentRef = useRef(null);

  // Dynamic loading messages based on context
  useEffect(() => {
    if (!isLoading) return;
    
    const messages = [
      "Generating story...",
      "Building characters...",
      "Creating plot arcs...",
      "Structuring chapters...",
      "Finalizing manga outline...",
      "Almost ready ⏳"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[index % messages.length]);
      index++;
    }, 800);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  // Mouse resize handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      setWidth((prev) => {
        const newWidth = prev - e.movementX;
        return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      });
    };
    const handleMouseUp = () => { isResizing.current = false; };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    contentRef.current?.scrollTo(0, contentRef.current.scrollHeight);
  }, [messages, isLoading]);

  // Process response: JSON → Canvas, Text → Chat
  useEffect(() => {
    if (!pendingText) return;
    
    const { isValidStory, json, storyText, chatText } = extractStoryJson(pendingText);
    
    // Add to chat history
    setMessages(prev => {
      const newMsgs = [...prev];
      
      if (isValidStory) {
        // STORY: Send to canvas + show confirmation
        newMsgs.push({ 
          id: Date.now(), 
          sender: "assistant", 
          text: storyText, 
          isStory: true,
          isMarkdown: false 
        });
        setTimeout(() => onStoryData?.(json), 300);
      } else {
        // NORMAL CHAT: Just add conversation
        newMsgs.push({ 
          id: Date.now(), 
          sender: "assistant", 
          text: chatText, 
          isMarkdown: false 
        });
      }
      return newMsgs;
    });
    
    setPendingText("");
    setIsLoading(false);
  }, [pendingText, onStoryData]);

  // Enhanced submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isLoading) return;

    // Add user message
    setMessages(prev => {
      let filtered = prev.filter(m => 
        !(m.sender === "system" && m.text.startsWith("Welcome!"))
      );
      return [...filtered, { id: Date.now(), sender: "user", text: userInput, isMarkdown: false }];
    });

    setInput("");
    setIsLoading(true);
    
    // Simulate typing delay + get response
    setTimeout(async () => {
      const responseText = await handleSubmit(null, userInput, () => {}, messages, () => {});
      setPendingText(responseText);
    }, 500);
  };

  return (
    <div className="story-chat-wrapper" style={{ width }}>
      <div
        className="story-chat-resizer"
        onMouseDown={() => { isResizing.current = true; }}
      />

      <aside className="story-chat-column">
        <div className="story-chat-header">🤖 Manga AI Assistant</div>

        <div className="story-chat-content" ref={contentRef}>
          <div className="story-chat-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`story-chat-msg ${
                  m.sender === "user" 
                    ? "story-chat-msg-user" 
                    : m.isStory 
                    ? "story-chat-msg-story" 
                    : "story-chat-msg-assistant"
                }`}
              >
                {m.text}
              </div>
            ))}
            
            {isLoading && (
              <div className="story-chat-msg story-chat-msg-assistant" style={{ 
                color: '#666', 
                fontStyle: 'italic',
                opacity: 0.8 
              }}>
                <span className="loader" style={{ marginRight: 8 }}>✨</span>
                {loadingMessage}
              </div>
            )}
          </div>
        </div>

        <form className="story-chat-input-bar" onSubmit={onSubmit}>
          <input
            type="text"
            className="story-chat-input"
            placeholder={
              isLoading 
                ? "Generating..." 
                : "Describe your manga idea... (e.g., 'ramen chef action story')"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="story-chat-send-btn"
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{ 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? "⏳" : "✨"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default StoryChatbox;
