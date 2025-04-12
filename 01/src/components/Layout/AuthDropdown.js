import React, { useState, useEffect } from 'react';
import { login } from '../../services/authService';
import { initializeGoogleAuth, renderGoogleButton } from '../../services/googleAuthService';
import '../../styles/auth.css';

const AuthDropdown = ({ onLoginSuccess, onShowGoogleSignUp, isAuthenticating = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleButtonRendered, setGoogleButtonRendered] = useState(false);
  const [googleButtonError, setGoogleButtonError] = useState(false);

  useEffect(() => {
    // Initialize Google Auth when dropdown is opened
    if (isOpen && !googleButtonRendered) {
      const setupGoogleButton = async () => {
        try {
          await initializeGoogleAuth();
          // Only show ONE button - either the Google rendered one or our custom one
          const googleContainer = document.getElementById('google-signin-container');
          const fallbackButton = document.querySelector('.google-signin-button-fallback');
          
          if (googleContainer && fallbackButton) {
            // Try to render Google's button
            const success = renderGoogleButton('google-signin-container');
            setGoogleButtonRendered(success);
            
            // Only show fallback if Google button failed to render
            if (success) {
              fallbackButton.style.display = 'none';
              setGoogleButtonError(false);
            } else {
              googleContainer.style.display = 'none';
              setGoogleButtonError(true);
            }
          }
        } catch (error) {
          console.error('Failed to initialize Google Auth:', error);
          setGoogleButtonError(true);
        }
      };
      
      setupGoogleButton();
    }
  }, [isOpen, googleButtonRendered]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      const user = await login(email, password);
      if (user) {
        setIsOpen(false);
        onLoginSuccess(user);
      } else {
        throw new Error('No user data returned');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-dropdown">
      <button 
        className="auth-button" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? 'Signing in...' : 'Sign In'}
      </button>
      
      {isOpen && !isAuthenticating && (
        <div className="dropdown-menu">
          <div className="dropdown-item">
            <form onSubmit={handleSignIn}>
              <h3>Sign In</h3>
              {loginError && <p className="error-message">{loginError}</p>}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="signin-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="separator">
              <span>OR</span>
            </div>
            
            {/* Container for Google's button */}
            <div id="google-signin-container" className="google-button-container"></div>
            
            {/* Fallback button - will be hidden if Google's button renders */}
            <button 
            className="google-signin-button-fallback"
            onClick={onShowGoogleSignUp}
            disabled={isAuthenticating}
          >
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                alt="Google"
                width="18"
                height="18"
              />
              Sign up with Google
            </button>
            
            {googleButtonError && (
              <p className="google-error-message">
                Google sign-in is temporarily unavailable. Please try again later.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDropdown;