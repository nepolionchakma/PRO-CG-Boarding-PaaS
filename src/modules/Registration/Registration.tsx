import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {BaseURL, FlaskURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import CustomInputNew from '../../common/components/CustomInput';
import ContainerNew from '../../common/components/ContainerNew';
import CustomButtonNew from '../../common/components/CustomButton';
import {COLORS} from '../../common/constant/Themes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useToast} from '../../common/components/CustomToast';
import {api} from '../../common/api/api';
import SelectDropsdown from '../../common/components/SelectDropsdown';
import jobTitle from './Job-Titles.json';

interface PayloadType {
  user_name: string;
  email: string;
  tenant_id: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  job_title: string;
  password: string;
}
const Registration = () => {
  const route = useRoute<any>();
  const {user_invitation_id, token} = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInvitation, setIsValidInvitation] = useState(null);
  const [message, setMessage] = useState('');
  const [tenants, setTenants] = useState([]);
  const [status, setStatus] = useState('');
  const navigation = useNavigation<any>();
  const toaster = useToast();

  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'BottomTabs',
          },
        ],
      });
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [navigation]);

  useEffect(() => {
    if (!user_invitation_id || !token) {
      return;
    }

    const tokenVerify = async () => {
      try {
        const params = {
          url: `${api.VerifyInvitation}?user_invitation_id=${user_invitation_id}&token=${token}`,
          baseURL: BaseURL,
          access_token: token,
          // isConsole: true,
          // isConsoleParams: true,
        };
        const res = await httpRequest(params, setIsLoading);
        console.log(res, 'res tokenVerify');
        setIsValidInvitation(res.valid);
        setMessage(res.message);
        setStatus(res.status);
        const params2 = {
          url: api.Tenants,
          baseURL: FlaskURL,
          access_token: token,
          // isConsole: true,
          // isConsoleParams: true,
        };
        const res2 = await httpRequest(params2, () => {});
        setTenants(res2);
      } catch (error) {
        console.log('error', error);
      }
    };

    tokenVerify();
  }, [user_invitation_id, token]);

  const userSchema = z
    .object({
      user_name: z.string().min(3, 'User name must be at least 3 characters'),
      email: z.string().email('Invalid email'),
      tenant_id: z.union([z.string(), z.number()]),
      first_name: z.string().min(3, 'First name must be at least 3 characters'),
      middle_name: z.string().optional(),
      last_name: z.string().optional(),
      job_title: z.string().min(3, 'Job title must be at least 3 characters'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirm_password: z.string(),
    })
    .refine(data => data.password === data.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    });

  const {control, handleSubmit, setValue, reset, watch, formState} = useForm<
    z.infer<typeof userSchema>
  >({
    resolver: zodResolver(userSchema),
    defaultValues: {
      user_name: '',
      email: '',
      tenant_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      job_title: '',
      password: '',
      confirm_password: '',
    },
  });

  const handleGoBack = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'BottomTabs',
        },
      ],
    });
  };
  const onSubmit = async (data: PayloadType, e: any) => {
    e.preventDefault();
    // if (!isValid) {
    //   toaster.show({message: 'Please correct the errors', type: 'error'});
    //   return;
    // }
    try {
      const postData = {
        user_name: data.user_name,
        user_type: 'person',
        email_address: data.email,
        tenant_id: Number(data.tenant_id),
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        job_title: data.job_title,
        password: data.password,
        user_invitation_id,
      };
      const params = {
        url: api.Users,
        baseURL: FlaskURL,
        access_token: token,
        data: postData,
        // isEncrypted: true,
        method: 'POST',
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(params, setIsLoading);
      toaster.show({message: res.message, type: 'success'});

      // console.log(data);
    } catch (error) {
      console.log(error, 'errors');
    }
  };

  return (
    <ContainerNew
      edges={['top', 'left', 'right']}
      isRefresh={true}
      // backgroundColor={COLORS.lightBackground}
      isScrollView={true}
      header={
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Icon name="arrow-back" size={24} onPress={handleGoBack} />
          <Text style={{fontSize: 16, fontWeight: '500'}}>
            User Registration
          </Text>
        </View>
      }
      footer={
        !isValidInvitation ? null : (
          <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
            <CustomButtonNew
              disabled={isLoading}
              btnText="Register"
              isLoading={isLoading}
              // onBtnPress={() => {}}
              onBtnPress={handleSubmit(onSubmit)}
              btnstyle={styles.btn}
              btnTextStyle={styles.btnTxt}
            />
          </View>
        )
      }
      style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.darkBlue} />
      ) : (
        <>
          {!isValidInvitation ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {/* <Text>{message ?? 'Invalid Token'}</Text> */}
              {status === 'EXPIRED' ? (
                <Text>Invitation has expired</Text>
              ) : status === 'ACCEPTED' ? (
                <View>
                  <Text>Invitation has already been accepted</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={{gap: 15, marginTop: 10}}>
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="user_name"
                label="User Name"
                rules={{required: true}}
              />
              <SelectDropsdown
                name="tenant_id"
                label="Select a Tenant"
                data={tenants}
                setSelectedValue={setValue}
              />
              <SelectDropsdown
                name="job_title"
                label="Select a Job Title"
                data={jobTitle}
                setSelectedValue={setValue}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="email"
                label="Enter your email"
                rules={{required: true}}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="first_name"
                label="First Name"
                rules={{required: true}}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="middle_name"
                label="Middle Name"
                rules={{required: true}}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="last_name"
                label="Last Name"
                rules={{required: true}}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="password"
                label="Password"
                rules={{required: true}}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="confirm_password"
                label="Confirm Password"
                rules={{required: true}}
              />
              <Text>{formState.errors.confirm_password?.message}</Text>
              {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
            </View>
          )}
        </>
      )}
    </ContainerNew>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 8,
  },
  btn: {
    borderRadius: 100,
    justifyContent: 'center',
    paddingVertical: 9,
    backgroundColor: COLORS.darkBlue,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
  },
});
