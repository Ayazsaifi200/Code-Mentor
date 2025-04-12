import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../services/authService';
import '../../styles/auth.css';

const UserProfile = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  // Guard against null user
  if (!user) return null;
  
  return (
    <div className="user-profile">
      <button 
        className="profile-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Toggle user menu"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL}
            alt={`${user.name}'s profile`} 
            className="profile-photo" 
          />
        ) : (
          <div className="profile-initial" aria-label={`${user.name}'s initial`}>
            {getInitial()}
          </div>
        )}
      </button>
      
      {showDropdown && (
        <div className="dropdown-menu profile-dropdown">
          <div className="dropdown-item">
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              {user.role === 'premium' && (
                <span className="premium-badge">Premium</span>
              )}
            </div>
            
            <Link 
              to="/profile" 
              className="view-profile-link"
              onClick={() => setShowDropdown(false)}
            >
              View Profile
            </Link>
            
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;