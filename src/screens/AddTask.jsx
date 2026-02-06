import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { useTasks } from '../context/TasksContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const AddTask = ({ navigation, route }) => {
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
      title: task.title.trim().toUpperCase(),
      date: task.date.toISOString().split('T')[0],
      fromTime: task.fromTime.toTimeString().slice(0, 5),
      toTime: task.toTime.toTimeString().slice(0, 5),
    };

    if (isEdit) {
      updateTask(payload);
    } else {
      addTask(payload);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure?',
      [
        { text: 'Cancel' },
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
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.label}>TITLE</Text>
      <TextInput
        style={[styles.input, styles.titleInput]}
        placeholder="ENTER TASK TITLE"
        value={task.title}
        autoCapitalize="characters"
        onChangeText={v =>
          setTask({ ...task, title: v })
        }
      />

      {/* DESCRIPTION */}
      <Text style={styles.label}>DESCRIPTION</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Optional description..."
        multiline
        value={task.description}
        onChangeText={v =>
          setTask({ ...task, description: v })
        }
      />

      {/* PRIORITY */}
      <Text style={styles.label}>PRIORITY</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={task.priority}
          onValueChange={v =>
            setTask({ ...task, priority: v })
          }
        >
          {PRIORITIES.map(p => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      {/* DATE */}
      <Text style={styles.label}>DATE</Text>
      <Pressable
        style={styles.selector}
        onPress={() => setShowDate(true)}
      >
        <Text style={styles.selectorText}>
          {task.date.toDateString()}
        </Text>
      </Pressable>

      {/* TIME */}
      <View style={styles.timeRow}>
        <Pressable
          style={styles.selector}
          onPress={() => setShowFrom(true)}
        >
          <Text style={styles.selectorText}>
            From: {task.fromTime.toTimeString().slice(0, 5)}
          </Text>
        </Pressable>

        <Pressable
          style={styles.selector}
          onPress={() => setShowTo(true)}
        >
          <Text style={styles.selectorText}>
            To: {task.toTime.toTimeString().slice(0, 5)}
          </Text>
        </Pressable>
      </View>

      {/* PICKERS */}
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

      {/* SUBMIT */}
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>
          {isEdit ? 'UPDATE TASK' : 'ADD TASK'}
        </Text>
      </Pressable>

      {/* DELETE (EDIT MODE ONLY) */}
      {isEdit && (
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.buttonText}>DELETE TASK</Text>
        </Pressable>
      )}
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },

  label: {
    ...typography.subheading,
    fontSize: 12,
    marginBottom: 4,
    marginTop: spacing.md,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
  },

  selector: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: '#fff',
  },

  selectorText: {
    fontWeight: '600',
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
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
});
