/**
 * Login Page
 * Supports both local username/password and GitHub OAuth authentication
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { initiateOAuth } from '../services/githubAuthService';
import { ROUTES, APP_MODE } from '../utils/constants';

const LoginPage = () => {
  const { isAuthenticated, loginLocal, loginGitHub } = useAuth();
  const navigate = useNavigate();
  const [isLocalMode, setIsLocalMode] = useState(APP_MODE === 'local');

  // Local auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginLocal(username, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    try {
      initiateOAuth();
    } catch (error) {
      setError('Failed to initiate GitHub login. Please try again.');
    }
  };

  // Quick login buttons for demo
  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Architecture Bulletin
            </h1>
            <p className="text-gray-600">
              Team Deliverables Bulletin Board
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setIsLocalMode(true)}
                className={`px-4 py-2 text-sm font-medium border ${
                  isLocalMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } rounded-l-lg`}
              >
                Local Login
              </button>
              <button
                type="button"
                onClick={() => setIsLocalMode(false)}
                className={`px-4 py-2 text-sm font-medium border ${
                  !isLocalMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } rounded-r-lg border-l-0`}
              >
                GitHub OAuth
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Local Authentication Form */}
          {isLocalMode ? (
            <div className="space-y-6">
              <form onSubmit={handleLocalLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Admin:</span>
                    <button
                      onClick={() => quickLogin('admin', 'admin123')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      admin / admin123
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span>Architect 1:</span>
                    <button
                      onClick={() => quickLogin('architect1', 'arch123')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      architect1 / arch123
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span>Architect 2:</span>
                    <button
                      onClick={() => quickLogin('architect2', 'arch123')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      architect2 / arch123
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* GitHub OAuth Button */
            <div className="space-y-6">
              <button
                onClick={handleGitHubLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Login with GitHub
              </button>

              <p className="text-xs text-gray-500 text-center">
                Requires GitHub OAuth app configuration.
                See .env.example for setup instructions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          {isLocalMode ? 'Local Development Mode' : 'GitHub OAuth Mode'}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
