import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIXED: Removed duplicate /api/auth
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await res.json();
      
      // Store JWT token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to app
      window.location.href = '/app';

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Now uses /login/google (auto-registers if new)
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/login/google';
  };

  return (
    <div>
      <style>{css}</style>

      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#111827' }}>
          Welcome Back
        </h2>

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            type="email"
            className="input"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input
            type={showPassword ? 'text' : 'password'}
            className="input"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            style={{ cursor: 'pointer', opacity: showPassword ? 1 : 0.5 }}
            onClick={() => setShowPassword(!showPassword)}
          >
            👁
          </span>
        </div>

        <div className="flex-row">
          <div>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label style={{ marginLeft: 5 }}>Remember me</label>
          </div>
          <span className="span">Forgot password?</span>
        </div>

        {error && (
          <p style={{ color: '#dc2626', fontSize: 14, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button type="submit" className="button-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="p">
          Don't have an account?{' '}
          <span className="span" onClick={() => window.location.href = '/register'}>
            Sign Up
          </span>
        </p>

        <p className="p line">Or With</p>

        <button
          type="button"
          className="btn-google-large"
          onClick={handleGoogleLogin}
        >
          <svg version="1.1" width="18" viewBox="0 0 512 512">
            <path style={{fill:'#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
            <path style={{fill:'#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176z"></path>
            <path style={{fill:'#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
            <path style={{fill:'#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"></path>
          </svg>
          Continue with Google
        </button>
      </form>
    </div>
  );
}

const css = `
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.flex-column > label {
  color: #151717;
  font-weight: 600;
}

.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: 0.2s ease-in-out;
  box-sizing: border-box;
}

.input {
  flex: 1; 
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  height: 100%;
  background: transparent;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.span {
  font-size: 14px;
  color: #2d79f3;
  font-weight: 500;
  cursor: pointer;
}

.button-submit {
  margin: 20px 0 10px 0;
  background-color: #151717;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;
}

.button-submit:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.button-submit:hover:not(:disabled) {
  background-color: #252727;
}

.p {
  text-align: center;
  color: black;
  font-size: 14px;
  margin: 5px 0;
}

.btn-google-large {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 12px;
  border: 1px solid #ededef;
  background-color: white;
  color: #3c4043;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3.125px 0 rgba(60,64,67,0.149);
}

.btn-google-large:hover {
  background-color: #f8f9fa;
  border-color: #d2d2d2;
}

.line {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
}

.line::before, .line::after {
  content: "";
  height: 1px;
  width: 30%;
  background-color: #ededef;
  position: absolute;
}

.line::before { left: 0; }
.line::after { right: 0; }
`;