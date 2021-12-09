import React from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { theme } from './src/utils/theme';
import MainNavigation from './src/navigation/index';

export default App = () => {
  return(
    <Provider theme={theme}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </Provider>
  )
}