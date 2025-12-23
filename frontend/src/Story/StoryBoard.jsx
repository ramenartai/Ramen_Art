// Storyboard.js
import React from "react";
import StoryChatbox from "./storyChatbox";
import StoryCanvas from "./storyCanvas";
import "../Css/storyboard.css";

const Storyboard = ({ onClose }) => (
  <div className="storyboard-overlay">
    <div className="storyboard-window">
      <button className="storyboard-close" onClick={onClose}>
        ×
      </button>

      <div className="storyboard-content">
        <div className="storyboard-canvas">
          <StoryCanvas />
        </div>
        <div className="storyboard-chat">
          <StoryChatbox />
        </div>
      </div>
    </div>
  </div>
);

export default Storyboard;
