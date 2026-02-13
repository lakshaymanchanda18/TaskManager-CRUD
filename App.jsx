import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { TasksProvider } from './src/context/TasksContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import { useThemeColors, setGlobalColors } from './src/theme/colors';

const AppContent = () => {
  const { user } = useAuth();
  const themeColors = useThemeColors();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: themeColors.background,
      card: themeColors.card,
      text: themeColors.textPrimary,
      border: themeColors.border,
      primary: themeColors.primary,
    },
  };

  useEffect(() => {
    setGlobalColors(themeColors);
  }, [themeColors]);

  return (
    <TasksProvider user={user}>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </TasksProvider>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
