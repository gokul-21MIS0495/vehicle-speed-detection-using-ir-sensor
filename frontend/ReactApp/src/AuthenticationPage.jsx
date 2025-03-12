import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthenticationPage.css';

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup forms
  const [formData, setFormData] = useState({
    EmpId: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (isLogin) {
        // Login request
        response = await axios.post('http://localhost:5000/api/login', {
          username: formData.username,
          password: formData.password
        });
      } else {
        // Signup request
        response = await axios.post('http://localhost:5000/api/signup', {
          EmpId: formData.EmpId,
          username: formData.username,
          password: formData.password
        });
      }

      alert(response.data.message); // Show success message
      setLoading(false);

      if (isLogin && response.data.token) {
        // Save the token in local storage and redirect to homepage
        localStorage.setItem('token', response.data.token);
        navigate('/'); // Redirect to homepage or any other protected route
      } else {
        setIsLogin(true); // Switch to login after successful signup
      }

      // Reset form data after successful submission
      setFormData({ EmpId: '', username: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="input-group">
            <label htmlFor="EmpId">Employee ID:</label>
            <input
              type="text"
              name="EmpId"
              id="EmpId"
              value={formData.EmpId}
              onChange={handleChange}
              required={!isLogin} // Only required for signup
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="button-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Signup'}
          </button>
        </div>
      </form>

      <div className="toggle-form">
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthenticationPage;
