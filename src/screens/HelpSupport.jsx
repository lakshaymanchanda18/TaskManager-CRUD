import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const HelpSupport = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <Text style={styles.section}>Common Questions</Text>

      <Text style={styles.q}>How do I add a task?</Text>
      <Text style={styles.a}>
        Tap the + button and fill the task details.
      </Text>

      <Text style={styles.q}>How do I edit a task?</Text>
      <Text style={styles.a}>
        Open a task and tap "Edit Task".
      </Text>

      <Text style={styles.q}>How do I delete a task?</Text>
      <Text style={styles.a}>
        Open task details and press Delete.
      </Text>

      <Text style={styles.section}>Contact</Text>
      <Text style={styles.a}>
        For support, contact: support@taskmanager.app
      </Text>
    </ScrollView>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    flexGrow: 1,
  },

  title: {
    ...typography.heading,
    marginBottom: spacing.lg,
  },

  section: {
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  q: {
    fontWeight: '600',
    marginTop: spacing.sm,
  },

  a: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
