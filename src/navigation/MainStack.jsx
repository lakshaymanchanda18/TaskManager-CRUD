import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import TaskDetails from '../screens/TaskDetails';
import AddTask from '../screens/AddTask';
import AccountSwitcher from '../screens/AccountSwitcher';
import Settings from '../screens/Settings';
import About from '../screens/About';
import HelpSupport from '../screens/HelpSupport';

import { useThemeColors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="AppDrawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
      <Stack.Screen name="AddTask" component={AddTask} />
      <Stack.Screen name="AccountSwitcher" component={AccountSwitcher} />

      <Stack.Screen
        name="About"
        component={About}
        options={{ title: 'About' }}
      />

      <Stack.Screen
        name="HelpSupport"
        component={HelpSupport}
        options={{ title: 'Help & Support' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
