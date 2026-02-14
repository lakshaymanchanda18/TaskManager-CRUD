import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Easing,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import AnimatedTaskItem from '../components/AnimatedTaskItem';
import ConfirmStatusModal from '../components/ConfirmStatusModal';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const FILTERS = ['today', 'all', 'upcoming', 'completed'];

const Tasks = ({ navigation, route }) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const {
    tasks = [],
    todayTasks = [],
    upcomingTasks = [],
    completedTasks = [],
    toggleComplete,
  } = useTasks();

  const incomingFilter = route?.params?.filter;

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const listFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (incomingFilter && FILTERS.includes(incomingFilter)) {
      setActiveFilter(prev =>
        prev === incomingFilter ? prev : incomingFilter
      );
    }
  }, [incomingFilter]);

  useEffect(() => {
    listFade.setValue(0.55);
    Animated.timing(listFade, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [activeFilter, listFade]);

  const filteredToday = useMemo(
    () =>
      todayTasks.filter(t =>
        (
          t.title +
          ' ' +
          (t.description || '') +
          ' ' +
          (t.priority || '') +
          ' ' +
          (t.date || '')
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, todayTasks]
  );

  const filteredUpcoming = useMemo(
    () =>
      upcomingTasks.filter(t =>
        (
          t.title +
          ' ' +
          (t.description || '') +
          ' ' +
          (t.priority || '') +
          ' ' +
          (t.date || '')
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, upcomingTasks]
  );

  const filteredCompleted = useMemo(
    () =>
      completedTasks.filter(t =>
        (
          t.title +
          ' ' +
          (t.description || '') +
          ' ' +
          (t.priority || '') +
          ' ' +
          (t.date || '')
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, completedTasks]
  );

  const filteredAll = useMemo(
    () =>
      tasks.filter(t =>
        (
          t.title +
          ' ' +
          (t.description || '') +
          ' ' +
          (t.priority || '') +
          ' ' +
          (t.date || '')
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, tasks]
  );

  const currentList = useMemo(() => {
    switch (activeFilter) {
      case 'today':
        return filteredToday;
      case 'upcoming':
        return filteredUpcoming;
      case 'completed':
        return filteredCompleted;
      default:
        return filteredAll;
    }
  }, [
    activeFilter,
    filteredToday,
    filteredUpcoming,
    filteredCompleted,
    filteredAll,
  ]);

  const handleToggle = task => {
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
      onPress={() =>
        navigation.navigate('TaskDetails', { task: item })
      }
      onComplete={() => handleToggle(item)}
    />
  );

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Your Tasks</Text>

        <TextInput
          style={styles.search}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textSecondary}
          color={colors.textPrimary}
          value={query}
          onChangeText={setQuery}
        />

        {/* FILTER BAR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
        >
          {FILTERS.map(f => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[
                styles.filterBtn,
                activeFilter === f && styles.activeBtn,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.activeText,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Animated.View style={{ opacity: listFade }}>
          {/* TASK LIST */}
          {currentList.length === 0 ? (
            <Text style={styles.empty}>No tasks found</Text>
          ) : (
            <FlatList
              data={currentList}
              keyExtractor={item => item.id.toString()}
              renderItem={renderTask}
              scrollEnabled={false}
            />
          )}
        </Animated.View>
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

const getStyles = colors =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      padding: spacing.lg,
      backgroundColor: colors.background,
    },

    heading: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },

    search: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },

    filterBar: {
      marginBottom: spacing.md,
    },

    filterBtn: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.card,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    activeBtn: {
      backgroundColor: colors.primary,
    },

    filterText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '700',
    },

    activeText: {
      color: '#fff',
    },

    empty: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: spacing.md,
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
