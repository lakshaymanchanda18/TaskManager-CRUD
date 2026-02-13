import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

const light = {
  primary: '#2563EB',
  background: '#F4F7FB',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
};

const dark = {
  primary: '#60A5FA',
  background: '#0B1220',
  card: '#162033',
  textPrimary: '#E2E8F0',
  textSecondary: '#94A3B8',
  border: '#2A3A52',
};

/* USED ONLY IN APP.JSX */
export const useThemeColors = () => {
  const { darkMode } = useAuth();
  return useMemo(() => (darkMode ? dark : light), [darkMode]);
};

/* GLOBAL COLORS OBJECT */
export let colors = light;

export const setGlobalColors = c => {
  colors = c;
};
