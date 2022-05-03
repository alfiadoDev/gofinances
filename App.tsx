import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';

import theme from './src/global/styles/theme';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { AppRoutes } from './src/routes/app.routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { SignIn } from './src/screens/SignIn';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar barStyle='light-content' />
          <SignIn />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
