// Storyboard.js
import React, { useState, useRef } from "react";
import StoryChatbox from "./storyChatbox";
import StoryCanvas from "./storyCanvas";
import "../Css/storyboard.css";

const Storyboard = ({ onClose, initialStoryData = null }) => {
  const [storyData, setStoryData] = useState(initialStoryData);
  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPinned, setIsPinned] = useState(!!initialStoryData); // Auto-pin if viewing saved story
  const [isSaving, setIsSaving] = useState(false);
  const chatboxRef = useRef(null);

  const handleSave = async () => {
    if (!storyData) {
      alert('No story to save! Generate a story first.');
      return;
    }

    if (isPinned) {
      alert('Story already saved!');
      return;
    }

    setIsSaving(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/api/story/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        setIsPinned(true);
        alert('Story saved successfully! ✨');
      } else {
        const error = await response.json();
        alert(`Failed to save story: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExampleClick = (exampleText) => {
    // Trigger the chatbox to send this prompt
    if (chatboxRef.current) {
      chatboxRef.current.sendMessage(exampleText);
    }
  };

  const examplePrompts = [
    "A revenge story about a ramen chef",
    "Dark fantasy with memory powers",
    "Sci-fi detective in Tokyo 2077"
  ];

  return (
    <div className="storyboard-overlay">
      <div className={`storyboard-window ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="storyboard-controls">
          <button
            className={`storyboard-control-btn storyboard-pin ${isPinned ? 'pinned' : ''}`}
            onClick={handleSave}
            disabled={isSaving || !storyData}
            title={isPinned ? "Story Saved" : "Save Story"}
          >
            {isSaving ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="spinning">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
              </svg>
            )}
          </button>
          <button
            className="storyboard-control-btn storyboard-fullscreen"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
          <button className="storyboard-control-btn storyboard-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Top Input Bar */}
        <div className="story-top-bar">
          <h1 className="story-title">Manga Story Generator</h1>
          <p className="story-subtitle">
            Transform your ideas into structured manga stories with AI
          </p>
        </div>

        {/* Main Split Layout */}
        <div className="story-main-split">
          {/* Left: Prompt Reference */}
            <div className="story-prompt-section">
              <div className="story-section-header">
                <h3>Prompt Reference</h3>
                <span className="story-section-badge">Chat</span>
              </div>
              <StoryChatbox ref={chatboxRef} onStoryData={setStoryData} />
            </div>

          {/* Right: Generated Results */}
          <div className="story-results-section">
            <div className="story-section-header">
              <h3>Generated Results</h3>
              <span className="story-section-badge">
                {storyData ? "Story Visualized" : "Awaiting Generation"}
              </span>
            </div>
            <div className="story-results-content">
              {storyData ? (
                <StoryCanvas storyJson={storyData} />
              ) : (
                <div className="story-empty-state">
                  <div className="empty-state-icon">📖</div>
                  <h3>No story yet — get inspired!</h3>
                  <p>
                    Describe your manga idea in the chat and watch it come to
                    life as a visual story structure.
                  </p>
                  <div className="empty-state-examples">
                    {examplePrompts.map((prompt, index) => (
                      <span
                        key={index}
                        className="example-badge"
                        onClick={() => handleExampleClick(prompt)}
                      >
                        💡 "{prompt}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;
