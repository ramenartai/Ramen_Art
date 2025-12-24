import React from "react";
import '../Css/layers.css'

const dummyLayers = [
  { id: 1, name: "Layer", visible: true, locked: false },
];

const Layers = () => {
  return (
    <aside className="layers-column">
      <div className="layers-header">
        <span>Layers</span>
        <div className="layers-header-actions">
          <button>↑</button>
          <button>↓</button>
          <button>🗎</button>
          <button>✖</button>
        </div>
      </div>

      <div className="layers-list">
        {dummyLayers.map((layer) => (
          <div key={layer.id} className="layer-row">
            <div className="layer-name">{layer.name}</div>
            <div className="layer-actions">
              <button className="layer-icon-btn">👁</button>
              <button className="layer-icon-btn">🔒</button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Layers;
