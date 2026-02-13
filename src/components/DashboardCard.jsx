import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const DashboardCard = ({
  title,
  value,
  onPress,
  children,
  icon,
  valueSuffix = '',
}) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>
        {value}
        {valueSuffix}
      </Text>
      {children ? <View style={styles.extra}>{children}</View> : null}
    </Pressable>
  );
};

export default React.memo(DashboardCard);

const getStyles = colors =>
  StyleSheet.create({
    card: {
      width: '48%',
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.md,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    icon: {
      fontSize: 20,
      marginBottom: 6,
    },
    title: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    value: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    extra: {
      marginTop: spacing.sm,
    },
  });
