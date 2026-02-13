import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

import { useTasks } from '../context/TasksContext';
import DashboardCard from '../components/DashboardCard';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const Home = ({ navigation }) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const {
    tasks = [],
    total = 0,
    completed = 0,
    progress = 0,
    todayTasks = [],
    tomorrowTasks = [],
    startingSoon = [],
    reminderTasks = [],
    toggleComplete,
  } = useTasks();

  const important = tasks.filter(
    t => !t.completed && t.priority === 'HIGH',
  ).length;

  const renderTaskRow = task => (
    <View key={task.id} style={styles.taskRow}>
      <Pressable
        style={styles.circleBtn}
        onPress={() => toggleComplete(task.id)}
      >
        <View style={styles.circleInner} />
      </Pressable>

      <Text style={styles.taskItem}>{task.title}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          <DashboardCard
            title="Progress"
            value={progress}
            valueSuffix="%"
            icon="📈"
            onPress={() =>
              navigation.navigate('Tasks', { filter: 'all' })
            }
          >
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
          </DashboardCard>

          <DashboardCard
            title="Total"
            value={total}
            icon="📌"
            onPress={() =>
              navigation.navigate('Tasks', { filter: 'all' })
            }
          />

          <DashboardCard
            title="Completed"
            value={completed}
            icon="✅"
            onPress={() =>
              navigation.navigate('Tasks', { filter: 'completed' })
            }
          />

          <DashboardCard
            title="Important"
            value={important}
            icon="⭐"
            onPress={() =>
              navigation.navigate('Tasks', { filter: 'all' })
            }
          />
        </View>

        {/* STARTING SOON */}
        {startingSoon.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Starting Soon</Text>
            </View>

            <View style={styles.sectionCard}>
              {startingSoon.map(t => (
                <Text key={t.id} style={styles.taskItem}>
                  ⏰ {t.title} • {t.fromTime}
                </Text>
              ))}
            </View>
          </>
        )}

        {reminderTasks.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reminders ⏰</Text>
            </View>

            <View style={styles.sectionCard}>
              {reminderTasks.slice(0, 4).map(t => (
                <View key={t.id} style={styles.reminderRow}>
                  <Text style={styles.reminderBadge}>🔔</Text>
                  <Text style={styles.reminderText}>
                    {t.title} • {t.fromTime}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* TODAY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today</Text>
        </View>

        <View style={styles.sectionCard}>
          {todayTasks.length === 0 ? (
            <Text style={styles.empty}>No tasks for today</Text>
          ) : (
            todayTasks.slice(0, 3).map(renderTaskRow)
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tomorrow</Text>
        </View>

        <View style={styles.sectionCard}>
          {tomorrowTasks.length === 0 ? (
            <Text style={styles.empty}>No tasks for tomorrow</Text>
          ) : (
            tomorrowTasks.slice(0, 3).map(renderTaskRow)
          )}
        </View>
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
};

export default Home;

const getStyles = colors =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: spacing.lg,
    paddingBottom: 100,
    backgroundColor: colors.background,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    ...typography.subheading,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  reminderBadge: {
    fontSize: 16,
    marginRight: 10,
  },

  reminderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },

  circleBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  circleInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.primary,
  },

  taskItem: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },

  empty: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  });
