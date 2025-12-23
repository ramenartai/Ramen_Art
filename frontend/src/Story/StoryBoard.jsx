// Storyboard.js
import React, { useState } from "react";
import StoryChatbox from "./storyChatbox";
import StoryCanvas from "./storyCanvas";
import "../Css/storyboard.css";

const Storyboard = ({ onClose }) => {
  const [storyData, setStoryData] = useState(null);

  return (
    <div className="storyboard-overlay">
      <div className="storyboard-window">
        <button className="storyboard-close" onClick={onClose}>
          ×
        </button>

        <div className="storyboard-content">
          <div className="storyboard-canvas">
            <StoryCanvas storyJson={storyData} />
          </div>
          <div className="storyboard-chat">
            <StoryChatbox onStoryData={setStoryData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storyboard;
