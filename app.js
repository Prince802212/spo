import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { loadResources } from './src/constants';

// Root stack navigation
import AppNavigator from './src/navigation/AppNavigator';

// App context provider
import AppProvider from './src/context/AppProvider';

function MainApp() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();
        // Load resources such as images, fonts, and videos
        await loadResources();
      } catch (error) {
        // You can log the error here
      } finally {
        // Indicate that the loading is complete
        setAppIsReady(true);
      }
    }

    initializeApp();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen when the app is ready
      const hideSplashScreen = async () => await SplashScreen.hideAsync();
      hideSplashScreen();
