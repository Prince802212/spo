import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import GenreItem from '../components/GenreItem';
import IconTouchable from '../components/IconTouchable';

// icons
import SearchIcon from '../icons/SearchIcon';

// mock data
import allGenres from '../mockdata/searchBrowseAll.json';
import favoriteGenres from '../mockdata/searchTopGenres.json';

const SearchScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // search bar width adjustment
  const searchStartWidth = device.width - 48;
  const searchEndWidth = device.width - 88;

  const searchBarWidth = scrollY.interpolate({
    inputRange: [0, 48],
    outputRange: [searchStartWidth, searchEndWidth],
    extrapolate: 'clamp'
  });

  return (
    <React.Fragment>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        style={gStyle.container}
      >
        <View style={gStyle.spacer11} />
        <View style={styles.searchBarContainer}>
          <Animated.View style={{ width: searchBarWidth }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => null}
              style={styles.searchInput}
            >
              <View style={gStyle.marginRight1}>
                <SearchIcon />
              </View>
              <Text style={styles.searchInputText}>
                Artists, songs, or podcasts
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.headingText}>Your Top Genres</Text>
        <View style={styles.genreRow}>
          {Object.keys(favoriteGenres).map((key) => {
            const genre = favoriteGenres[key];

            return (
              <View key={genre.id} style={styles.genreColumn}>
                <GenreItem
                  bgColor={genre.color}
                  onPress={() => null}
                  title={genre.title}
                />
              </View>
            );
          })}
        </View>

        <Text style={styles.headingText}>Browse All</Text>
        <View style={styles.genreRow}>
          {Object.keys(allGenres).map((key) => {
            const genre = allGenres[key];

            return (
              <View key={genre.id} style={styles.genreColumn}>
                <GenreItem
                  bgColor={genre.color}
                  onPress={() => null}
                  title={genre.title}
                />
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>

      <View style={styles.microphoneIconContainer}>
        <IconTouchable
          icon={<FontAwesome color={colors.white} name="microphone" />}
          onPress={() => null}
        />
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    ...gStyle.paddingHorizontal3,
    backgroundColor: colors.blackBackground,
    paddingBottom: 16,
    paddingTop: device.iPhoneNotch ? 64 : 24
  },
  searchInput: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 16
  },
  searchInputText: {
    ...gStyle.textSpotify16,
    color: colors.blackBackground
  },
  headingText: {
    ...gStyle.textSpotifyBold18,
    color: colors.white,
    marginBottom: 24,
    marginLeft: 24,
    marginTop: 16
  },
  genreRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 24
  },
  genreColumn: {
    width: '50%'
  },
  microphoneIconContainer: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: device.web ? 40 : 78,
    width: 28
  }
});

export default SearchScreen;
