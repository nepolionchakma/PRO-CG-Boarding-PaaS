import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import BottomTabs from './src/navigations/BottomTabs';

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar
          barStyle={'light-content'}
          // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          translucent={Platform.OS === 'ios'}
        />
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
