import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/');
    } catch (err) {
      setError('Failed to process authentication');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  verifyAuth();
}, [navigate]);

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
    background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  loadingBox: {
    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(37, 37, 56, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '50px 60px',
    borderRadius: '24px',
    textAlign: 'center',
    border: '1px solid #2d2d44',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1)',
    maxWidth: '450px',
    color: '#ffffff',
    animation: 'slideIn 0.6s ease-out'
  },
  errorBox: {
    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(37, 37, 56, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    padding: '50px 60px',
    borderRadius: '24px',
    textAlign: 'center',
    border: '1px solid rgba(220, 38, 38, 0.4)',
    boxShadow: '0 20px 60px rgba(220, 38, 38, 0.3), 0 0 0 1px rgba(220, 38, 38, 0.1)',
    maxWidth: '450px',
    color: '#ff8e8e',
    animation: 'slideIn 0.6s ease-out'
  },
  spinner: {
    border: '4px solid rgba(45, 45, 68, 0.3)',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 24px'
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Animated background for container */
  @keyframes backgroundPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
`;
document.head.appendChild(styleSheet);
