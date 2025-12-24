import React, { useState, useEffect } from "react";
import MENU_ITEMS from '../Elements/menu.js';
import User from './User.jsx';
import '../Css/topbar.css'; // See CSS below

const TopBar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Logic: Retrieve user data stored during login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
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

      <div className="topbar-right">
        {/* Pass the currentUser state down to the User component */}
        <User userData={currentUser} />
      </div>
    </header>
  );
};

export default TopBar;