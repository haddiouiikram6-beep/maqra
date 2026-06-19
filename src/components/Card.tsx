import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface CardProps extends ViewProps {
  level?: 0 | 1 | 2;
  children?: React.ReactNode;
  style?: any;
}

export function Card({ level = 1, style, children, ...props }: CardProps) {
  const getElevationStyle = () => {
    switch (level) {
      case 0:
        return {
          backgroundColor: theme.colors.surface,
          shadowColor: 'transparent',
          elevation: 0,
        };
      case 2:
        return {
          backgroundColor: theme.colors.surfaceContainerLowest,
          shadowColor: theme.colors.primaryContainer,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          borderColor: theme.colors.surfaceVariant,
          borderWidth: 1,
        };
      case 1:
      default:
        return {
          backgroundColor: theme.colors.surfaceContainerLowest,
          shadowColor: theme.colors.primaryContainer,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
          borderColor: theme.colors.surfaceVariant,
          borderWidth: 1,
        };
    }
  };

  return (
    <View style={[styles.card, getElevationStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.stackMd,
    overflow: 'hidden',
  },
});
