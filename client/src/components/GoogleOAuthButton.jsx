import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/UserSlice';
import { useNavigate } from 'react-router-dom';

const GoogleOAuthButton = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '654926123472-0see6p01gou57nrqb9jjsiervmu4hu6e.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      
      // Send the credential token to our backend
      const res = await axios.post('http://localhost:9000/api/google-oauth-login', {
        token: response.credential
      });

      if (res.data.success) {
        dispatch(loginUser(res.data.user));
        cogoToast.success(res.data.message);
        navigate('/super-admin-dashboard');
      } else {
        cogoToast.error(res.data.message);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      cogoToast.error(
        error?.response?.data?.message || 
        'Google OAuth login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div 
          id="google-signin-button" 
          className={`w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        ></div>
        
        {loading && (
          <div className="text-center mt-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-sm text-white/80">Signing in with Google...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-white/60 text-center">
        <p className="flex items-center justify-center gap-1">
          <span>🔒</span>
          <span>Only Super Admin accounts can login via Google</span>
        </p>
      </div>
    </div>
  );
};

export default GoogleOAuthButton;
