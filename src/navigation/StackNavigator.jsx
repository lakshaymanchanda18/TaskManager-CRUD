import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import TaskDetails from '../screens/TaskDetails';
import AddTask from '../screens/AddTask';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* MAIN APP — NO HEADER */}
          <Stack.Screen
            name="AppDrawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />

          {/* THESE SHOULD HAVE BACK BUTTON */}
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ title: 'Profile' }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ title: 'Edit Profile' }}
          />

          <Stack.Screen
            name="TaskDetails"
            component={TaskDetails}
            options={{ title: 'Task Details' }}
          />

          <Stack.Screen
            name="AddTask"
            component={AddTask}
            options={{ title: 'Add Task' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
