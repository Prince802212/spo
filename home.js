import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// Custom components
import AlbumSlider from '../components/AlbumSlider';

// Mock data imports
import heavyRotationData from '../mockdata/heavyRotation.json';
import jumpBackInData from '../mockdata/jumpBackIn.json';
import recentlyPlayedData from '../mockdata/recentlyPlayed.json';

function HomeScreen() {
  const scrollPosition = useRef(new Animated.Value(0)).current;

  // Interpolations for header opacity
  const fadeIn = scrollPosition.interpolate({
    inputRange: [0, 128],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const fadeOut = scrollPosition.interpolate({
    inputRange: [0, 88],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <>
      {device.iPhoneNotch && (
        <Animated.View style={[styles.notchOverlay, { opacity: fadeIn }]} />
      )}

      <Animated.View style={[styles.header, { opacity: fadeOut }]}>
        <FontAwesome color={colors.white} name="cog" size={28} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollPosition } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={gStyle.container}
      >
        <View style={gStyle.spacer16} />

        <AlbumSlider data={recentlyPlayedData} heading="Recently Played" />

        <AlbumSlider
          data={heavyRotationData}
          heading="Heavy Rotation"
          tagline="Music you've been enjoying recently."
        />

        <AlbumSlider
          data={jumpBackInData}
          heading="Jump Back In"
          tagline="Your favorites from the past few months."
        />
      </Animated.ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  notchOverlay: {
    backgroundColor: colors.black70,
    height: 44,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 20
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: device.iPhoneNotch ? 60 : 36,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  }
});

export default HomeScreen;
