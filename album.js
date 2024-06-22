import React, { useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors, device, gStyle, images } from '../constants';

// components
import LinearGradient from '../components/LinearGradient';
import SongItem from '../components/SongItem';
import IconTouch from '../components/IconTouch';
import TextTouch from '../components/TextTouch';

// mock data
import albumData from '../mockdata/albums';

// context
import AppContext from '../context';

const AlbumScreen = ({ navigation, route }) => {
  const { title } = route.params;

  // get app context state
  const { currentSong, showPlayerBar, setAppState } = useContext(AppContext);

  // local state
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(currentSong.title);
  const scrollY = useRef(new Animated.Value(0)).current;

  // album data from mock
  const album = albumData[title] || null;

  const handleToggleDownload = (value) => {
    if (device.web) {
      setIsDownloaded(value);
      return;
    }

    if (!value) {
      Alert.alert(
        'Remove from Downloads?',
        "You won't be able to play this offline.",
        [
          { text: 'Cancel' },
          {
            onPress: () => setIsDownloaded(false),
            text: 'Remove'
          }
        ],
        { cancelable: false }
      );
    } else {
      setIsDownloaded(value);
    }
  };

  const handleChangeSong = (track) => {
    setCurrentTrack(track.title);
    setAppState('currentSong', track);
  };

  if (!album) {
    return (
      <View style={[gStyle.container, gStyle.flexCenter]}>
        <Text style={{ color: colors.white }}>{`Album: ${title}`}</Text>
      </View>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: device.web ? [140, 200] : [230, 280],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const shuffleOpacity = scrollY.interpolate({
    inputRange: [40, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  return (
    <View style={gStyle.container}>
      {!showPlayerBar && (
        <BlurView intensity={99} style={styles.blurview} tint="dark" />
      )}

      <View style={styles.headerContainer}>
        <Animated.View
          style={[styles.headerGradient, { opacity: headerOpacity }]}
        >
          <LinearGradient fill={album.backgroundColor} height={89} />
        </Animated.View>
        <View style={styles.header}>
          <IconTouch
            icon={<Feather color={colors.white} name="chevron-left" />}
            onPress={() => navigation.goBack(null)}
          />
          <Animated.View style={{ opacity: shuffleOpacity }}>
            <Text style={styles.headerTitle}>{album.title}</Text>
          </Animated.View>
          <IconTouch
            icon={<Feather color={colors.white} name="more-horizontal" />}
            onPress={() => {
              setAppState('showPlayerBar', !showPlayerBar);
              navigation.navigate('ModalMoreOptions', { album });
            }}
          />
        </View>
      </View>

      <View style={styles.fixedContainer}>
        <View style={styles.gradientContainer}>
          <LinearGradient fill={album.backgroundColor} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={images[album.image]} style={styles.albumImage} />
        </View>
        <View style={styles.titleContainer}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.albumTitle}>
            {album.title}
          </Text>
        </View>
        <View style={styles.albumInfoContainer}>
          <Text style={styles.albumInfo}>
            {`Album by ${album.artist} · ${album.released}`}
          </Text>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={device.web ? [] : [0]}
        style={styles.scrollContainer}
      >
        <View style={styles.stickyHeader}>
          <Animated.View
            style={[styles.stickyGradient, { opacity: shuffleOpacity }]}
          >
            <LinearGradient fill={colors.black20} height={50} />
          </Animated.View>
          <View style={styles.shuffleContainer}>
            <TextTouch
              onPress={() => null}
              style={styles.shuffleButton}
              textStyle={styles.shuffleButtonText}
              text="Shuffle Play"
            />
          </View>
        </View>
        <View style={styles.songsContainer}>
          <View style={styles.downloadRow}>
            <Text style={styles.downloadText}>
              {isDownloaded ? 'Downloaded' : 'Download'}
            </Text>
            <Switch
              trackColor={colors.greySwitchBorder}
              onValueChange={handleToggleDownload}
              value={isDownloaded}
            />
          </View>

          {album.tracks &&
            album.tracks.map((track) => (
              <SongItem
                key={track.title}
                active={currentTrack === track.title}
                downloaded={isDownloaded}
                onPress={handleChangeSong}
                trackData={{
                  album: album.title,
                  artist: album.artist,
                  image: album.image,
                  length: track.seconds,
                  title: track.title
                }}
              />
            ))}
        </View>
        <View style={gStyle.spacer16} />
      </Animated.ScrollView>
    </View>
  );
};

AlbumScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  blurview: {
    ...StyleSheet.absoluteFill,
    zIndex: 101
  },
  headerContainer: {
    height: 89,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100
  },
  headerGradient: {
    height: 89,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: device.iPhoneNotch ? 48 : 24,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  headerTitle: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    marginTop: 2,
    paddingHorizontal: 8,
    textAlign: 'center',
    width: device.width - 100
  },
  fixedContainer: {
    alignItems: 'center',
    paddingTop: device.iPhoneNotch ? 94 : 60,
    position: 'absolute',
    width: '100%'
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  imageContainer: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    zIndex: device.web ? 20 : 0
  },
  albumImage: {
    height: 148,
    marginBottom: device.web ? 0 : 16,
    width: 148
  },
  titleContainer: {
    marginTop: device.web ? 8 : 0,
    zIndex: device.web ? 20 : 0
  },
  albumTitle: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center'
  },
  albumInfoContainer: {
    zIndex: device.web ? 20 : 0
  },
  albumInfo: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    marginBottom: 48
  },
  scrollContainer: {
    paddingTop: 89
  },
  stickyHeader: {
    marginTop: device.iPhoneNotch ? 238 : 194
  },
  shuffleContainer: {
    alignItems: 'center',
    height: 50,
    shadowColor: colors.blackBg,
    shadowOffset: { height: -10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },
  stickyGradient: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  shuffleButton: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 25,
    height: 50,
    width: 220
  },
  shuffleButtonText: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase
