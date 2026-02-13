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

import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const EditProfile = ({ navigation }) => {
  const { user, updateProfile, emailExists } = useAuth();

  const [firstName, setFirstName] = useState(
    user?.name?.split(' ')[0] || ''
  );
  const [lastName, setLastName] = useState(
    user?.name?.split(' ')[1] || ''
  );

  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [imageUri, setImageUri] = useState(user?.avatarImage || null);

  // 🔥 DOB STATE
  const [dob, setDob] = useState(
    user?.dob ? new Date(user.dob) : new Date(2000, 0, 1)
  );
  const [showDob, setShowDob] = useState(false);

  const [emailValid, setEmailValid] = useState(true);
  const [checking, setChecking] = useState(false);

  const capitalize = t =>
    t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : '';

  // 🔥 AGE CALCULATOR
  const calculateAge = date => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }

    return age;
  };

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

      if (
        value.toLowerCase() !== user.email.toLowerCase() &&
        emailExists(value)
      ) {
        setEmailValid('exists');
        setChecking(false);
        return;
      }

      setEmailValid(true);
      setChecking(false);
    }, 400);
  };

  const canSave =
    firstName &&
    lastName &&
    phone &&
    emailValid === true;

  const save = async () => {
    if (!canSave) return;

    const fullName =
      capitalize(firstName) + ' ' + capitalize(lastName);

    const updated = {
      ...user,
      name: fullName,
      phone,
      email,
      avatarImage: imageUri,
      avatarLetter: fullName.charAt(0),

      // 🔥 SAVE DOB
      dob: dob.toISOString(),
    };

    await updateProfile(updated);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <Pressable
        style={[
          styles.avatar,
          { backgroundColor: user.color || colors.primary },
        ]}
        onPress={pickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.avatarText}>
            {user.avatarLetter}
          </Text>
        )}
      </Pressable>

      <Text style={styles.tapHint}>Tap to change photo</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Email</Text>
      <View style={styles.emailRow}>
        <TextInput
          style={styles.emailInput}
          keyboardType="email-address"
          value={email}
          onChangeText={validateEmail}
        />

        {checking && <ActivityIndicator size="small" />}

        {emailValid === true && (
          <Text style={styles.valid}>✓</Text>
        )}

        {emailValid === 'exists' && (
          <Text style={styles.invalid}>✗</Text>
        )}
      </View>

      {emailValid === 'exists' && (
        <Text style={styles.error}>
          Email already used by another account
        </Text>
      )}

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* 🔥 DOB SECTION */}
      <Text style={styles.label}>Date of Birth</Text>
      <Pressable
        style={styles.input}
        onPress={() => setShowDob(true)}
      >
        <Text>
          {dob.toDateString()} • Age: {calculateAge(dob)}
        </Text>
      </Pressable>

      {showDob && (
        <DateTimePicker
          value={dob}
          mode="date"
          maximumDate={new Date()}
          onChange={(_, selected) => {
            setShowDob(false);
            if (selected) setDob(selected);
          }}
        />
      )}

      <Pressable
        style={[styles.button, !canSave && { opacity: 0.5 }]}
        onPress={save}
        disabled={!canSave}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
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
    fontSize: 18,
  },

  invalid: {
    color: 'red',
    fontSize: 18,
  },

  error: {
    color: 'red',
    marginBottom: spacing.md,
    fontSize: 12,
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
});
