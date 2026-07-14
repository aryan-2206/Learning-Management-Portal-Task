import { create } from 'zustand';

// Theme is locked to dark mode permanently
const useThemeStore = create(() => ({
  theme: 'dark',
}));

export default useThemeStore;
