import React from "react";
import '../Css/panels.css'

const mockPanels = new Array(10).fill(null).map((_, i) => i + 1);

const Panels = () => {
  return (
    <aside className="panels-column">
      <div className="panels-header">Panels</div>

      <div className="panels-list">
        {mockPanels.map((id) => (
          <div key={id} className="panel-thumb">
            <span className="panel-thumb-label">{id}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Panels;
