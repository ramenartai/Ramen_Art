import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * AuthCallback Component
 * Handles Google OAuth redirects
 * Route: /auth/callback
 * 
 * This component receives the JWT token from backend
 * and stores it in localStorage, then redirects to app
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No authentication token received');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    try {
      // Store JWT token
      localStorage.setItem('token', token);
      
      // Optionally decode token to get user info
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // localStorage.setItem('user', JSON.stringify(payload));
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = '/app';
      }, 1000);
      
    } catch (err) {
      setError('Failed to process authentication');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>❌ Authentication Failed</h2>
          <p>{error}</p>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loadingBox}>
        <div style={styles.spinner}></div>
        <h2>✅ Authentication Successful!</h2>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px'
  },
  errorBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    color: '#dc2626'
  },
  spinner: {
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #2d79f3',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  }
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);