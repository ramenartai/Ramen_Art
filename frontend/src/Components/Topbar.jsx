import React from "react";
import MENU_ITEMS from '../Elements/menu.js'

const TopBar = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          {/* Put your logo image or icon here */}
          <span className="topbar-logo-mark">🜲</span>
        </div>

        <nav className="topbar-menu">
          {MENU_ITEMS.map((item) => (
            <button key={item} className="topbar-menu-item">
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TopBar;
