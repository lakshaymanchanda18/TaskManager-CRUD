import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import TaskManagerLogo from '../components/icons/TaskManagerLogo';

const HelpSupport = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TaskManagerLogo size={40} color={colors.primary} />
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <Text style={styles.section}>FAQs</Text>

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

      <Text style={styles.q}>How do I mark a task as completed?</Text>
      <Text style={styles.a}>
        Tap the checkbox next to the task to mark it as completed or incomplete.
      </Text>

      <Text style={styles.q}>Can I set reminders for tasks?</Text>
      <Text style={styles.a}>
        Yes, when adding or editing a task, you can set a reminder time to receive notifications.
      </Text>

      <Text style={styles.q}>How do I change task priority?</Text>
      <Text style={styles.a}>
        When creating or editing a task, select from Low, Medium, or High priority options.
      </Text>

      <Text style={styles.q}>Can I organize tasks by categories?</Text>
      <Text style={styles.a}>
        Yes, you can assign categories to tasks for better organization and filtering.
      </Text>

      <Text style={styles.q}>How do I view completed tasks?</Text>
      <Text style={styles.a}>
        Go to the Tasks screen and select the "Completed" filter to view all completed tasks.
      </Text>

      <Text style={styles.q}>What happens if I uninstall the app?</Text>
      <Text style={styles.a}>
        Your tasks are stored locally on your device. Uninstalling will remove all data unless you have exported it.
      </Text>

      <Text style={styles.q}>How do I export my tasks?</Text>
      <Text style={styles.a}>
        Go to Settings and select "Export Data" to save your tasks as a file.
      </Text>

      <Text style={styles.q}>Can I sync tasks across devices?</Text>
      <Text style={styles.a}>
        Currently, tasks are stored locally. Cloud sync is planned for future updates.
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  title: {
    ...typography.heading,
    marginLeft: spacing.md,
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
