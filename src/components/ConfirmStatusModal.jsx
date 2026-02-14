import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

import AppIcon from './icons/AppIcon';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const ConfirmStatusModal = ({ visible, task, onConfirm, onCancel }) => {
  if (!task) return null;
  const taskTime = task.allDay ? 'All day' : `${task.fromTime} - ${task.toTime}`;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Task Status?</Text>

          <Text style={styles.name}>{task.title}</Text>

          {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}

          <View style={styles.metaRow}>
            <AppIcon
              name="calendar"
              size={13}
              color={colors.textSecondary}
              style={styles.metaIcon}
            />
            <Text style={styles.meta}>{task.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <AppIcon
              name="clock"
              size={13}
              color={colors.textSecondary}
              style={styles.metaIcon}
            />
            <Text style={styles.meta}>{taskTime}</Text>
          </View>

          <Text style={styles.warning}>
            Marking this as pending will require you to complete it again later.
          </Text>

          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={[styles.btnText, styles.cancelText]}>No</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.btnText}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ConfirmStatusModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
  },
  title: {
    ...typography.heading,
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  name: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  desc: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 6,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  warning: {
    marginTop: spacing.md,
    fontSize: 12,
    color: '#b45309',
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  btn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#e5e7eb',
    marginRight: spacing.sm,
  },
  confirm: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  btnText: {
    fontWeight: '700',
    color: '#fff',
  },
  cancelText: {
    color: '#000',
  },
});
