import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import { useTasks } from '../context/TasksContext';
import DashboardCard from '../components/DashboardCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const Home = ({ navigation }) => {
  const {
    total = 0,
    completed = 0,
    pending = 0,
    progress = 0,
    todayTasks = [],
    tomorrowTasks = [],
    startingSoon = [],
  } = useTasks();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* DASHBOARD GRID */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Progress</Text>
            <Text style={styles.cardValue}>{progress}%</Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
          </View>

          <DashboardCard title="Total" value={total} />
          <DashboardCard title="Completed" value={completed} />
          <DashboardCard title="Pending" value={pending} />
        </View>

        {/* STARTING SOON */}
        {startingSoon.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Starting Soon
              </Text>
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

        {/* TODAY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Pressable
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.more}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          {todayTasks.length === 0 ? (
            <Text style={styles.empty}>
              No tasks for today
            </Text>
          ) : (
            todayTasks.map(t => (
              <Text key={t.id} style={styles.taskItem}>
                • {t.title}
              </Text>
            ))
          )}
        </View>

        {/* TOMORROW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Tomorrow
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.more}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          {tomorrowTasks.length === 0 ? (
            <Text style={styles.empty}>
              No tasks for tomorrow
            </Text>
          ) : (
            tomorrowTasks.map(t => (
              <Text key={t.id} style={styles.taskItem}>
                • {t.title}
              </Text>
            ))
          )}
        </View>
      </ScrollView>

      {/* FLOATING ADD BUTTON */}
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

const styles = StyleSheet.create({
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

  card: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    ...typography.subheading,
  },

  more: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  taskItem: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.textPrimary,
  },

  empty: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  /* FAB */
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
