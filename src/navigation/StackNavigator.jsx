import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import TaskDetails from '../screens/TaskDetails';
import AddTask from '../screens/AddTask';
import Login from '../screens/Login';
import SignIn from '../screens/SignIn';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import AccountSwitcher from '../screens/AccountSwitcher';
import Settings from '../screens/Settings';
import ForgotPassword from '../screens/ForgotPassword';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: 'Sign In' }}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ title: 'Forgot Password' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="AppDrawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />

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
            name="ChangePassword"
            component={ChangePassword}
            options={{ title: 'Change Password' }}
          />

          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ title: 'Settings' }}
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

          <Stack.Screen
            name="AccountSwitcher"
            component={AccountSwitcher}
            options={{ title: 'Switch Account' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
