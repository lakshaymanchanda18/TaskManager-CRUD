import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useThemeColors } from '../theme/colors';
import AppIcon from '../components/icons/AppIcon';

import AuthStack from './AuthStack';
import MainStack from './MainStack';

const ONBOARDING_STEPS = [
  {
    icon: 'wave',
    title: 'Welcome',
    subtitle: 'Great to have you in TaskManager',
  },
  {
    icon: 'calendar',
    title: 'Plan Your Day',
    subtitle: 'Create tasks with date, time and priority',
  },
  {
    icon: 'check',
    title: 'Track Progress',
    subtitle: 'Use Today, Upcoming and Completed tabs to stay on top',
  },
];

const LOGIN_STEPS = [
  {
    icon: 'wave',
    title: 'Welcome Back',
    subtitle: 'Good to see you again',
  },
  {
    icon: 'bolt',
    title: 'Quick Tip',
    subtitle: 'Open Home for reminders and one-tap completion',
  },
];

const RootNavigator = () => {
  const colors = useThemeColors();
  const { user, loading, authEntryFlow, clearAuthEntryFlow } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef([]);

  useEffect(() => {
    if (!user || !authEntryFlow) return;

    slidesRef.current =
      authEntryFlow.type === 'register' ? ONBOARDING_STEPS : LOGIN_STEPS;

    setStep(0);
    setShowOnboarding(true);
  }, [user, authEntryFlow]);

  useEffect(() => {
    if (!showOnboarding) return;
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [showOnboarding, step, fadeAnim]);

  const handleNext = () => {
    const slides = slidesRef.current;

    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
      return;
    }

    setShowOnboarding(false);
    clearAuthEntryFlow();
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  if (showOnboarding) {
    const slides = slidesRef.current;
    const item = slides[step];

    if (!item) {
      return <MainStack />;
    }

    return (
      <View style={[styles.onboardingWrap, { backgroundColor: colors.background }]}>
        <Animated.View
          style={[
            styles.onboardingCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.iconWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <AppIcon name={item.icon} size={24} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {step + 1}/{slides.length}
          </Text>

          <Pressable
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {step === slides.length - 1 ? 'Continue' : 'Next'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return <MainStack />;
};

export default RootNavigator;

const styles = StyleSheet.create({
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  onboardingCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  progress: {
    marginTop: 18,
    fontWeight: '700',
  },
  nextBtn: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
