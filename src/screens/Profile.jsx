import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const Profile = ({ navigation }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* AVATAR */}
      <View
        style={[
          styles.avatar,
          { backgroundColor: user.color || colors.primary },
        ]}
      >
        {user.avatarImage ? (
          <Image source={{ uri: user.avatarImage }} style={styles.image} />
        ) : (
          <Text style={styles.avatarText}>
            {user.avatarLetter}
          </Text>
        )}
      </View>

      {/* BASIC INFO */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.infoCard}>
        <Row label="Phone" value={user.phone} />
        <Row label="Age" value={user.age} />
        <Row label="Account Created" value={formatDate(user.createdAt)} />
      </View>

      {/* ACTIONS */}
      <Pressable
        style={styles.editBtn}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.btnText}>Edit Profile</Text>
      </Pressable>

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.btnText}>Logout / Switch Account</Text>
      </Pressable>
    </ScrollView>
  );
};

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const formatDate = date => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toDateString();
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  avatarText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },

  name: {
    ...typography.heading,
    marginBottom: 4,
  },

  email: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  infoCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  label: {
    fontWeight: '600',
  },

  value: {
    color: colors.textSecondary,
  },

  editBtn: {
    width: '100%',
    backgroundColor: '#555',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  logoutBtn: {
    width: '100%',
    backgroundColor: '#d11a2a',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
