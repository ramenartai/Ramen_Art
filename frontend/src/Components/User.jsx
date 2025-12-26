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
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.post(
        `${BACKEND_URL}/logout`,
        {}, // Empty body if the backend doesn't require specific data
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    --bg: rgba(26, 26, 46, 0.9);
    --border: rgba(99, 102, 241, 0.3);
    --diameter: 40px;
    display: inline-block;
    position: relative;
  }

  .popup input { display: none; }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    width: var(--diameter);
    height: var(--diameter);
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    position: relative;
  }

  .avatar-container::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #ec4899, #6366f1);
    background-size: 200% 200%;
    animation: gradientRotate 3s ease infinite;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  @keyframes gradientRotate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .avatar-container:hover::before {
    opacity: 1;
  }

  .avatar-container:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
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
    padding: 8px;
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(37, 37, 56, 0.98) 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.3);
    border: 1px solid rgba(99, 102, 241, 0.3);
    top: calc(100% + 12px);
    right: 0;
    min-width: 200px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(-10px);
    z-index: 1000;
    backdrop-filter: blur(20px);
  }

  .popup-window::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 12px;
    width: 12px;
    height: 12px;
    background: rgba(26, 26, 46, 0.98);
    border-left: 1px solid rgba(99, 102, 241, 0.3);
    border-top: 1px solid rgba(99, 102, 241, 0.3);
    transform: rotate(45deg);
  }

  .user-info {
    padding: 12px 16px;
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
    border-radius: 10px;
    margin-bottom: 4px;
  }

  .user-info span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    gap: 10px;
    padding: 10px 16px;
    color: #a0a0b8;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 10px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .popup-window button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .popup-window button:hover::before {
    left: 100%;
  }

  .popup-window button:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
    color: #ffffff;
    transform: translateX(4px);
  }

  .popup-window .logout-btn:hover {
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%);
    color: #ec4899;
  }

  .popup-window hr {
    border: 0;
    border-top: 1px solid rgba(99, 102, 241, 0.2);
    margin: 6px 0;
  }

  .popup input:checked ~ .popup-window {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;


export default User;