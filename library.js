import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { device, gStyle } from '../constants';

// components
import CategoryItem from '../components/CategoryItem';
import Header from '../components/Header';

// mock data
import libraryMenu from '../mockdata/menuYourLibrary.json';

const LibraryScreen = () => {
  return (
    <View style={gStyle.container}>
      <View style={styles.headerContainer}>
        <Header title="Your Library" />
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={libraryMenu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryItem
            icon={item.icon}
            onPress={() => null}
            title={item.title}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  listContainer: {
    marginTop: device.iPhoneNotch ? 88 : 64
  }
});

export default LibraryScreen;
