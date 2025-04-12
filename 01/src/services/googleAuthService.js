import { setCurrentUser } from './authService';

// Google Auth client
let googleAuth = null;
// Track if we're in the middle of authentication
let authInProgress = false;

// Initialize Google Auth
export const initializeGoogleAuth = async () => {
  try {
    if (window.google && googleAuth) return googleAuth;

    return new Promise((resolve, reject) => {
      // Remove any existing script to avoid duplicates
      const existingScript = document.getElementById('google-auth-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'google-auth-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          console.log("Google Auth script loaded successfully");
          googleAuth = window.google.accounts.id;
          const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 
            '478730833804-ls93bisvr77a68vv76l6nq40mcnr1gq1.apps.googleusercontent.com';
          
          console.log("Initializing with client ID:", clientId);
          googleAuth.initialize({
            client_id: clientId,
            callback: handleGoogleCredential,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          resolve(googleAuth);
        } catch (error) {
          console.error("Error initializing Google Auth:", error);
          reject(error);
        }
      };
      script.onerror = (error) => {
        console.error("Failed to load Google Auth script:", error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error initializing Google Auth:', error);
    throw error;
  }
};

// Direct callback handler for Google Auth
const handleGoogleCredential = async (response) => {
  console.log("Google credential received directly");
  
  if (authInProgress) {
    console.log("Auth already in progress, ignoring duplicate callback");
    return;
  }
  
  authInProgress = true;
  try {
    await processGoogleCredential(response.credential);
  } finally {
    authInProgress = false;
  }
};

// Process the credential and authenticate with backend
const processGoogleCredential = async (credential) => {
  try {
    console.log('Processing Google credential...');
    if (!credential) {
      console.error("No credential to process");
      throw new Error("Authentication failed - no credential");
    }
    
    // Show loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'google-auth-loading';
    loadingElement.innerHTML = 'Signing in with Google...';
    document.body.appendChild(loadingElement);
    
    // Send to backend
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token: credential }),
    });
    
    console.log("Backend response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.user || !data.token) {
      throw new Error('Invalid response from server');
    }
    
    console.log("Google auth successful:", data.user);
    
    // Store user data and refresh page to update UI
    setCurrentUser(data.user, data.token);
    
    // Dispatch a custom event that App.js can listen for
    const event = new CustomEvent('google-login-success', { detail: data.user });
    document.dispatchEvent(event);
    
    // If there's no event listener, refresh the page
    setTimeout(() => {
      // If we haven't redirected yet, refresh the page
      if (document.querySelector('.google-auth-loading')) {
        window.location.href = '/profile';
      }
    }, 1000);
  } catch (error) {
    console.error("Google authentication failed:", error);
    
    // Show error to user
    alert(`Google sign-in failed: ${error.message}`);
    
    // Dispatch error event
    const errorEvent = new CustomEvent('google-login-error', { 
      detail: { message: error.message } 
    });
    document.dispatchEvent(errorEvent);
  } finally {
    // Remove loading indicator
    const loadingElement = document.querySelector('.google-auth-loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  }
};

// Render Google button
export const renderGoogleButton = (elementId) => {
  try {
    if (!googleAuth) {
      console.warn("Google Auth not initialized yet");
      return false;
    }
    
    const buttonContainer = document.getElementById(elementId);
    if (!buttonContainer) {
      console.warn(`Container with ID ${elementId} not found`);
      return false;
    }
    
    // Clear any existing content
    buttonContainer.innerHTML = '';
    
    console.log("Rendering Google button in container:", elementId);
    googleAuth.renderButton(buttonContainer, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',  // Changed from 'signup_with' to 'signin_with'
      shape: 'rectangular',
      logo_alignment: 'left',
      width: buttonContainer.offsetWidth || 250
    });
    
    return true;
  } catch (error) {
    console.error('Error rendering Google button:', error);
    return false;
  }
};

// Prompt for Google sign in
export const signInWithGoogle = async () => {
  try {
    if (authInProgress) {
      console.log("Auth already in progress");
      return null;
    }
    
    console.log("Initiating Google sign-in prompt");
    
    if (!googleAuth) {
      await initializeGoogleAuth();
    }
    
    return new Promise((resolve, reject) => {
      const successListener = (event) => {
        document.removeEventListener('google-login-success', successListener);
        document.removeEventListener('google-login-error', errorListener);
        resolve(event.detail);
      };
      
      const errorListener = (event) => {
        document.removeEventListener('google-login-success', successListener);
        document.removeEventListener('google-login-error', errorListener);
        reject(new Error(event.detail.message));
      };
      
      // Set up event listeners
      document.addEventListener('google-login-success', successListener);
      document.addEventListener('google-login-error', errorListener);
      
      // Show the prompt
      googleAuth.prompt((notification) => {
        if (notification) {
          console.log("Google prompt notification:", notification.getNotDisplayedReason() || 
                                                  notification.getDismissedReason() || 
                                                  notification.getSkippedReason() || 
                                                  'unknown');
        }
      });
    });
  } catch (error) {
    console.error("Error in signInWithGoogle:", error);
    throw error;
  }
};