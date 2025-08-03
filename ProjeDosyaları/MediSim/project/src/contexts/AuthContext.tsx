import React, { createContext, useContext, useReducer } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, surname: string, email: string, password: string, role: 'student' | 'instructor') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        user: null,
        isAuthenticated: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    isAuthenticated: false
  });

  // localStorage'dan otomatik login kaldırıldı - her seferinde manuel giriş gerekli

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
     try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.user) throw new Error(data.message || "Giriş başarısız");

    const userFromBackend = data.user;

    const fullUser: User = {
      id: userFromBackend.id.toString(),
      name: userFromBackend.username,
      surname: '',
      birthdate: '',
      gender: userFromBackend.role === 'instructor' ? 'female' : 'male',
      email: userFromBackend.username,
      role: userFromBackend.role,
      avatar: '',
      createdAt: new Date().toISOString(),
    };

    // localStorage kalıcı oturum kaldırıldı - her seferinde manuel giriş gerekli
    dispatch({ type: 'LOGIN_SUCCESS', payload: fullUser });
  } catch (error) {
    console.error("Login error:", error);
    dispatch({ type: 'LOGIN_FAILURE' });
    throw error;
  }
  };

  const register = async (name: string, surname: string, email: string, password: string, role: 'student' | 'instructor') => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password, role }),
    });

    const data = await response.json();

    if (!response.ok || !data.id) throw new Error(data.message || "Kayıt başarısız");

    const newUser: User = {
      id: data.id.toString(),
      name,
      surname,
      birthdate: '',
      gender: role === 'instructor' ? 'female' : 'male',
      email,
      role,
      avatar: '',
      createdAt: new Date().toISOString(),
    };

    // localStorage kalıcı oturum kaldırıldı - her seferinde manuel giriş gerekli
    dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
  } catch (error) {
    console.error("Register error:", error);
    dispatch({ type: 'REGISTER_FAILURE' });
    throw error;
  }
  };

  const logout = () => {
    // localStorage temizleme kaldırıldı - oturum zaten kalıcı değil
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};