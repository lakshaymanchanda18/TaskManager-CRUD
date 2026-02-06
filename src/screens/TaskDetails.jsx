import React, { useLayoutEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import ConfirmStatusModal from '../components/ConfirmStatusModal';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const TaskDetails = ({ route, navigation }) => {
  const { task: initialTask } = route.params;
  const { tasks, toggleComplete, deleteTask } = useTasks();

  const [showConfirm, setShowConfirm] = useState(false);

  // Always get fresh task from context
  const task = useMemo(
    () => tasks.find(t => t.id === initialTask.id),
    [tasks, initialTask.id]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Task Details' });
  }, [navigation]);

  if (!task) return null;

  const handleToggle = () => {
    if (task.completed) {
      setShowConfirm(true);
    } else {
      toggleComplete(task.id);
    }
  };

  const handleEdit = () => {
    navigation.navigate('AddTask', { editTask: task });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.desc}>{task.description}</Text>

      <Text style={styles.meta}>
        {task.date} • {task.fromTime} – {task.toTime}
      </Text>

      <Text style={styles.status}>
        Status: {task.completed ? 'Completed' : 'Pending'}
      </Text>

      <Pressable style={styles.button} onPress={handleToggle}>
        <Text style={styles.buttonText}>
          {task.completed ? 'Mark Pending' : 'Mark Complete'}
        </Text>
      </Pressable>

      <Pressable style={styles.editBtn} onPress={handleEdit}>
        <Text style={styles.buttonText}>Edit Task</Text>
      </Pressable>

      <Pressable style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Task</Text>
      </Pressable>

      <ConfirmStatusModal
        visible={showConfirm}
        task={task}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          toggleComplete(task.id);
          setShowConfirm(false);
        }}
      />
    </View>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },

  title: {
    ...typography.heading,
    marginBottom: spacing.md,
  },

  desc: {
    ...typography.body,
    marginBottom: spacing.md,
  },

  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  status: {
    marginBottom: spacing.lg,
    fontWeight: '600',
  },

  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  editBtn: {
    backgroundColor: '#555',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  deleteBtn: {
    backgroundColor: '#d11a2a',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
