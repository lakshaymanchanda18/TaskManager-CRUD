import React, {
  useLayoutEffect,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Animated,
  Easing,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import ConfirmStatusModal from '../components/ConfirmStatusModal';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const TaskDetails = ({ route, navigation }) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const { task: initialTask } = route.params;
  const { tasks, toggleComplete, deleteTask } = useTasks();

  const [showConfirm, setShowConfirm] = useState(false);
  const screenAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(screenAnim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [screenAnim]);

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
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenAnim,
          transform: [
            {
              translateY: screenAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.title}>{task.title?.toUpperCase()}</Text>
      <Text style={styles.desc}>{task.description}</Text>

      <Text style={styles.meta}>
        {task.date} • {task.fromTime} - {task.toTime}
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
        <Text style={styles.editBtnText}>Edit Task</Text>
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
    </Animated.View>
  );
};

export default TaskDetails;

const getStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.lg,
      backgroundColor: colors.background,
    },

    title: {
      ...typography.heading,
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },

    desc: {
      ...typography.body,
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },

    meta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },

    status: {
      marginBottom: spacing.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },

    button: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: spacing.sm,
    },

    editBtn: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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

    editBtnText: {
      color: colors.textPrimary,
      fontWeight: '700',
    },
  });
