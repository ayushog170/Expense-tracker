import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    try {
      setError("");
      const { data } = await authService.me();
      setUser(data.user);
      return data.user;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginWithGoogle = () => {
    setError("");
    window.location.assign(authService.googleUrl());
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      window.location.assign("/auth");
    }
  };

  const updatePreferences = async (payload) => {
    const { data } = await authService.updatePreferences(payload);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      setError,
      refreshUser,
      loginWithGoogle,
      logout,
      updatePreferences,
      isAuthenticated: Boolean(user),
    }),
    [error, loading, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
