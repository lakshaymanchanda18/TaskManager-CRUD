import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker from 'react-native-country-picker-modal';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const COLOR_OPTIONS = [
  '#2563EB',
  '#9333EA',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#EC4899',
  '#14B8A6',
  '#3B82F6',
];

const Login = ({ navigation }) => {
  const { register, emailExists } = useAuth();

  const [imageUri, setImageUri] = useState(null);
  const [showDate, setShowDate] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(null);
  const [color, setColor] = useState('#2563EB');

  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailValid, setEmailValid] = useState(null);
  const [checking, setChecking] = useState(false);

  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (res.assets && res.assets.length > 0) {
      setImageUri(res.assets[0].uri);
    }
  };

  const validateEmail = value => {
    setEmail(value);
    setChecking(true);

    setTimeout(() => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(value)) {
        setEmailValid(false);
        setChecking(false);
        return;
      }

      if (emailExists(value)) {
        setEmailValid('exists');
        setChecking(false);
        return;
      }

      setEmailValid(true);
      setChecking(false);
    }, 400);
  };

  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strongPassword =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.lower &&
    passwordRules.number &&
    passwordRules.special;

  const passwordsMatch = strongPassword && password === confirmPassword;

  const capitalize = t =>
    t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : '';

  const isValidPhone = () => {
    if (!phone) return false;

    const rules = {
      91: 10,
      1: 10,
      44: [10, 11],
      971: 9,
    };

    const rule = rules[callingCode];

    if (typeof rule === 'number') return phone.length === rule;
    if (Array.isArray(rule)) return rule.includes(phone.length);

    return phone.length >= 6 && phone.length <= 12;
  };

  const canSubmit =
    firstName &&
    lastName &&
    emailValid === true &&
    isValidPhone() &&
    dob &&
    passwordsMatch;

  const submit = () => {
    if (!canSubmit) return;

    const fullName = capitalize(firstName) + ' ' + capitalize(lastName);

    register({
      name: fullName,
      email,
      phone: '+' + callingCode + phone,
      dob,
      password,
      color,
      avatarImage: imageUri || null,
      avatarLetter: fullName.charAt(0),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subHeading}>Personalize your profile</Text>

        <Pressable
          style={[styles.avatar, { backgroundColor: color }]}
          onPress={pickImage}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.avatarText}>
              {firstName ? firstName.charAt(0).toUpperCase() : '?'}
            </Text>
          )}
        </Pressable>

        <Text style={styles.tapHint}>Tap to add photo</Text>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

          <Text style={styles.label}>Email</Text>
          <View style={styles.emailRow}>
            <TextInput
              style={styles.emailInput}
              keyboardType="email-address"
              value={email}
              onChangeText={validateEmail}
            />
            {checking && <ActivityIndicator size="small" />}
            {emailValid === true && <Text style={styles.valid}>✓</Text>}
            {emailValid === 'exists' && <Text style={styles.invalid}>✗</Text>}
          </View>

          <Text style={styles.label}>Phone</Text>
          <View style={styles.phoneRow}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withCallingCodeButton
              onSelect={c => {
                setCountryCode(c.cca2);
                setCallingCode(c.callingCode[0]);
              }}
            />

            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={callingCode === '91' ? 10 : 12}
            />
          </View>

          {phone.length > 0 && !isValidPhone() && (
            <Text style={{ color: 'red', marginBottom: spacing.md }}>
              Invalid phone number for selected country
            </Text>
          )}

          <Text style={styles.label}>Date of Birth</Text>
          <Pressable style={styles.input} onPress={() => setShowDate(true)}>
            <Text>{dob ? dob.toDateString() : 'Select date'}</Text>
          </Pressable>

          {showDate && (
            <DateTimePicker
              value={dob || new Date(2000, 0, 1)}
              mode="date"
              maximumDate={new Date()}
              onChange={(e, date) => {
                setShowDate(false);
                if (date) setDob(date);
              }}
            />
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {password.length > 0 && (
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {confirmPassword.length > 0 && (
            <Text style={{ color: passwordsMatch ? 'green' : 'red' }}>
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </Text>
          )}

          <Text style={styles.label}>Profile Color</Text>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map(c => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  color === c && styles.selected,
                ]}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.button, !canSubmit && { opacity: 0.5 }]}
          onPress={submit}
          disabled={!canSubmit}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInText}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const Rule = ({ ok, text }) => (
  <Text style={{ color: ok ? 'green' : 'red', fontSize: 12 }}>
    {ok ? '✓ ' : '• '}
    {text}
  </Text>
);

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  heading: {
    ...typography.heading,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subHeading: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  avatar: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  avatarText: { fontSize: 40, fontWeight: '700', color: '#fff' },
  tapHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  form: { marginBottom: spacing.lg },
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
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },
  emailInput: { flex: 1, paddingVertical: spacing.md },
  valid: { color: 'green', fontSize: 18 },
  invalid: { color: 'red', fontSize: 18 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },
  phoneInput: { flex: 1, paddingVertical: spacing.md, marginLeft: 8 },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selected: { borderWidth: 3, borderColor: '#000' },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  signInText: {
    textAlign: 'center',
    marginTop: 12,
    color: colors.primary,
  },
});
