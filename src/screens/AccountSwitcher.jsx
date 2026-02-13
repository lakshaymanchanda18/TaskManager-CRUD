import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const AccountSwitcher = ({ navigation }) => {
  const { users, login, deleteAccount } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Switch Account</Text>

      {users.map(u => (
        <View key={u.email} style={styles.card}>
          <Text style={styles.name}>{u.name}</Text>
          <Text style={styles.email}>{u.email}</Text>

          <View style={styles.row}>
            <Pressable
              style={styles.loginBtn}
              onPress={() => login(u)}
            >
              <Text style={styles.btnText}>Login</Text>
            </Pressable>

            <Pressable
              style={styles.deleteBtn}
              onPress={() => deleteAccount(u.email)}
            >
              <Text style={styles.btnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default AccountSwitcher;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  heading: {
    ...typography.heading,
    fontSize: 26,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
  },
  email: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginBtn: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: spacing.sm,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
