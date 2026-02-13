import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const SignIn = ({ navigation }) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const {
    login,
    verifyPassword,
    getUserByEmail,
    isLocked,
    getLockRemaining,
    recordFailedAttempt,
    resetAttempts,
    biometricEnabled,
    biometricLogin,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [enterAnim]);

  useEffect(() => {
    if (biometricEnabled) {
      biometricLogin();
    }
  }, [biometricEnabled, biometricLogin]);

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Enter email and password.');
      return;
    }

    const user = getUserByEmail(email);

    if (!user) {
      Alert.alert('Invalid email', 'Account not found.');
      return;
    }

    if (isLocked(email)) {
      const seconds = Math.ceil(getLockRemaining(email) / 1000);
      Alert.alert('Account Locked', `Try again in ${seconds}s`);
      return;
    }

    const ok = verifyPassword(email, password);

    if (!ok) {
      const result = await recordFailedAttempt(email);

      if (result === 'locked') {
        Alert.alert(
          'Account Locked',
          'Too many wrong attempts. Locked for 2 minutes.'
        );
        return;
      }

      Alert.alert('Wrong password', `Attempt ${result}/5`);
      return;
    }

    await resetAttempts(email);
    await login(user);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: enterAnim,
          transform: [
            {
              translateY: enterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.card}>
      <Text style={styles.heading}>Sign In</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotLink}>
          Forgot Password?
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      {biometricEnabled && (
        <Pressable
          style={styles.bioBtn}
          onPress={biometricLogin}
        >
          <Text style={styles.bioText}>Login with Fingerprint</Text>
        </Pressable>
      )}

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Don't have an account? Create one</Text>
      </Pressable>
      </View>
    </Animated.View>
  );
};

export default SignIn;

const getStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    heading: {
      ...typography.heading,
      fontSize: 30,
      textAlign: 'center',
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSecondary,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.lg,
      backgroundColor: colors.card,
      color: colors.textPrimary,
    },
    forgotLink: {
      color: colors.primary,
      marginBottom: spacing.md,
      fontWeight: '600',
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
    bioBtn: {
      backgroundColor: '#111',
      paddingVertical: spacing.md,
      borderRadius: 14,
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    bioText: {
      color: '#fff',
      fontWeight: '700',
    },
    link: {
      textAlign: 'center',
      color: colors.primary,
      marginTop: spacing.sm,
      fontWeight: '700',
    },
  });
