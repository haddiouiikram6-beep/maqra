import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../theme';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

// Simple fallback circular progress using borders since we can't guarantee react-native-svg
export function CircularProgress({
  progress,
  size = 60,
  strokeWidth = 6,
  color = theme.colors.primary,
  label,
}: CircularProgressProps) {
  const boundedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      {/* For a true circular progress without SVG, we'd need complex half-circle rotation.
          We'll use a simplified visualization here for demonstration purposes. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: boundedProgress < 0.5 ? 'transparent' : color,
            borderBottomColor: boundedProgress < 0.25 ? 'transparent' : color,
            borderLeftColor: boundedProgress < 0.75 ? 'transparent' : color,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      <View style={styles.labelContainer}>
        <Typography variant="labelLg" style={{ fontWeight: 'bold' }}>
          {label || `${Math.round(boundedProgress * 100)}%`}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
