import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const STORAGE_KEY_ROLE_SESSIONS = 'sahakari_seva_role_sessions';
const STORAGE_KEY_ACTIVE_ROLE = 'sahakari_seva_active_role';
const LEGACY_STORAGE_KEY_AUTH = 'sahakari_seva_auth_user';

// Helper to safely read stored role sessions from localStorage
const getStoredSessions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROLE_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean out any sessions that have already exceeded 7 days
      const now = Date.now();
      let modified = false;
      const validSessions = {};

      for (const [role, session] of Object.entries(parsed || {})) {
        const expiresAt = session?.expiresAt || (session?.loggedInAt ? session.loggedInAt + SEVEN_DAYS_MS : null);
        if (session && expiresAt && now < expiresAt) {
          validSessions[role] = { ...session, expiresAt };
        } else {
          modified = true;
        }
      }

      if (modified) {
        localStorage.setItem(STORAGE_KEY_ROLE_SESSIONS, JSON.stringify(validSessions));
      }
      return validSessions;
    }

    // Migration from legacy single user key
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY_AUTH);
    if (legacy) {
      const user = JSON.parse(legacy);
      if (user && user.role) {
        const now = Date.now();
        const migrated = {
          [user.role]: {
            ...user,
            loggedInAt: user.loggedInAt || now,
            expiresAt: user.expiresAt || now + SEVEN_DAYS_MS
          }
        };
        localStorage.setItem(STORAGE_KEY_ROLE_SESSIONS, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_STORAGE_KEY_AUTH);
        return migrated;
      }
    }
    return {};
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [roleSessions, setRoleSessions] = useState(getStoredSessions);

  const [activeRole, setActiveRole] = useState(() => {
    const savedRole = localStorage.getItem(STORAGE_KEY_ACTIVE_ROLE);
    if (savedRole && ['customer', 'worker', 'admin'].includes(savedRole)) {
      return savedRole;
    }
    const initialSessions = getStoredSessions();
    const availableRoles = Object.keys(initialSessions);
    return availableRoles.length > 0 ? availableRoles[0] : 'customer';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync active role to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ROLE, activeRole);
  }, [activeRole]);

  // Check if a specific role has an active, unexpired 7-day session
  const isSessionValid = useCallback((role) => {
    if (!role) return false;
    const targetRole = role.toLowerCase();
    const session = roleSessions[targetRole];
    if (!session) return false;

    const expiresAt = session.expiresAt || (session.loggedInAt ? session.loggedInAt + SEVEN_DAYS_MS : 0);
    if (Date.now() > expiresAt) {
      // 7-day session expired
      return false;
    }
    return true;
  }, [roleSessions]);

  // Get session data for a role
  const getRoleSession = useCallback((role, validate = true) => {
    if (!role) return null;
    const targetRole = role.toLowerCase();
    const session = roleSessions[targetRole];
    if (!session) return null;

    if (validate) {
      const expiresAt = session.expiresAt || (session.loggedInAt ? session.loggedInAt + SEVEN_DAYS_MS : 0);
      if (Date.now() > expiresAt) {
        return null;
      }
    }
    return session;
  }, [roleSessions]);

  // Current user according to activeRole
  const currentUser = getRoleSession(activeRole);

  // Save/update session for a role
  const saveRoleSession = (userData) => {
    const role = userData.role || activeRole || 'customer';
    const now = Date.now();
    const sessionPayload = {
      ...userData,
      loggedInAt: userData.loggedInAt || now,
      expiresAt: userData.expiresAt || now + SEVEN_DAYS_MS
    };

    setRoleSessions(prev => {
      const updated = {
        ...prev,
        [role]: sessionPayload
      };
      localStorage.setItem(STORAGE_KEY_ROLE_SESSIONS, JSON.stringify(updated));
      return updated;
    });

    setActiveRole(role);
  };

  // Clear session for a specific role or all roles
  const clearRoleSession = (role) => {
    setRoleSessions(prev => {
      const updated = { ...prev };
      if (role) {
        delete updated[role.toLowerCase()];
      } else {
        return {};
      }
      localStorage.setItem(STORAGE_KEY_ROLE_SESSIONS, JSON.stringify(updated));
      return updated;
    });
  };

  // Check and purge expired sessions periodically (every 30 seconds)
  useEffect(() => {
    const checkExpirations = () => {
      const current = getStoredSessions();
      setRoleSessions(current);
    };

    const interval = setInterval(checkExpirations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Log in with phone or email + password / OTP
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const res = await authAPI.login(credentials);
      if (res.success && res.data) {
        saveRoleSession(res.data);
        return { success: true, user: res.data };
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Invalid credentials';
      if (msg === 'Network Error' || err.code === 'ERR_NETWORK') {
        msg = 'Cannot connect to the server. Please check your connection and try again.';
      }
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
        saveRoleSession(res.data);
        return { success: true, user: res.data };
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Registration failed';
      if (msg === 'Network Error' || err.code === 'ERR_NETWORK') {
        msg = 'Cannot connect to the server. Please check your connection and try again.';
      }
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
        saveRoleSession(res.data);
        return { success: true, user: res.data };
      } else {
        throw new Error(res.message || 'OTP verification failed');
      }
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Invalid OTP';
      if (msg === 'Network Error' || err.code === 'ERR_NETWORK') {
        msg = 'Cannot connect to the server. Please check your connection and try again.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out (role specific or full logout)
  const logout = (targetRole) => {
    if (targetRole) {
      clearRoleSession(targetRole);
    } else {
      clearRoleSession(activeRole);
    }
  };

  // Switch active role
  const switchRole = (role) => {
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        roleSessions,
        isAuthenticated: isSessionValid(activeRole),
        isSessionValid,
        getRoleSession,
        isLoading,
        authError,
        login,
        register,
        verifyOtp,
        logout,
        switchRole,
        saveRoleSession,
        clearRoleSession,
        SEVEN_DAYS_MS
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
