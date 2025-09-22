import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* global firebase */

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Firebase configuration
    const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "your-auth-domain",
      projectId: "your-project-id",
      storageBucket: "your-storage-bucket",
      messagingSenderId: "your-messaging-sender-id",
      appId: "your-app-id"
    };

  useEffect(() => {
    // Load Firebase scripts
    const loadFirebaseScripts = async () => {
      if (typeof firebase === 'undefined') {
        // Load Firebase App
        const firebaseApp = document.createElement('script');
        firebaseApp.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-app-compat.min.js';
        document.head.appendChild(firebaseApp);

        // Load Firebase Auth
        const firebaseAuth = document.createElement('script');
        firebaseAuth.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-auth-compat.min.js';
        document.head.appendChild(firebaseAuth);

        // Wait for scripts to load
        await new Promise((resolve) => {
          let loadedCount = 0;
          const onLoad = () => {
            loadedCount++;
            if (loadedCount === 2) resolve();
          };
          firebaseApp.onload = onLoad;
          firebaseAuth.onload = onLoad;
        });
      }
      
      initializeFirebase();
    };

    loadFirebaseScripts();
  }, []);

  // Initialize Firebase
  const initializeFirebase = async () => {
    try {
      // Initialize Firebase using the global firebase object
      if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        const firebaseAuth = firebase.auth();
        setAuth(firebaseAuth);
        setFirebaseInitialized(true);
        console.log('Firebase initialized successfully for auth');
      } else {
        throw new Error('Firebase SDK not loaded');
      }
    } catch (error) {
      console.warn('Firebase initialization failed:', error);
      setAuth(null);
      setFirebaseInitialized(false);
      setError('Authentication service unavailable. Please try again later.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!auth || !firebaseInitialized) {
      setError("Authentication service not available. Please refresh the page and try again.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log("Logged in user:", userCredential.user);
      
      // Call onLogin if provided
      if (onLogin) {
        onLogin(userCredential.user);
      }
      
      // Navigate to admin panel (FIXED: navigate to correct route)
      navigate("/login");
      
    } catch (err) {
      console.error("Login error:", err);
      
      // Provide user-friendly error messages
      let errorMessage;
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        default:
          errorMessage = err.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={!firebaseInitialized || loading}
              autoComplete="email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={!firebaseInitialized || loading}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button 
            type="submit" 
            className="login-button"
            disabled={!firebaseInitialized || loading}
            style={{
              opacity: (firebaseInitialized && !loading) ? 1 : 0.6,
              cursor: (firebaseInitialized && !loading) ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Logging in...' : firebaseInitialized ? 'Login' : 'Initializing...'}
          </button>
        </form>
        
        {!firebaseInitialized && (
          <p style={{ 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '10px' 
          }}>
            Setting up authentication service...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;