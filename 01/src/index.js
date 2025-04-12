import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import './styles/editor.css';
import './styles/feedback.css';
import './styles/navbar.css';
import './styles/auth.css';
import './styles/profile.css'; // Add this line
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);