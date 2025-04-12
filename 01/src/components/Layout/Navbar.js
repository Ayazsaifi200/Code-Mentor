import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle, initializeGoogleAuth } from '../../services/googleAuthService';
import AuthDropdown from './AuthDropdown';
import UserProfile from './UserProfile';
import '../../styles/navbar.css';

const Navbar = ({ activeTab, onTabChange, user, onLoginSuccess, onLogout }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize Google Auth when component mounts
    initializeGoogleAuth().catch(err => {
      console.error("Failed to initialize Google Auth:", err);
    });
    
    // Listen for Google login success
    const handleGoogleLoginSuccess = (event) => {
      console.log("Google login success event received");
      onLoginSuccess(event.detail);
      navigate('/profile');
    };
    
    document.addEventListener('google-login-success', handleGoogleLoginSuccess);
    
    return () => {
      document.removeEventListener('google-login-success', handleGoogleLoginSuccess);
    };
  }, [navigate, onLoginSuccess]);

  const handleGoogleSignUp = async () => {
    if (isAuthenticating) return; // Prevent multiple attempts
    
    setIsAuthenticating(true);
    try {
      console.log("Starting Google sign-up process...");
      await signInWithGoogle();
      // The event listener will handle the success case
    } catch (error) {
      console.error('Google sign-up failed:', error);
      alert(`Google sign-up failed: ${error.message || "Something went wrong"}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">AI Code Mentor</Link>
      </div>
      
      <div className="navbar-tabs">
        <Link 
          to="/"
          className={`navbar-tab ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => onTabChange('editor')}
        >
          Code Editor
        </Link>
        <Link 
          to="/dashboard"
          className={`navbar-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </Link>
        <Link 
          to="/github"
          className={`navbar-tab ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => onTabChange('github')}
        >
          GitHub
        </Link>
      </div>
      
      <div className="navbar-auth">
        {user ? (
          <UserProfile user={user} onLogout={onLogout} />
        ) : (
          <AuthDropdown 
            onLoginSuccess={onLoginSuccess} 
            onShowGoogleSignUp={handleGoogleSignUp}
            isAuthenticating={isAuthenticating}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;