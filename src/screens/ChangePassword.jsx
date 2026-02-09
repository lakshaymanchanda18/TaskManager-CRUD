import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const hash = str =>
  str
    .split('')
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString();

const ChangePassword = ({ navigation }) => {
  const { user, verifyPassword, updateProfile } = useAuth();

  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const passwordRules = {
    length: newPass.length >= 8,
    upper: /[A-Z]/.test(newPass),
    lower: /[a-z]/.test(newPass),
    number: /[0-9]/.test(newPass),
    special: /[^A-Za-z0-9]/.test(newPass),
  };

  const strongPassword =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.lower &&
    passwordRules.number &&
    passwordRules.special;

  const passwordsMatch = strongPassword && newPass === confirm;

  const submit = () => {
    if (!verifyPassword(current)) {
      Alert.alert('Wrong password', 'Current password is incorrect.');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Invalid', 'New passwords do not match or are weak.');
      return;
    }

    const updatedUser = {
      ...user,
      password: hash(newPass),
    };

    updateProfile(updatedUser);

    Alert.alert('Success', 'Password updated successfully.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Change Password</Text>

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={current}
        onChangeText={setCurrent}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPass}
        onChangeText={setNewPass}
      />

      {newPass.length > 0 && (
        <View style={{ marginBottom: spacing.md }}>
          <Rule ok={passwordRules.length} text="8+ characters" />
          <Rule ok={passwordRules.upper} text="1 uppercase letter" />
          <Rule ok={passwordRules.lower} text="1 lowercase letter" />
          <Rule ok={passwordRules.number} text="1 number" />
          <Rule ok={passwordRules.special} text="1 special character" />
        </View>
      )}

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      {confirm.length > 0 && (
        <Text style={{ color: passwordsMatch ? 'green' : 'red' }}>
          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
        </Text>
      )}

      <Pressable
        style={[
          styles.button,
          !(passwordsMatch && current) && { opacity: 0.5 },
        ]}
        onPress={submit}
        disabled={!(passwordsMatch && current)}
      >
        <Text style={styles.buttonText}>Update Password</Text>
      </Pressable>
    </ScrollView>
  );
};

const Rule = ({ ok, text }) => (
  <Text style={{ color: ok ? 'green' : 'red', fontSize: 12 }}>
    {ok ? '✓ ' : '• '}
    {text}
  </Text>
);

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
  },

  heading: {
    ...typography.heading,
    fontSize: 26,
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
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },

  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
