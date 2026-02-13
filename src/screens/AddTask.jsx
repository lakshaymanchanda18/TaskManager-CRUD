import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Animated,
  Easing,
  Modal,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { useTasks } from '../context/TasksContext';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const formatLocalDate = d => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const AddTask = ({ navigation, route }) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const { addTask, updateTask, deleteTask } = useTasks();
  const editTask = route?.params?.editTask;

  const isEdit = !!editTask;

  const [task, setTask] = useState({
    id: editTask?.id ?? null,
    title: editTask?.title ?? '',
    description: editTask?.description ?? '',
    priority: editTask?.priority ?? 'MEDIUM',
    date: editTask?.date ? new Date(editTask.date) : new Date(),
    fromTime: editTask?.fromTime
      ? new Date(`1970-01-01T${editTask.fromTime}`)
      : new Date(),
    toTime: editTask?.toTime
      ? new Date(`1970-01-01T${editTask.toTime}`)
      : new Date(),
    completed: editTask?.completed ?? false,
    createdAt: editTask?.createdAt ?? Date.now(),
  });

  const [showDate, setShowDate] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [formAnim]);

  useEffect(() => {
    if (!showSuccess) return;

    successScale.setValue(0.7);
    Animated.spring(successScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 90,
    }).start();
  }, [showSuccess, successScale]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Edit Task' : 'Add Task',
    });
  }, [navigation, isEdit]);

  const submit = () => {
    if (!task.title.trim()) {
      Alert.alert('Missing Title', 'Task title is required.');
      return;
    }

    const payload = {
      ...task,
      title: task.title.trim().replace(/\s+/g, ' ').toUpperCase(),

      // 🔥 FIX: LOCAL DATE NOT UTC
      date: formatLocalDate(task.date),

      fromTime: task.fromTime.toTimeString().slice(0, 5),
      toTime: task.toTime.toTimeString().slice(0, 5),
    };

    if (isEdit) {
      updateTask(payload);
      navigation.goBack();
    } else {
      addTask(payload);
      setShowSuccess(true);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.container}
      style={{
        opacity: formAnim,
        transform: [
          {
            translateY: formAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>{isEdit ? 'Update Task' : 'Create Task'}</Text>

      <View style={styles.sectionCard}>
      <Text style={styles.label}>TITLE</Text>
      <TextInput
        style={[styles.input, styles.titleInput]}
        placeholder="ENTER TASK TITLE"
        placeholderTextColor={colors.textSecondary}
        value={task.title}
        autoCapitalize="characters"
        onChangeText={v => setTask({ ...task, title: v })}
      />

      <Text style={styles.label}>DESCRIPTION</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Optional description..."
        placeholderTextColor={colors.textSecondary}
        multiline
        value={task.description}
        onChangeText={v => setTask({ ...task, description: v })}
      />

      <Text style={styles.label}>PRIORITY</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={task.priority}
          onValueChange={v => setTask({ ...task, priority: v })}
        >
          {PRIORITIES.map(p => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>
      </View>

      <View style={styles.sectionCard}>
      <Text style={styles.label}>DATE</Text>
      <Pressable style={styles.selector} onPress={() => setShowDate(true)}>
        <Text style={styles.selectorText}>{task.date.toDateString()}</Text>
      </Pressable>

      <View style={styles.timeRow}>
        <Pressable style={styles.selector} onPress={() => setShowFrom(true)}>
          <Text style={styles.selectorText}>
            From: {task.fromTime.toTimeString().slice(0, 5)}
          </Text>
        </Pressable>

        <Pressable style={styles.selector} onPress={() => setShowTo(true)}>
          <Text style={styles.selectorText}>
            To: {task.toTime.toTimeString().slice(0, 5)}
          </Text>
        </Pressable>
      </View>
      </View>

      {showDate && (
        <DateTimePicker
          value={task.date}
          mode="date"
          onChange={(_, d) => {
            setShowDate(false);
            if (d) setTask({ ...task, date: d });
          }}
        />
      )}

      {showFrom && (
        <DateTimePicker
          value={task.fromTime}
          mode="time"
          onChange={(_, d) => {
            setShowFrom(false);
            if (d) setTask({ ...task, fromTime: d });
          }}
        />
      )}

      {showTo && (
        <DateTimePicker
          value={task.toTime}
          mode="time"
          onChange={(_, d) => {
            setShowTo(false);
            if (d) setTask({ ...task, toTime: d });
          }}
        />
      )}

      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>
          {isEdit ? 'UPDATE TASK' : 'ADD TASK'}
        </Text>
      </Pressable>

      {isEdit && (
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.buttonText}>DELETE TASK</Text>
        </Pressable>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showSuccess}
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.successOverlay}>
          <Animated.View
            style={[
              styles.successCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                transform: [{ scale: successScale }],
              },
            ]}
          >
            <Text style={styles.successTick}>✅</Text>
            <Text style={[styles.successTitle, { color: colors.textPrimary }]}>New Task Created</Text>
            <Text style={[styles.successSub, { color: colors.textSecondary }]}>Your task has been added successfully.</Text>

            <Pressable
              style={[styles.successBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowSuccess(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.successBtnText}>Continue</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </Animated.ScrollView>
  );
};

export default AddTask;

const getStyles = colors =>
  StyleSheet.create({
    container: {
      padding: spacing.lg,
      paddingBottom: 28,
      backgroundColor: colors.background,
      flexGrow: 1,
    },
    heading: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    label: {
      ...typography.subheading,
      fontSize: 12,
      marginBottom: 4,
      marginTop: spacing.md,
      color: colors.textPrimary,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: spacing.md,
      backgroundColor: colors.card,
      color: colors.textPrimary,
    },
    titleInput: {
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.textPrimary,
    },
    textArea: {
      height: 90,
      textAlignVertical: 'top',
    },
    pickerWrap: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    selector: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: spacing.md,
      backgroundColor: colors.card,
      height: 52,
      justifyContent: 'center',
    },
    selectorText: {
      fontWeight: '600',
      color: colors.textPrimary,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    button: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: spacing.xl,
    },
    deleteBtn: {
      backgroundColor: '#d11a2a',
      padding: spacing.md,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '700',
      letterSpacing: 1,
    },
    successOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    successCard: {
      width: '100%',
      borderRadius: 20,
      borderWidth: 1,
      padding: 24,
      alignItems: 'center',
    },
    successTick: {
      fontSize: 54,
      marginBottom: 8,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 6,
    },
    successSub: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
    },
    successBtn: {
      paddingVertical: 10,
      paddingHorizontal: 22,
      borderRadius: 12,
    },
    successBtnText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '800',
    },
  });
