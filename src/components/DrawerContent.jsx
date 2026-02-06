import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const DrawerContent = props => {
  const { user, logout } = useAuth();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* PROFILE HEADER */}
      <View style={styles.profile}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: user?.color || colors.primary },
          ]}
        >
          <Text style={styles.avatarText}>
            {user?.avatarLetter || '?'}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* NAVIGATION */}
      <Pressable
        style={styles.item}
        onPress={() => props.navigation.navigate('Profile')}
      >
        <Text style={styles.itemText}>Profile</Text>
      </Pressable>

      <Pressable
        style={styles.item}
        onPress={() => props.navigation.navigate('Profile')}
      >
        <Text style={styles.itemText}>Account Settings</Text>
      </Pressable>

      {/* LOGOUT */}
      <Pressable style={[styles.item, styles.logout]} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  profile: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    ...typography.subheading,
    marginTop: 4,
  },
  email: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logout: {
    marginTop: spacing.lg,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
  },
});
