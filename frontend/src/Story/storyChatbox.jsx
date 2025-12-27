import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import handleSubmit from "./getStory";
import refinePrompt from "../utils/aiOptimize";
import Toast from "../Components/Toast";
import { BiSolidBot } from "react-icons/bi";
import { IoSend } from "react-icons/io5";

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

const StoryChatbox = forwardRef(({ onStoryData }, ref) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "Welcome! Describe your manga idea or chat about stories.", isMarkdown: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(""); // Dynamic loading text
  const [pendingText, setPendingText] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [toast, setToast] = useState(null);

  const contentRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Expose sendMessage method to parent via ref
  useImperativeHandle(ref, () => ({
    sendMessage: (text) => {
      if (!text || isLoading) return;
      setInput(text);
      // Trigger submit programmatically
      setTimeout(() => {
        handleSubmitMessage(text);
      }, 100);
    }
  }));

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

  // Extracted submit logic
  const handleSubmitMessage = async (userInput) => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    setMessages(prev => {
      let filtered = prev.filter(m =>
        !(m.sender === "system" && m.text.startsWith("Welcome!"))
      );
      return [...filtered, { id: Date.now(), sender: "user", text: trimmedInput, isMarkdown: false }];
    });

    setInput("");
    setIsLoading(true);

    // Simulate typing delay + get response
    setTimeout(async () => {
      const responseText = await handleSubmit(null, trimmedInput, () => { }, messages, () => { });
      setPendingText(responseText);
    }, 500);
  };

  // Manual refine handler
  const handleRefine = async () => {
    if (!input.trim()) return;

    setIsRefining(true);
    try {
      console.log('Refining prompt:', input.trim());
      const refined = await refinePrompt(input.trim());
      console.log('Received refined:', refined);
      console.log('Setting input to:', refined);
      setInput(refined);
      console.log('Input state updated');
      showToast('Prompt refined successfully!', 'success');
    } catch (error) {
      console.error('Refinement error:', error);
      showToast('Failed to refine prompt', 'error');
    } finally {
      setIsRefining(false);
    }
  };

  // Submit handler - just submit, no automatic refinement
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await handleSubmitMessage(input.trim());
  };

  return (
    <aside className="story-chat-column">
      <div className="story-chat-content" ref={contentRef}>
        <div className="story-chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`story-chat-msg ${m.sender === "user"
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
              : "Describe your manga idea..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="button"
          className="story-chat-refine-btn"
          onClick={handleRefine}
          disabled={isRefining || isLoading || !input.trim()}
          title="Refine your prompt with AI"
        >
          {isRefining ? "..." : <BiSolidBot />}
        </button>
        <button
          className="story-chat-send-btn"
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            cursor: isLoading || isRefining ? 'not-allowed' : 'pointer',
            opacity: isLoading || isRefining ? 0.6 : 1
          }}
        >
          {isLoading || isRefining ? "..." : <IoSend />}
        </button>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </aside>
  );
});

export default StoryChatbox;
