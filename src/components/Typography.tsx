import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

type TypographyVariant = keyof typeof theme.typography;
type ColorVariant = keyof typeof theme.colors;

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorVariant;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children?: React.ReactNode;
  style?: any;
  numberOfLines?: number;
}

export function Typography({
  variant = 'bodyMd',
  color = 'onSurface',
  align = 'auto',
  style,
  ...props
}: TypographyProps) {
  const textStyle = theme.typography[variant];
  const textColor = theme.colors[color];

  return (
    <Text
      style={[
        textStyle,
        { color: textColor, textAlign: align },
        style,
      ]}
      {...props}
    />
  );
}
