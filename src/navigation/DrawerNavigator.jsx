import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const Drawer = createDrawerNavigator();

/* ---------------- CUSTOM DRAWER CONTENT ---------------- */

const CustomDrawerContent = props => {
  const { user, logout } = useAuth();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <DrawerContentScrollView {...props}>
      {/* PROFILE HEADER */}
      {user && (
        <Pressable
          style={styles.header}
          onPress={() =>
            props.navigation.getParent().navigate('Profile')
          }
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: user.color || colors.primary },
            ]}
          >
            {user.avatarImage ? (
              <Image
                source={{ uri: user.avatarImage }}
                style={styles.image}
              />
            ) : (
              <Text style={styles.avatarText}>
                {user.avatarLetter}
              </Text>
            )}
          </View>

          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </Pressable>
      )}

      {/* NAV ITEMS */}
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Dashboard')}
        labelStyle={styles.itemLabel}
      />

      <DrawerItem
        label="Profile"
        onPress={() =>
          props.navigation.getParent().navigate('Profile')
        }
        labelStyle={styles.itemLabel}
      />

      {/* ✅ FIXED: Settings navigation */}
      <DrawerItem
        label="Settings"
        onPress={() =>
          props.navigation.getParent().navigate('Settings')
        }
        labelStyle={styles.itemLabel}
      />

      <DrawerItem
        label="Logout"
        onPress={logout}
        labelStyle={styles.logout}
      />
    </DrawerContentScrollView>
  );
};

/* ---------------- DRAWER NAVIGATOR ---------------- */

const DrawerNavigator = () => {
  const colors = useThemeColors();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabNavigator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

/* ---------------- STYLES ---------------- */

const getStyles = colors =>
  StyleSheet.create({
    header: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },

    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    avatarText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 18,
    },

    name: {
      fontWeight: '700',
      fontSize: 14,
      color: colors.textPrimary,
    },

    email: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    itemLabel: {
      color: colors.textPrimary,
    },

    logout: {
      color: 'red',
      fontWeight: '700',
    },
  });
