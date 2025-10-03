import axios from 'axios';
import React from 'react';
import {
  Linking,
  LogBox,
  Platform,
  StatusBar,
  Text,
  TextInput,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BottomTabs from './src/navigations/BottomTabs';
import RootStack from './src/navigations/RootStack';
import {
  GlobalContextProvider,
  useGlobalContext,
} from './src/contexts/GlobalContext';
import {useCallback, useMemo} from 'react';
import delay from './src/common/services/delay';
import {makeDecryption, makeEncryption} from './src/common/constant/encryption';
import {withoutEncryptionApi} from './src/common/api/withoutEncrytApi';
import useIsDarkTheme from './src/hooks/useIsDarkTheme';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'ViewPropTypes']);
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;
}

if ((TextInput as any).defaultProps == null) {
  (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.allowFontScaling = false;
}
// export const ProcgURL = procgURLL;
// export const secretKey = secretKeyy;
// export const secureStorageKey = secureStorageKeyy;

const linking: LinkingOptions<any> = {
  prefixes: [
    /* your linking prefixes */
    'procgboardingpass://',
    'https://procg.viscorp.app',
  ],
  config: {
    /* configuration for matching screens with paths */
    initialRouteName: 'Loader',
    screens: {
      // Loader: {
      //   path: 'loader/:delay?/:text?',
      //   parse: {
      //     delay: ms => Number(ms),
      //     text: text => decodeURIComponent(text),
      //   },
      //   stringify: {
      //     delay: ms => String(ms),
      //     text: text => encodeURIComponent(text),
      //   },
      // },
      Home: '',
      Register: 'invitaion',
    },
  },
};

// Encryption process
axios.interceptors.request.use(
  async (config: any) => {
    let url = config?.url;
    if (withoutEncryptionApi.some(element => url?.includes(element))) {
      return config;
    }
    let copyOfConfig = {...config};
    const apiPrefixes = url?.includes('?');
    if (apiPrefixes) {
      let splitUrl = url?.split('?');
      const encryptedData = await makeEncryption(splitUrl?.[1]);
      url = `${splitUrl?.[0]}?${encryptedData}`;
      copyOfConfig = {...config, url};
    }
    let payload = null;
    if (config?.data) {
      payload = await makeEncryption(JSON.stringify(config?.data));
    }

    copyOfConfig = {
      ...copyOfConfig,
      data: payload,
      headers: {
        ...copyOfConfig.headers,
        'Content-Type': 'application/json',
      },
    };

    return copyOfConfig;
  },
  async error => {
    // console.log('error', JSON.stringify(error, null, 2));
    let decryptedData = await makeDecryption(error?.response?.data);
    let newError = {response: {data: decryptedData || ''}};
    return Promise.reject(newError);
  },
);

axios.interceptors.response.use(
  async (response: any) => {
    if (
      withoutEncryptionApi.some(element =>
        response?.config?.url?.includes(element),
      )
    ) {
      return response;
    }
    let decryptedData = makeDecryption(response?.data);
    return {
      status: response?.status,
      data: decryptedData,
    };
  },

  async error => {
    if (error?.response?.status === 401) {
      return Promise.reject({response: {data: 401}});
    } else if (error?.response?.status === 406) {
      return Promise.reject({response: {data: 406}});
    } else {
      let decryptedError = makeDecryption(error?.response?.data);
      let modifiedError = {response: {data: decryptedError || ''}};
      if (
        modifiedError?.response?.data?.message ===
        'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
      ) {
      } else {
        return Promise.reject(modifiedError);
      }
    }
  },
);

const Main = () => {
  const isLogin = true;
  const {handleHydrate} = useGlobalContext();
  const [isDark] = useIsDarkTheme();

  const theme = useMemo(() => {
    if (isDark) {
      return DarkTheme;
    }
    return DefaultTheme;
  }, [isDark]);

  const onReady = useCallback(async () => {
    try {
      const uri = await Linking.getInitialURL();
      if (uri) {
        await delay(200);
        await handleHydrate();
        // await BootSplash.hide({fade: true});
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }, [handleHydrate]);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar
          barStyle={'light-content'}
          // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          translucent={Platform.OS === 'ios'}
        />
        <NavigationContainer linking={linking} theme={theme} onReady={onReady}>
          {isLogin ? <BottomTabs /> : <RootStack />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const App = () => {
  return (
    <GlobalContextProvider>
      <Main />
    </GlobalContextProvider>
  );
};

export default App;
