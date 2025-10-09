import React, {FC, useEffect, useState} from 'react';
import {Image, Linking, Platform, StyleSheet, View} from 'react-native';
import {COLORS, IMAGES, SIZES} from '../common/constant/Index';
import delay from '../common/services/delay';
import {RootStackParamList} from '../types/Navigations/NavigationTypes';
import BootSplash from 'react-native-bootsplash';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGlobalContext} from '../contexts/GlobalContext';

interface LoaderProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Loader'>;
  route: any;
}

const Loader: FC<LoaderProps> = ({navigation}) => {
  const {handleHydrate, hydrated} = useGlobalContext();
  const [deepLinkData, setDeepLinkData] = useState<{
    url: string;
    user_invitation_id?: string | undefined;
    token?: string | undefined;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        // console.log('App opened via deep link:', url);

        // Match URLs like: https://procg.datafluent.team/invitation/10/<token>
        const match = url.match(/invitation\/(\d+)\/([^/]+)/);

        if (match) {
          const [user_invitation_id, token] = match;
          // console.log('Extracted params:', {user_invitation_id, token});
          setDeepLinkData({url, user_invitation_id, token});
        } else {
          setDeepLinkData({url});
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const isVisible = await BootSplash.isVisible();
        if (isVisible) {
          await delay(500);
          await BootSplash.hide({fade: true});
          handleHydrate();
        } else if (!hydrated) {
          handleHydrate();
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [handleHydrate, hydrated]);

  useEffect(() => {
    if (hydrated) {
      delay(1000).then(() => {
        if (deepLinkData?.url?.includes('invitation')) {
          // console.log('Navigating to Register with params:', deepLinkData);
          navigation.replace('Registration', {
            user_invitation_id: deepLinkData.user_invitation_id,
            token: deepLinkData.token,
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'BottomTabs'}],
          });
        }
      });
    }
  }, [hydrated, deepLinkData, navigation]);

  return (
    <View style={styles.center}>
      <Image style={styles.logo} source={IMAGES.AppLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
    paddingTop: Platform.OS === 'ios' ? SIZES.height / 2.6 : 0.001,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  logo: {
    width: Platform.OS === 'ios' ? 90 : 100,
    height: Platform.OS === 'ios' ? 98 : 90,
    alignSelf: 'center',
  },
});

export default Loader;
