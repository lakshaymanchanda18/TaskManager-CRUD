import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

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

const Login = () => {
  const { login } = useAuth();

  const [imageUri, setImageUri] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    color: '#2563EB',
  });

  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (res.assets && res.assets.length > 0) {
      setImageUri(res.assets[0].uri);
    }
  };

  const submit = () => {
    if (!form.name || !form.email) return;

    login({
      ...form,
      avatarImage: imageUri || null,
      avatarLetter: form.name.charAt(0).toUpperCase(),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subHeading}>
        Personalize your profile
      </Text>

      {/* AVATAR */}
      <Pressable
        style={[styles.avatar, { backgroundColor: form.color }]}
        onPress={pickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.avatarText}>
            {form.name
              ? form.name.charAt(0).toUpperCase()
              : '?'}
          </Text>
        )}
      </Pressable>

      <Text style={styles.tapHint}>Tap to add photo</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={form.name}
          onChangeText={v => setForm({ ...form, name: v })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          keyboardType="email-address"
          value={form.email}
          onChangeText={v => setForm({ ...form, email: v })}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={v => setForm({ ...form, phone: v })}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={form.age}
          onChangeText={v => setForm({ ...form, age: v })}
        />

        <Text style={styles.label}>Profile Color</Text>
        <View style={styles.colorRow}>
          {COLOR_OPTIONS.map(c => (
            <Pressable
              key={c}
              onPress={() => setForm({ ...form, color: c })}
              style={[
                styles.colorCircle,
                { backgroundColor: c },
                form.color === c && styles.selected,
              ]}
            />
          ))}
        </View>
      </View>

      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </ScrollView>
  );
};

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

  form: {
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

  selected: {
    borderWidth: 3,
    borderColor: '#000',
  },

  button: {
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
