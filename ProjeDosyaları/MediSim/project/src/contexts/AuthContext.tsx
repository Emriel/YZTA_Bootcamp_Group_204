import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => Promise<void>;
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

  useEffect(() => {
    const storedUser = localStorage.getItem('medisim_user');
    if (storedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(storedUser) });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      name: email.includes('instructor') ? 'Dr. Sarah Johnson' : 'Alex Chen',
      email,
      role: email.includes('instructor') ? 'instructor' : 'student',
      avatar: `https://images.pexels.com/photos/${email.includes('instructor') ? '5452268' : '8947825'}/pexels-photo-${email.includes('instructor') ? '5452268' : '8947825'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('medisim_user', JSON.stringify(mockUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'instructor') => {
    dispatch({ type: 'REGISTER_START' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: `https://images.pexels.com/photos/${role === 'instructor' ? '5452268' : '8947825'}/pexels-photo-${role === 'instructor' ? '5452268' : '8947825'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('medisim_user', JSON.stringify(mockUser));
    dispatch({ type: 'REGISTER_SUCCESS', payload: mockUser });
  };

  const logout = () => {
    localStorage.removeItem('medisim_user');
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