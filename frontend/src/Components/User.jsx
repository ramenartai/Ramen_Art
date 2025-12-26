import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const User = ({ userData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const profileImage = userData?.picture || null;

  const handleLogout = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    setShowPopup(false);
    navigate('/profile');
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
              <button onClick={handleProfileClick}>Profile</button>
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
    cursor: pointer;
    position: relative;
    width: var(--diameter);
    height: var(--diameter);
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;
  }

  .avatar-container:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
  }

  .user-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-container svg {
    width: 18px;
    height: 18px;
  }

  .popup-window {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(37, 37, 56, 0.98) 100%);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0;
    width: 200px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(20px);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 999;
  }

  input:checked ~ .popup-window {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .user-info {
    padding: 16px;
    color: #ffffff;
    font-weight: 600;
    font-size: 0.95rem;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(99, 102, 241, 0.2);
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 8px 0;
    margin: 0;
  }

  li {
    margin: 0;
  }

  button {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button:hover {
    background: rgba(99, 102, 241, 0.1);
    color: #ffffff;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;

export default User;