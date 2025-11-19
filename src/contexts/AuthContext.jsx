/**
 * Authentication Context
 * Manages user authentication state and operations
 * Supports both local username/password and GitHub OAuth
 */

import { createContext, useState, useEffect, useCallback } from 'react';

// GitHub OAuth services
import {
  getStoredAuth,
  storeAuth,
  clearAuth,
  validateToken,
  getUserProfile,
} from '../services/githubAuthService';

// Local auth services
import {
  loginWithPassword,
  validateLocalToken,
  getUserFromToken,
  storeLocalAuth,
  clearLocalAuth,
} from '../services/localAuthService';

import { initializeOctokit } from '../services/githubDataService';
import { APP_MODE } from '../utils/constants';
import { logAuthEvent, logError } from '../utils/logger';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState(APP_MODE); // 'local' or 'github'

  /**
   * Initialize authentication from stored data
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a stored auth mode
        const storedMode = sessionStorage.getItem('auth_mode') || 'local';
        setAuthMode(storedMode);

        if (storedMode === 'local') {
          // Local authentication
          const storedToken = sessionStorage.getItem('auth_token');
          const storedUserJson = sessionStorage.getItem('user');

          if (storedToken && storedUserJson) {
            const isValid = await validateLocalToken(storedToken);

            if (isValid) {
              const storedUser = JSON.parse(storedUserJson);
              setToken(storedToken);
              setUser(storedUser);
              setIsAuthenticated(true);

              logAuthEvent('local_session_restored', { username: storedUser.username });
            } else {
              clearLocalAuth();
              logAuthEvent('local_session_expired');
            }
          }
        } else {
          // GitHub authentication
          const { token: storedToken, user: storedUser } = getStoredAuth();

          if (storedToken && storedUser) {
            const isValid = await validateToken(storedToken);

            if (isValid) {
              initializeOctokit(storedToken);
              setToken(storedToken);
              setUser(storedUser);
              setIsAuthenticated(true);

              logAuthEvent('github_session_restored', { username: storedUser.username });
            } else {
              clearAuth();
              logAuthEvent('github_session_expired');
            }
          }
        }
      } catch (error) {
        logError('Failed to initialize authentication', error);
        clearAuth();
        clearLocalAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login with local username/password
   * @param {string} username
   * @param {string} password
   */
  const loginLocal = useCallback(async (username, password) => {
    try {
      setIsLoading(true);

      // Authenticate with local service
      const { token: authToken, user: userData } = await loginWithPassword(username, password);

      // Store authentication
      storeLocalAuth(authToken, userData);

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      setAuthMode('local');

      logAuthEvent('local_login', { username: userData.username, role: userData.role });

      return userData;
    } catch (error) {
      logError('Local login failed', error);
      clearLocalAuth();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with GitHub OAuth token
   * @param {string} authToken - GitHub access token
   * @param {boolean} remember - Use localStorage
   */
  const loginGitHub = useCallback(async (authToken, remember = false) => {
    try {
      setIsLoading(true);

      // Initialize Octokit
      initializeOctokit(authToken);

      // Get user profile from GitHub
      const profile = await getUserProfile(authToken);

      // Determine user role from config (would need to implement getUserRole for GitHub)
      // For now, default to architect
      const userData = {
        ...profile,
        role: 'architect', // TODO: Implement role determination from GitHub config
      };

      // Store authentication
      storeAuth(authToken, userData, remember);

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      setAuthMode('github');

      logAuthEvent('github_login', { username: userData.username, role: userData.role });

      return userData;
    } catch (error) {
      logError('GitHub login failed', error);
      clearAuth();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout and clear authentication
   */
  const logout = useCallback(() => {
    try {
      const username = user?.username;
      const mode = authMode;

      if (authMode === 'local') {
        clearLocalAuth();
      } else {
        clearAuth();
      }

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      logAuthEvent(`${mode}_logout`, { username });
    } catch (error) {
      logError('Logout failed', error);
    }
  }, [user, authMode]);

  /**
   * Check if user has admin role
   */
  const isAdmin = useCallback(() => {
    return user && user.role === 'admin';
  }, [user]);

  /**
   * Check if user has architect role
   */
  const isArchitect = useCallback(() => {
    return user && user.role === 'architect';
  }, [user]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    authMode,
    loginLocal,
    loginGitHub,
    logout,
    isAdmin,
    isArchitect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
