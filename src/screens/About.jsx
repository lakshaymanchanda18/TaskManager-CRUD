import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import TaskManagerLogo from '../components/icons/TaskManagerLogo';

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TaskManagerLogo size={40} color={colors.primary} />
        <Text style={styles.title}>Task Manager</Text>
      </View>

      <Text style={styles.version}>Version 1.0</Text>

      <Text style={styles.text}>
        This is a simple productivity app built to help you manage your daily
        tasks, track progress, and stay organized.
      </Text>

      <Text style={styles.section}>Features</Text>

      <Text style={styles.bullet}>• Task scheduling</Text>
      <Text style={styles.bullet}>• Priority management</Text>
      <Text style={styles.bullet}>• Progress tracking</Text>
      <Text style={styles.bullet}>• Account system</Text>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  title: {
    ...typography.heading,
    marginLeft: spacing.md,
  },

  version: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  text: {
    fontSize: 14,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },

  section: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },

  bullet: {
    marginBottom: 6,
  },
});
