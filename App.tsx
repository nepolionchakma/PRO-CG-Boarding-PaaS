import React from 'react';
import {flaskURL, nodeURL, secretKeyy, secureStorageKeyy} from '@env';
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
import RootStack from './src/navigations/RootStack';
import {
  GlobalContextProvider,
  useGlobalContext,
} from './src/contexts/GlobalContext';
import {useCallback, useMemo} from 'react';
import delay from './src/common/services/delay';
import useIsDarkTheme from './src/hooks/useIsDarkTheme';
import {ToastProvider} from './src/common/components/CustomToast';
import {PaperProvider} from 'react-native-paper';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {withoutEncryptionApi} from './src/common/api/withoutEncrytApi';
import {makeDecryption, makeEncryption} from './src/common/constant/encryption';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'ViewPropTypes']);
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;
}

if ((TextInput as any).defaultProps == null) {
  (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.allowFontScaling = false;
}
export const BaseURL = nodeURL;
export const FlaskURL = flaskURL;
export const secretKey = secretKeyy;
export const secureStorageKey = secureStorageKeyy;

const linking: LinkingOptions<any> = {
  prefixes: [
    /* your linking prefixes */
    'PROCG://',
    'https://procg.datafluent.team',
  ],
  config: {
    /* configuration for matching screens with paths */
    // initialRouteName: 'Loader',
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
      Registration: 'invitation/:user_invitation_id/:token',
      BottomTabs: {
        screens: {
          Home: '',
        },
      },
    },
  },
};

// Encryption process
axios.interceptors.request.use(
  async config => {
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
  async (response: AxiosResponse) => {
    if (
      withoutEncryptionApi.some(element =>
        response?.config?.url?.includes(element),
      )
    ) {
      return response;
    }
    let decryptedData = makeDecryption(response?.data);
    return {
      ...response,
      data: decryptedData,
    };
  },

  async (error: AxiosError) => {
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
        <PaperProvider>
          <ToastProvider>
            <NavigationContainer
              linking={linking}
              theme={theme}
              onReady={onReady}>
              <RootStack />
            </NavigationContainer>
          </ToastProvider>
        </PaperProvider>
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
