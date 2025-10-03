/* eslint-disable react-native/no-inline-styles */
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useIsFocused, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProcgURL} from '../../App';
import Column from '../common/components/Column';
import ContainerNew from '../common/components/Container';
import CustomButtonNew from '../common/components/CustomButton';
import CustomInputNew from '../common/components/CustomInput';
import {useToast} from '../common/components/CustomToast';
import {COLORS, SIZES} from '../common/constant/Index';
import {httpRequest} from '../common/constant/httpRequest';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import {clearAllStorage} from '../common/services/clearStorage';
import {RootStackScreenProps} from '../navigations/RootStack';
import {useRootStore} from '../stores/rootStore';
import {api} from '../common/api/api';
import Images from '../common/constant/Images';

interface PayloadType {
  email: string;
  password: string;
}

const initValue = {
  email: '',
  password: '',
};

const Login = observer<RootStackScreenProps<'Login'>>(({navigation}) => {
  const route = useRoute();

  const {userInfoSave} = useRootStore();
  //@ts-ignore
  const {fromReset, email} = route?.params || {};
  const [showPass, setShowPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toaster = useToast();
  const isFocused = useIsFocused();

  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: initValue,
  });

  if (fromReset) {
    setValue('email', email);
  }
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      GoogleSignin?.configure({
        webClientId: '',
      });

      const backAction = () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
          return true;
        } else {
          console.log('hello');
        }
      };
      // if (JailMonkey?.trustFall() || JailMonkey.AdbEnabled()) {
      //   clearAllStorage();
      // }
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    },
    [isFocused],
  );

  const onSubmit = async (data: PayloadType) => {
    const payload = {
      email: data?.email?.trim(),
      password: data?.password?.trim(),
    };
    const api_params = {
      url: api.AuthAppsLogin,
      data: payload,
      method: 'post',
      baseURL: ProcgURL,
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(api_params, setIsLoading);
    if (res?.access_token) {
      axios.defaults.baseURL = `${ProcgURL}`;
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${res?.access_token}`;
      userInfoSave(res);
      navigation.replace('HomeScreen');
      toaster.show({message: 'Login Successfully', type: 'success'});
    } else if (res?.statusCode === 0 || res === 406) {
      toaster.show({message: 'Invalid user. Try again!', type: 'error'});
      return;
    } else {
      reset();
      signOut();
      toaster.show({message: 'Something Went Wrong!', type: 'warning'});
    }
  };
  const signOut = async () => {
    clearAllStorage();
  };
  return (
    <ContainerNew edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.main}>
        <View>
          <Image source={Images.AppLogoWithNameSmall} style={styles.logo} />
          {/* <Text style={styles.appName}>PRO-CG</Text> */}
        </View>
        <Column
          colStyle={{
            marginHorizontal: 16,
          }}>
          <Column
            colStyle={{
              marginVertical: 10,
            }}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="email"
              label="Email"
              rules={{required: true}}
            />
          </Column>

          <Column
            colStyle={{
              marginVertical: 10,
            }}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="password"
              label="Password"
              rules={{required: true}}
              secureTextEntry={showPass}
              rightIcon={() => (
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Icon
                    name={showPass ? 'eye-off' : 'eye'}
                    color={COLORS.iconColor}
                    size={22}
                  />
                </TouchableOpacity>
              )}
            />
          </Column>
        </Column>

        <CustomButtonNew
          disabled={isLoading}
          btnText="Login"
          isLoading={isLoading}
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />

        <Column
          colStyle={{
            paddingTop: 10,
            marginHorizontal: 16,
          }}
          align="flex-end">
          <TouchableOpacity onPress={() => console.log('Forgot Password')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </Column>

        <Column
          colWidth={Platform.OS === 'ios' ? '91.5%' : '93%'}
          colStyle={{
            paddingTop: 20,
            marginHorizontal: 16,
          }}>
          <Column colWidth={'100%'}>
            <TouchableOpacity onPress={() => console.log('Login with SSO')}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Login with SSO</Text>
              </View>
            </TouchableOpacity>
          </Column>
          <Column
            colWidth={'100%'}
            colStyle={{
              paddingTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => console.log('Login using QR Code')}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Login using QR Code</Text>
              </View>
            </TouchableOpacity>
          </Column>
        </Column>
      </View>
    </ContainerNew>
  );
});

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  main: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.height / 10,
  },
  logo: {
    alignSelf: 'center',
    height: 100,
    width: 180,
    resizeMode: 'contain',
  },
  appName: {
    color: COLORS.transparentDark,
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 38,
    textAlign: 'center',
    paddingBottom: 30,
  },
  btn: {
    marginTop: 10,
    borderRadius: 6,
    height: 44,
    paddingVertical: 0,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    alignSelf: 'center',
  },
  paddingBtm10: {
    paddingBottom: 10,
  },
  google: {
    width: '100%',
  },
  googleBtnContainer: {
    marginHorizontal: 14,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.textNewColor,
    gap: 4,
  },
  buttonText: {
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 20,
    alignSelf: 'center',
    color: COLORS.black,
  },
  reg: {
    fontSize: 15,
    color: COLORS.primary,
    paddingHorizontal: 4,
    fontWeight: '600',
  },
  iconDesign: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
  },
  pad: {
    padding: 8,
  },
  businessPartnerTypeTxt: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 14,
  },
  rowTxt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: COLORS.textNewColor,
    paddingBottom: 10,
  },
  appContainer: {
    padding: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 8,
    color: '#F7941D',
  },
});
