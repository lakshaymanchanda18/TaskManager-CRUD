import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const DashboardCard = ({ title, value, children }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      {children ? <View style={styles.extra}>{children}</View> : null}
    </View>
  );
};

export default React.memo(DashboardCard);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 1,                 // 🔑 makes it square
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  extra: {
    marginTop: spacing.sm,
  },
});
