import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'text';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: any;
}

export function Button({ title, variant = 'primary', icon, style, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const backgroundColor = isPrimary ? theme.colors.primary : 'transparent';
  const borderColor = isSecondary ? theme.colors.secondary : 'transparent';
  const borderWidth = isSecondary ? 1 : 0;
  const textColor = isPrimary ? 'onPrimary' : isSecondary ? 'secondary' : 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor, borderColor, borderWidth },
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Typography variant="labelLg" color={textColor as any}>
          {title}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.DEFAULT,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.stackSm,
  },
});
