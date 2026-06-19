import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { theme } from '../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ 
  progress, 
  color = theme.colors.primary, 
  trackColor = theme.colors.surfaceVariant,
  height = 4 
}: ProgressBarProps) {
  const boundedProgress = Math.min(Math.max(progress, 0), 1);
  const widthStr: DimensionValue = `${boundedProgress * 100}%`;

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height }]}>
      <View style={[styles.fill, { backgroundColor: color, width: widthStr }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
});
