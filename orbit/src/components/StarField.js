// src/components/StarField.js
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 2.8 + 0.4,
  baseOpacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 4000,
  duration: Math.random() * 2500 + 1500,
}));

const Star = ({ x, y, size, baseOpacity, delay, duration }) => {
  const opacity = useSharedValue(baseOpacity);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(baseOpacity * 0.15, { duration }),
          withTiming(baseOpacity, { duration })
        ),
        -1,   // infinite
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animStyle,
      ]}
    />
  );
};

const StarField = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {STARS.map((s) => (
      <Star key={s.id} {...s} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});

export default StarField;