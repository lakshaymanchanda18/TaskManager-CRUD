import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const Settings = ({ navigation }) => {
  const { logout, darkMode, toggleTheme } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {/* ACCOUNT */}
      <Section title="Account">
        <Item
          title="View Profile"
          onPress={() => navigation.navigate('Profile')}
        />

        <Item
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />

        <Item title="Switch Account" onPress={logout} />
      </Section>

      {/* APPEARANCE */}
      <Section title="Appearance">
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleTheme} />
        </View>
      </Section>

      {/* APP */}
      <Section title="App">
        <Item title="About" onPress={() => {}} />
        <Item title="Help & Support" onPress={() => {}} />
      </Section>

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const Item = ({ title, onPress }) => (
  <Pressable style={styles.item} onPress={onPress}>
    <Text style={styles.itemText}>{title}</Text>
  </Pressable>
);

export default Settings;

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

  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  item: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  itemRow: {
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },

  logoutBtn: {
    marginTop: spacing.lg,
    backgroundColor: '#d11a2a',
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});
