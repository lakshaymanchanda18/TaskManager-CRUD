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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const USERS_KEY = '@USERS_LIST';

const hash = str =>
  str
    .split('')
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString();

const ForgotPassword = ({ navigation }) => {
  const { users, getUserByEmail, generateOTP, verifyOTP, setUsers } = useAuth();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState('');

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

  const sendOTP = () => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = getUserByEmail(normalizedEmail);

    if (!user) {
      Alert.alert('Not found', 'No account with this email.');
      return;
    }

    generateOTP(normalizedEmail);
    setEmail(normalizedEmail);
    Alert.alert(
      'OTP Sent',
      'OTP generated successfully. For now, check Metro/console logs (simulation mode).'
    );

    setStep(2);
  };

  const verifyCode = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid', 'Enter 6-digit OTP');
      return;
    }

    const result = await verifyOTP(email, otp);

    if (!result.ok) {
      if (result.reason === 'expired') {
        Alert.alert('Expired', 'OTP expired. Request new one.');
      } else if (result.reason === 'locked') {
        Alert.alert('Locked', 'Too many wrong attempts.');
      } else {
        Alert.alert('Wrong OTP', `Attempts left: ${result.triesLeft}`);
      }
      return;
    }

    setStep(3);
  };

  const resetPassword = async () => {
    if (!passwordsMatch) {
      Alert.alert('Invalid', 'Password weak or not matching.');
      return;
    }

    const updatedUsers = users.map(u =>
      u.email === email
        ? { ...u, password: hash(newPass) }
        : u
    );

    setUsers(updatedUsers);

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    Alert.alert('Success', 'Password reset successful.');
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>

      {step === 1 && (
        <>
          <Text style={styles.label}>Registered Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Pressable style={styles.button} onPress={sendOTP}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </Pressable>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder="6-digit code"
          />

          <Pressable style={styles.button} onPress={verifyCode}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              generateOTP(email.trim().toLowerCase());
              Alert.alert(
                'OTP Resent',
                'A new OTP was generated. Check Metro/console logs.'
              );
            }}
          >
            <Text style={{ color: colors.primary, marginTop: 12 }}>
              Resend OTP
            </Text>
          </Pressable>
        </>
      )}

      {step === 3 && (
        <>
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

          <Text style={styles.label}>Confirm Password</Text>
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
              !passwordsMatch && { opacity: 0.5 },
            ]}
            onPress={resetPassword}
            disabled={!passwordsMatch}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
};

const Rule = ({ ok, text }) => (
  <Text style={{ color: ok ? 'green' : 'red', fontSize: 12 }}>
    {ok ? '✓ ' : '• '}
    {text}
  </Text>
);

export default ForgotPassword;

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
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
