import { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setSession(data.session);
      setSessionLoading(false);
      if (error) console.error('Failed to restore Supabase session', error);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user?.id) {
      setRole(null);
      setProfileLoading(false);
      return undefined;
    }

    let active = true;
    setProfileLoading(true);

    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        setRole(data?.role || null);
        setProfileLoading(false);
        if (error) console.error('Failed to load user profile', error);
      });

    return () => { active = false; };
  }, [session?.user?.id]);

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase não está configurado.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      session,
      role,
      isAdmin: role === 'admin',
      loading: sessionLoading || profileLoading,
      isSupabaseConfigured,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}