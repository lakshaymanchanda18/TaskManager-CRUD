import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import AppIcon from './icons/AppIcon';

const DashboardCard = ({
  title,
  value,
  onPress,
  children,
  iconName,
  valueSuffix = '',
}) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        {iconName ? (
          <View style={styles.iconWrap}>
            <AppIcon
              name={iconName}
              size={16}
              color={colors.textSecondary}
            />
          </View>
        ) : null}
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
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: 8,
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
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
