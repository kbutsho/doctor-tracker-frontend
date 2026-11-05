'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    let active = true;
    authService.me().then((u) => active && setUser(u)).catch(() => active && setUser(null)).finally(() => active && setLoading(false));
    const onLogout = () => { setUser(null); qc.clear(); };
    window.addEventListener('auth:logout', onLogout);
    return () => { active = false; window.removeEventListener('auth:logout', onLogout); };
  }, [qc]);

  const login = useCallback(async (body) => {
    const u = await authService.login(body);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {});
    setUser(null);
    qc.clear();
    router.replace('/login');
  }, [qc, router]);

  const value = useMemo(() => ({ user, loading, login, logout, updateUser: setUser }), [user, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
