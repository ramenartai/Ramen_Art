// Options.js
import React from "react";
import "../Css/options.css";
import TOOLS from "../Elements/tools";

const Options = ({ onOpenStoryboard }) => (
  <aside className="options-column">
    <div className="options-tools">
      {TOOLS.map((label) => (
        <button
          key={label}
          className="options-tool-btn"
          onClick={() => {
            if (label === "Story board") onOpenStoryboard();
          }}
        >
          <span className="options-tool-label">{label}</span>
        </button>
      ))}
    </div>
  </aside>
);

export default Options;
