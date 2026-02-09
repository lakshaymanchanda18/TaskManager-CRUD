import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const SignIn = ({ navigation }) => {
  const { login, verifyPassword, getUserByEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Enter email and password.');
      return;
    }

    const user = getUserByEmail(email);

    if (!user) {
      Alert.alert('Invalid email', 'Account not found.');
      return;
    }

    const ok = verifyPassword(email, password);

    if (!ok) {
      Alert.alert('Wrong password', 'Please try again.');
      return;
    }

    login(user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          Don't have an account? Create one
        </Text>
      </Pressable>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  heading: {
    ...typography.heading,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  link: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
});
