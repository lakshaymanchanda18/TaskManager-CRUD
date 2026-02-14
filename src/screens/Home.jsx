import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

import { useTasks } from '../context/TasksContext';
import DashboardCard from '../components/DashboardCard';
import AppIcon from '../components/icons/AppIcon';
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

  const important = tasks.filter(t => !t.completed && t.priority === 'HIGH').length;

  const getTimeLabel = task => (task.allDay ? 'All day' : task.fromTime || 'All day');

  const renderTaskCard = task => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskRow}>
        <Pressable
          style={styles.circleBtn}
          onPress={() => toggleComplete(task.id)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Mark ${task.title || 'task'} complete`}
        />
        <View style={styles.taskTextWrap}>
          <Text style={styles.taskItem}>{task.title || 'UNTITLED TASK'}</Text>
          <Text style={styles.taskSubText}>{getTimeLabel(task)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <DashboardCard
            title="Progress"
            value={progress}
            valueSuffix="%"
            iconName="trend"
            onPress={() => navigation.navigate('Tasks', { filter: 'all' })}
          >
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </DashboardCard>

          <DashboardCard
            title="Total"
            value={total}
            iconName="pin"
            onPress={() => navigation.navigate('Tasks', { filter: 'all' })}
          />

          <DashboardCard
            title="Completed"
            value={completed}
            iconName="check"
            onPress={() => navigation.navigate('Tasks', { filter: 'completed' })}
          />

          <DashboardCard
            title="Important"
            value={important}
            iconName="star"
            onPress={() => navigation.navigate('Tasks', { filter: 'all' })}
          />
        </View>

        {startingSoon.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Starting Soon</Text>
            </View>
            <View style={styles.sectionCard}>
              {startingSoon.map(t => (
                <View key={t.id} style={styles.metaRow}>
                  <AppIcon
                    name="clock"
                    size={14}
                    color={colors.textSecondary}
                    style={styles.metaIcon}
                  />
                  <Text style={styles.reminderText}>
                    {t.title} - {getTimeLabel(t)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {reminderTasks.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Reminders</Text>
                <AppIcon
                  name="clock"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.sectionTitleIcon}
                />
              </View>
            </View>
            <View style={styles.sectionCard}>
              {reminderTasks.slice(0, 4).map(t => (
                <View key={t.id} style={styles.reminderRow}>
                  <AppIcon
                    name="bell"
                    size={15}
                    color={colors.textSecondary}
                    style={styles.reminderBadge}
                  />
                  <Text style={styles.reminderText}>
                    {t.title} - {getTimeLabel(t)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today</Text>
        </View>
        {todayTasks.length === 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.empty}>No tasks for today</Text>
          </View>
        ) : (
          todayTasks.map(renderTaskCard)
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tomorrow</Text>
        </View>
        {tomorrowTasks.length === 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.empty}>No tasks for tomorrow</Text>
          </View>
        ) : (
          tomorrowTasks.map(renderTaskCard)
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddTask')}>
        <AppIcon name="plus" size={28} color="#fff" />
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
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitleIcon: {
      marginLeft: 8,
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
    taskCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    taskRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    taskTextWrap: {
      flex: 1,
    },
    taskItem: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
      marginBottom: 4,
    },
    taskSubText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    circleBtn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'transparent',
      borderWidth: 1.75,
      borderColor: colors.textSecondary,
      marginRight: 12,
      marginTop: 2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    metaIcon: {
      marginRight: 8,
    },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    reminderBadge: {
      marginRight: 10,
    },
    reminderText: {
      fontSize: 14,
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
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
  });
