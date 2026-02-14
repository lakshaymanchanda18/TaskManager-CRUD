import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';

import AppIcon from './icons/AppIcon';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const getPriorityStyle = priority => {
  switch (priority) {
    case 'HIGH':
      return { backgroundColor: '#d11a2a' };
    case 'MEDIUM':
      return { backgroundColor: '#f5a623' };
    case 'LOW':
      return { backgroundColor: '#2ecc71' };
    default:
      return { backgroundColor: '#999' };
  }
};

const TaskCard = ({ task, onComplete, onPress }) => {
  const isDone = task.completed;
  const isOverdue = task.overdue;
  const taskTime = task.allDay ? 'All day' : `${task.fromTime} - ${task.toTime}`;

  return (
    <Pressable
      style={[styles.card, isDone && styles.completedCard, isOverdue && styles.overdueCard]}
      onPress={() => onPress(task)}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            isDone && styles.completedTitle,
            isOverdue && styles.overdueTitle,
          ]}
        >
          {(task.title || '').toUpperCase()}
        </Text>

        <View
          style={[
            styles.priorityBadge,
            getPriorityStyle(task.priority),
            isDone && styles.dimmedBadge,
          ]}
        >
          <Text style={styles.priorityText}>{task.priority}</Text>
        </View>
      </View>

      {task.description ? (
        <Text style={[styles.desc, isDone && styles.completedText]}>{task.description}</Text>
      ) : null}

      <View style={styles.metaRow}>
        <AppIcon name="calendar" size={13} color={colors.textSecondary} style={styles.metaIcon} />
        <Text style={[styles.meta, isDone && styles.completedText]}>{task.date}</Text>
      </View>

      <View style={styles.metaRow}>
        <AppIcon name="clock" size={13} color={colors.textSecondary} style={styles.metaIcon} />
        <Text style={[styles.meta, isDone && styles.completedText]}>{taskTime}</Text>
      </View>

      <Text style={[styles.status, isDone && styles.completedText]}>
        Status: {isDone ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
      </Text>

      <Pressable
        style={[styles.completeBtn, isDone && styles.completedBtn]}
        onPress={e => {
          e?.stopPropagation?.();
          onComplete(task);
        }}
      >
        <Text style={styles.completeText}>{isDone ? 'Mark Pending' : 'Mark Complete'}</Text>
      </Pressable>
    </Pressable>
  );
};

export default React.memo(TaskCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  completedCard: {
    opacity: 0.65,
  },
  overdueCard: {
    borderColor: '#d11a2a',
    backgroundColor: '#fff5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
    flex: 1,
    marginRight: spacing.sm,
    color: colors.textPrimary,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  overdueTitle: {
    color: '#d11a2a',
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  dimmedBadge: {
    opacity: 0.6,
  },
  desc: {
    ...typography.body,
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaIcon: {
    marginRight: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  status: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
  },
  completeBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedBtn: {
    backgroundColor: '#2ecc71',
  },
  completeText: {
    color: '#fff',
    fontWeight: '700',
  },
});
