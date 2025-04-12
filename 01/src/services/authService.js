let currentUser = null;
let authToken = null;

// Add this function to store user data after successful login
export const setCurrentUser = (userData, token) => {
  console.log("Setting current user:", userData?.email || "unknown user");
  
  if (!userData) {
    console.error("Invalid user data provided to setCurrentUser");
    return false;
  }
  
  currentUser = userData;
  authToken = token;
  
  // Also save to localStorage for persistence
  if (userData && token) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      console.log("User data saved to localStorage");
      return true;
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      return false;
    }
  }
  return false;
};

export const login = async (email, password) => {
  try {
    console.log("Attempting login with email:", email);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      console.error("Login failed with status:", response.status);
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log("Login successful:", data.user?.email);
    setCurrentUser(data.user, data.token);
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    console.log("Logging out user");
    // Call the backend to invalidate the session
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    // Clear local state
    currentUser = null;
    authToken = null;
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log("User logged out, storage cleared");
    
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  // First check memory
  if (currentUser) {
    console.log("Returning user from memory:", currentUser.email);
    return currentUser;
  }
  
  // Then check localStorage
  try {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        currentUser = JSON.parse(savedUser);
        authToken = savedToken;
        console.log("Restored user from localStorage:", currentUser.email);
        return currentUser;
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  
  // Finally, try to get from server
  try {
    console.log("Attempting to get current user from server");
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${authToken || ''}`
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.log("No authenticated user found on server");
      return null;
    }

    const data = await response.json();
    console.log("User retrieved from server:", data.user?.email);
    setCurrentUser(data.user, data.token || '');
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getAuthToken = () => {
  return authToken || localStorage.getItem('token');
};