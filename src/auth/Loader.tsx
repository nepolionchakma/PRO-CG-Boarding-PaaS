import {FC, useEffect} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {COLORS, IMAGES, SIZES} from '../common/constant/Index';
import delay from '../common/services/delay';
import {RootStackParamList} from '../types/Navigations/NavigationTypes';
import BootSplash from 'react-native-bootsplash';
// import {useRootStore} from '../stores/rootStore';
// import axios from 'axios';
// import {ProcgURL} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGlobalContext} from '../contexts/GlobalContext';

interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Loader'>;
  route: any;
}
const Loader: FC<RegisterScreenProps> = ({navigation}) => {
  const {handleHydrate, hydrated} = useGlobalContext();

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
        // if (userInfo?.access_token) {
        // axios.defaults.baseURL = `${ProcgURL}`;
        // axios.defaults.headers.common.Authorization = `Bearer ${userInfo?.access_token}`;
        navigation.replace('Home');
        // }
        // else {
        //   navigation.replace('Login');
        // }
      });
    }
  }, [hydrated, navigation]);

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
