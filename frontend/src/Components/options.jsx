import React from "react";
import '../Css/options.css'
import TOOLS from '../Elements/tools.js'

const Options = () => {
  return (
    <aside className="options-column">
      <div className="options-logo">
        {/* logo icon here */}
      </div>

      <div className="options-tools">
        {TOOLS.map((label) => (
          <button key={label} className="options-tool-btn">
            <span className="options-tool-label">{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Options;
