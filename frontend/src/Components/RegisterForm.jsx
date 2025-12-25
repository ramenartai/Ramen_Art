import React, { useState } from 'react';
import '../Css/register.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function RegisterForm() {
  const [formData, setFormData] = useState({ 
    name: '', 
    user_name: '', 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ FIXED: Removed duplicate /api/auth
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      
      // Successfully registered -> redirect to login
      window.location.href = '/login'; 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // uses /register/google (new users only)
  const handleGoogleRegister = () => {
    window.location.href = `${BACKEND_URL}/register/google`;
  };

  return (
    <div>
      <form className="form" onSubmit={handleRegister}>
        <h2>
          Create Account
        </h2>
        
        {/* Full Name */}
        <div className="flex-column">
          <label>Full Name</label>
        </div>
        <div className="inputForm">
          <input 
            name="name"
            type="text" 
            className="input" 
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Username */}
        <div className="flex-column">
          <label>Username</label>
        </div>
        <div className="inputForm">
          <input 
            name="user_name"
            type="text" 
            className="input" 
            placeholder="johndoe123"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input 
            name="email"
            type="email" 
            className="input" 
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input 
            name="password"
            type={showPassword ? "text" : "password"} 
            className="input" 
            placeholder="Create a Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div 
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{ opacity: showPassword ? 1 : 0.5, cursor: 'pointer' }}
          >
            👁
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="button-submit" disabled={loading}>
          {loading ? 'Creating Account…' : 'Sign Up'}
        </button>
        
        <p className="p">
          Already have an account?{' '}
          <span className="span" onClick={() => window.location.href = '/login'}>
            Log In
          </span>
        </p>
        
        <p className="p line">Or With</p>

        <button 
          type="button" 
          className="btn-google-large" 
          onClick={handleGoogleRegister}
        >
          <svg version="1.1" width="18" viewBox="0 0 512 512" style={{ marginRight: '10px' }}>
            <path style={{fill:'#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
            <path style={{fill:'#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176z"></path>
            <path style={{fill:'#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
            <path style={{fill:'#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"></path>
          </svg>
          Sign up with Google
        </button>
      </form>
    </div>
  );
}