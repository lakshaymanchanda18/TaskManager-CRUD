import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import AnimatedTaskItem from '../components/AnimatedTaskItem';
import ConfirmStatusModal from '../components/ConfirmStatusModal';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const Tasks = ({ navigation }) => {
  // 🔥 HOOKS MUST BE AT TOP — NO CONDITIONS ABOVE THIS
  const {
    todayTasks,
    tomorrowTasks,
    upcomingTasks,
    completedTasks,
    toggleComplete,
  } = useTasks();

  const [query, setQuery] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // 🔥 SAFE MEMO
  const filterTasks = (list) =>
    list.filter((t) =>
      (
        t.title +
        ' ' +
        (t.description || '') +
        ' ' +
        t.priority +
        ' ' +
        t.date
      )
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  const todayFiltered = useMemo(() => filterTasks(todayTasks), [query, todayTasks]);
  const tomorrowFiltered = useMemo(() => filterTasks(tomorrowTasks), [query, tomorrowTasks]);
  const upcomingFiltered = useMemo(() => filterTasks(upcomingTasks), [query, upcomingTasks]);
  const completedFiltered = useMemo(() => filterTasks(completedTasks), [query, completedTasks]);

  const handleToggle = (task) => {
    if (task.completed) {
      setSelectedTask(task);
      setConfirmVisible(true);
    } else {
      toggleComplete(task.id);
    }
  };

  const renderTask = ({ item }) => (
    <AnimatedTaskItem
      item={item}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
      onComplete={() => handleToggle(item)}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.search}
          placeholder="Search tasks..."
          value={query}
          onChangeText={setQuery}
        />

        <Text style={styles.sectionTitle}>Today</Text>
        {todayFiltered.length === 0 ? (
          <Text style={styles.empty}>No tasks found</Text>
        ) : (
          <FlatList
            data={todayFiltered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            scrollEnabled={false}
          />
        )}

        <Text style={styles.sectionTitle}>Tomorrow</Text>
        {tomorrowFiltered.length === 0 ? (
          <Text style={styles.empty}>No tasks found</Text>
        ) : (
          <FlatList
            data={tomorrowFiltered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            scrollEnabled={false}
          />
        )}

        <Text style={styles.sectionTitle}>Upcoming</Text>
        {upcomingFiltered.length === 0 ? (
          <Text style={styles.empty}>No tasks found</Text>
        ) : (
          <FlatList
            data={upcomingFiltered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            scrollEnabled={false}
          />
        )}

        <Text style={styles.sectionTitle}>Completed</Text>
        {completedFiltered.length === 0 ? (
          <Text style={styles.empty}>No tasks found</Text>
        ) : (
          <FlatList
            data={completedFiltered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      <ConfirmStatusModal
        visible={confirmVisible}
        task={selectedTask}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          toggleComplete(selectedTask.id);
          setConfirmVisible(false);
        }}
      />
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },

  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },

  empty: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
});
