import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        try {
          const response = await api.get('/auth/me');
          set({
            user: response.data.data,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
