import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { AuthState } from '../types';

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    });

    useEffect(() => {
        // Initialen Authentifizierungsstatus abrufen
        const getInitialSession = async () => {
            try {
                const { data } = await supabase.auth.getSession();

                setState({
                    user: data.session?.user ?? null,
                    session: data.session,
                    loading: false,
                });
            } catch (error) {
                console.error('Fehler beim Abrufen der Sitzung:', error);
                setState(prev => ({ ...prev, loading: false }));
            }
        };

        getInitialSession();

        // Auf Authentifizierungsänderungen hören
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                });
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Fehler beim Anmelden:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({ email, password });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Fehler beim Registrieren:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Fehler beim Abmelden:', error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Fehler beim Zurücksetzen des Passworts:', error);
            throw error;
        }
    };

    const value = {
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
    }

    return context;
}; 