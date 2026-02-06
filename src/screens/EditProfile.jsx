import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

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

const EditProfile = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    age: user.age || '',
    color: user.color || colors.primary,
  });

  const avatarLetter =
    form.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const updated = {
      ...user,
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: form.age.trim(),
      avatarLetter,
    };

    updateProfile(updated);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      {/* AVATAR PREVIEW */}
      <View
        style={[
          styles.avatar,
          { backgroundColor: form.color },
        ]}
      >
        <Text style={styles.avatarText}>
          {avatarLetter}
        </Text>
      </View>

      {/* NAME */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={v => setForm({ ...form, name: v })}
      />

      {/* EMAIL */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        value={form.email}
        onChangeText={v => setForm({ ...form, email: v })}
      />

      {/* PHONE */}
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={v => setForm({ ...form, phone: v })}
      />

      {/* AGE */}
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.age}
        onChangeText={v => setForm({ ...form, age: v })}
      />

      {/* COLOR PICKER */}
      <Text style={styles.label}>Avatar Color</Text>

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

      {/* SAVE */}
      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>SAVE CHANGES</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },

  heading: {
    ...typography.heading,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  avatarText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: spacing.md,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
  },

  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },

  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },

  selected: {
    borderWidth: 3,
    borderColor: '#000',
  },

  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
