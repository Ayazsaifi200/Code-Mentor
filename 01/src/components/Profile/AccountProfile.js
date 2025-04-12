import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import '../../styles/profile.css';

const AccountProfile = ({ user }) => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState({
    name: '',
    email: '',
    photoURL: '',
    role: '',
    createdAt: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("Setting account details from user:", user);
      setAccountDetails({
        name: user.name || user.displayName || 'Anonymous User',
        email: user.email || 'No email provided',
        photoURL: user.photoURL || '',
        role: user.role || 'user',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
      });
      setIsLoading(false);
    } else {
      console.warn("No user object provided to AccountProfile");
      setIsLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      window.location.reload(); // Force a reload to clear any auth state
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Not Logged In</h2>
          <p>Please sign in to view your profile</p>
          <button onClick={() => navigate('/')} className="button primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Account Profile</h1>
      </div>

      <div className="profile-main">
        <div className="profile-card user-info-card">
          <div className="card-header">
            <div className="profile-picture">
              {accountDetails.photoURL ? (
                <img 
                  src={accountDetails.photoURL} 
                  alt={`${accountDetails.name}'s profile`} 
                  className="profile-image" 
                />
              ) : (
                <div className="profile-initial">
                  {accountDetails.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="profile-name">
              <h2>{accountDetails.name}</h2>
              <p className="profile-email">{accountDetails.email}</p>
              {user.googleId && (
                <span className="google-badge">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                    alt="Google" 
                    width="16" 
                    height="16"
                  />
                  Google Account
                </span>
              )}
            </div>
          </div>

          <div className="card-content">
            <div className="profile-details">
              <div className="detail-group">
                <label>Role</label>
                <span>{accountDetails.role}</span>
              </div>
              <div className="detail-group">
                <label>Member Since</label>
                <span>{accountDetails.createdAt}</span>
              </div>
              <div className="detail-group">
                <label>Account Type</label>
                <span>{user.googleId ? 'Google Account' : 'Email Account'}</span>
              </div>
            </div>
          </div>
        </div>

        {user.preferences && (
          <div className="profile-card preferences-card">
            <h3>Preferences</h3>
            <div className="preference-group">
              <label>Theme</label>
              <span>{user.preferences.theme || 'Light'}</span>
            </div>
            <div className="preference-group">
              <label>Language</label>
              <span>{user.preferences.language || 'JavaScript'}</span>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;