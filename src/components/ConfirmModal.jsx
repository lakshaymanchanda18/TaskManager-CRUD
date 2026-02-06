import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const ConfirmModal = ({
  visible,
  task,
  onCancel,
  onConfirm,
}) => {
  if (!task) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {task.title.toUpperCase()}
          </Text>

          {task.description ? (
            <Text style={styles.desc}>{task.description}</Text>
          ) : null}

          <Text style={styles.meta}>
            📅 {task.date}
          </Text>
          <Text style={styles.meta}>
            ⏰ {task.fromTime} – {task.toTime}
          </Text>

          <Text style={styles.warning}>
            {task.completed
              ? 'If changed, you will need to mark this task as completed again manually.'
              : 'Are you sure you want to mark this task as completed?'}
          </Text>

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.cancel]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.confirm]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ConfirmModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.lg,
  },
  title: {
    ...typography.subheading,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  desc: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  warning: {
    marginTop: spacing.md,
    fontSize: 13,
    color: '#b45309',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  btn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  cancel: {
    backgroundColor: '#e5e7eb',
  },
  confirm: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    fontWeight: '600',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});
