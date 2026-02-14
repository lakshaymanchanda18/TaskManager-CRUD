import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const formatDate = value => {
  if (!value) return 'Not set';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Not set';
  return d.toDateString();
};

const getAge = value => {
  if (!value) return '-';
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return '-';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age < 0 ? '-' : String(age);
};

const EditProfile = ({ navigation }) => {
  const { user, updateProfile, emailExists } = useAuth();
  const debounceRef = useRef(null);

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [imageUri, setImageUri] = useState(user?.avatarImage || null);
  const [emailValid, setEmailValid] = useState(true);
  const [checking, setChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!user) return null;

  const capitalize = t =>
    t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : '';

  const pickImage = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (res.assets && res.assets.length > 0 && res.assets[0]?.uri) {
        setImageUri(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Image Error', 'Could not open photo library.');
    }
  };

  const removePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo? A basic avatar with your name initial will be shown instead.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setImageUri(null),
        },
      ]
    );
  };

  const handleAvatarPress = () => {
    if (imageUri) {
      Alert.alert(
        'Profile Photo',
        'Choose an option',
        [
          { text: 'Change Photo', onPress: pickImage },
          { text: 'Remove Photo', onPress: removePhoto, style: 'destructive' },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      pickImage();
    }
  };

  const validateEmail = value => {
    const normalized = value.trim().toLowerCase();
    setEmail(value);
    setChecking(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(normalized)) {
        setEmailValid(false);
        setChecking(false);
        return;
      }

      if (
        normalized !== String(user.email || '').trim().toLowerCase() &&
        emailExists(normalized)
      ) {
        setEmailValid('exists');
        setChecking(false);
        return;
      }

      setEmailValid(true);
      setChecking(false);
    }, 350);
  };

  const canSave =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    phone.trim().length > 0 &&
    emailValid === true &&
    !checking &&
    !isSaving;

  const save = async () => {
    if (!canSave) return;
    setIsSaving(true);

    try {
      const cleanFirst = capitalize(firstName.trim());
      const cleanLast = capitalize(lastName.trim());
      const cleanPhone = phone.trim();
      const cleanEmail = email.trim().toLowerCase();
      const fullName = `${cleanFirst} ${cleanLast}`.trim();

      const updated = {
        ...user,
        name: fullName,
        phone: cleanPhone,
        email: cleanEmail,
        avatarImage: imageUri,
        avatarLetter: fullName.charAt(0) || user.avatarLetter || 'U',
      };

      await updateProfile(updated);
      navigation.goBack();
    } catch {
      Alert.alert('Save Failed', 'Unable to save profile right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <Pressable
        style={[styles.avatar, { backgroundColor: user.color || colors.primary }]}
        onPress={handleAvatarPress}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.avatarText}>{user.avatarLetter}</Text>
        )}
      </Pressable>

      <Text style={styles.tapHint}>
        {imageUri ? 'Tap to change or remove photo' : 'Tap to add photo'}
      </Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Email</Text>
      <View style={styles.emailRow}>
        <TextInput
          style={styles.emailInput}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={validateEmail}
        />

        {checking && <ActivityIndicator size="small" />}
        {emailValid === true && <Text style={styles.valid}>OK</Text>}
        {emailValid === 'exists' && <Text style={styles.invalid}>X</Text>}
      </View>

      {emailValid === 'exists' && (
        <Text style={styles.error}>Email already used by another account</Text>
      )}

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.disabledField}>
        <Text style={styles.disabledText}>
          {formatDate(user.dob)} | Age: {getAge(user.dob)}
        </Text>
      </View>

      <Pressable
        style={[styles.button, !canSave && styles.buttonDisabled]}
        onPress={save}
        disabled={!canSave}
      >
        <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  heading: {
    ...typography.heading,
    fontSize: 28,
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
  image: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
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
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: '#fff',
  },
  emailInput: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  valid: {
    color: 'green',
    fontSize: 12,
    fontWeight: '700',
  },
  invalid: {
    color: 'red',
    fontSize: 12,
    fontWeight: '700',
  },
  error: {
    color: 'red',
    marginBottom: spacing.md,
    fontSize: 12,
  },
  disabledField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: '#e5e7eb',
    opacity: 0.8,
  },
  disabledText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
