// User.jsx:
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const User = ({ userData }) => {
  const profileImage = userData?.profilePic || null;

  const handleLogout = async () => {
    try {
      // 1. Retrieve the token (usually stored in localStorage during login)
      const token = localStorage.getItem("token");

      // 2. Send the request to your specific endpoint
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout", 
        {}, // Empty body if the backend doesn't require specific data
        {
          headers: {
            Authorization: `Bearer ${token}`, // standard way to pass auth tokens
          },
        }
      );
    } catch (error) {
      console.error("Server logout failed, but we will clear local session:", error);
    } finally {
      // 3. Always clear local data and redirect, even if the server request fails
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to your login page
    }
  };

  return (
    <StyledWrapper>
      <label className="popup">
        <input type="checkbox" />
        <div tabIndex={0} className="avatar-container">
          {profileImage ? (
            <img src={profileImage} alt="User" className="user-img" />
          ) : (
            <svg viewBox="0 0 24 24" fill="white" height={18} width={18} xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
            </svg>
          )}
        </div>
        <nav className="popup-window">
          <div className="user-info">
             <span>{userData?.name || "Account"}</span>
          </div>
          <hr />
          <ul>
            <li>
              <button onClick={() => window.location.href = '/settings'}>Settings</button>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .popup {
    --bg: #1e1e1e;
    --border: #333;
    --diameter: 32px; /* Small, standard navbar size */
    display: inline-block;
    position: relative;
  }

  .popup input { display: none; }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    width: var(--diameter);
    height: var(--diameter);
    border-radius: 50%;
    border: 1px solid var(--border);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s;
  }

  .user-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .popup-window {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: 6px;
    background: #252525;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    border: 1px solid #333;
    top: calc(100% + 8px);
    right: 0;
    width: 140px;
    transition: 0.15s ease-out;
    z-index: 100;
  }

  .user-info {
    padding: 4px 8px;
    font-size: 12px;
    color: #888;
  }

  .popup-window ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .popup-window button {
    width: 100%;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    color: #eee;
    font-size: 13px;
    cursor: pointer;
    border-radius: 4px;
  }

  .popup-window button:hover {
    background: #00bf63;
    color: white;
  }

  .popup-window .logout-btn:hover { background: #e11d48; }

  .popup-window hr { border: 0; border-top: 1px solid #333; margin: 4px 0; }

  .popup input:checked ~ .popup-window {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  .avatar-container:hover { border-color: #00bf63; }
`;

export default User;