import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY_AUTH = 'sahakari_seva_auth_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState(() => {
    if (currentUser?.role) return currentUser.role;
    return 'customer'; // Default role
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      if (currentUser.role) {
        setActiveRole(currentUser.role);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  // Log in with phone or email + password / OTP
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const res = await authAPI.login(credentials);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        setActiveRole(res.data.role);
        return { success: true, user: res.data };
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new customer, worker, or administrator
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const res = await authAPI.register(userData);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        setActiveRole(res.data.role);
        return { success: true, user: res.data };
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP for instant mobile sign in
  const verifyOtp = async (payload) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const res = await authAPI.verifyOtp(payload);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        setActiveRole(res.data.role);
        return { success: true, user: res.data };
      } else {
        throw new Error(res.message || 'OTP verification failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid OTP';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // Quick switch role helper
  const switchRole = (role) => {
    setActiveRole(role);
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        isAuthenticated: !!currentUser,
        isLoading,
        authError,
        login,
        register,
        verifyOtp,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
