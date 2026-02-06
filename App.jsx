import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import StackNavigator from './src/navigation/StackNavigator';
import { TasksProvider } from './src/context/TasksContext';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TasksProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </TasksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
