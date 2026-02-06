import React, { useRef, useEffect } from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import TaskCard from './TaskCard';
import { useTasks } from '../context/TasksContext';

const AnimatedTaskItem = ({ item, onPress, onComplete }) => {
  const { deleteTask } = useTasks();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderRightActions = () => (
    <View style={styles.deleteBox}>
      <Text style={styles.deleteText}>Delete</Text>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => deleteTask(item.id)}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY }, { scale }],
        }}
      >
        <TaskCard
          task={item}
          onPress={onPress}
          onComplete={onComplete}
        />
      </Animated.View>
    </Swipeable>
  );
};

export default React.memo(AnimatedTaskItem);

const styles = StyleSheet.create({
  deleteBox: {
    backgroundColor: '#d11a2a',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    marginBottom: 16,
    borderRadius: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },
});
