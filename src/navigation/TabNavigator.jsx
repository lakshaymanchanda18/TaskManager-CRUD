import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, View, Text } from 'react-native';

import Home from '../screens/Home';
import Tasks from '../screens/Tasks';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

import HomeIcon from '../components/icons/HomeIcon';
import TasksIcon from '../components/icons/TasksIcon';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerTitleAlign: 'center',

        /* PROFILE AVATAR ON LEFT */
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 14 }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: user?.color || colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: 14,
                }}
              >
                {user?.avatarLetter || 'U'}
              </Text>
            </View>
          </Pressable>
        ),

        /* REMOVE RIGHT SIDE ICON */
        headerRight: () => null,

        tabBarIcon: ({ focused }) => {
          const color = focused ? colors.primary : '#999';

          if (route.name === 'Home')
            return <HomeIcon color={color} />;

          if (route.name === 'Tasks')
            return <TasksIcon color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tasks" component={Tasks} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
