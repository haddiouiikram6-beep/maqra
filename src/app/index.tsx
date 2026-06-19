import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Typography } from '../components';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      })
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const handleEnter = () => {
    // Fade out then navigate
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/(tabs)/library');
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content, 
        { 
          opacity: fadeAnim, 
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim }
          ] 
        }
      ]}>
        <Image 
          source={require('../../assets/magical_book.png')} 
          style={styles.image} 
          resizeMode="contain"
        />
        
        <View style={styles.textContainer}>
          <Typography variant="headlineLg" color="primary" style={styles.title}>Maqra</Typography>
          <Typography variant="bodyLg" color="onBackground" style={styles.subtitle}>Enter the magical library...</Typography>
        </View>

        <TouchableOpacity onPress={handleEnter} style={styles.button}>
          <Typography variant="labelLg" color="onPrimary">Open Book</Typography>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
    borderRadius: theme.radius.lg,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: theme.radius.full,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
});
