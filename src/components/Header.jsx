import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import TaskManagerLogo from './icons/TaskManagerLogo';

const Header = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TaskManagerLogo size={32} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
});
