import { Animated } from 'react-native';

export const fadeIn = (animatedValue, duration = 400) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};
