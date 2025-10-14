import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {BaseURL, FlaskURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import CustomInputNew from '../../common/components/CustomInput';
import ContainerNew from '../../common/components/ContainerNew';
import CustomButtonNew from '../../common/components/CustomButton';
import {COLORS} from '../../common/constant/Themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useToast} from '../../common/components/CustomToast';
import {api} from '../../common/api/api';
import SelectDropsdown from '../../common/components/SelectDropsdown';
import {decrypt} from '../../common/constant/decryptToken';
import LottieView from 'lottie-react-native';

interface PayloadType {
  user_name: string;
  email: string;
  tenant_id: string | number;
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
  const [tenants, setTenants] = useState([]);
  const [status, setStatus] = useState('');
  const [showPass1, setShowPass1] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [jobTitles, setJobTitles] = useState([]);
  const navigation = useNavigation<any>();
  const toaster = useToast();

  const id = decrypt(user_invitation_id);
  const tok = decrypt(token);

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
    if (!id || !tok) {
      return;
    }

    const tokenVerify = async () => {
      const params = {
        url: `${api.VerifyInvitation}?user_invitation_id=${id}&token=${tok}`,
        baseURL: BaseURL,
        access_token: tok,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(params, setIsLoading);

      if (res?.statusCode === 200) {
        setIsValidInvitation(res.data?.valid);
        setStatus(res.data?.status);
        const params2 = {
          url: api.Tenants,
          baseURL: FlaskURL,
          access_token: tok,
          // isConsole: true,
          // isConsoleParams: true,
        };
        const res2 = await httpRequest(params2, () => {});
        setTenants(res2.data);
      } else {
        setErrorMessage(res?.data?.message);
      }
    };

    tokenVerify();
  }, [id, tok, createdUserId]);

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

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isDirty, isValid},
  } = useForm<z.infer<typeof userSchema>>({
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
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const handleSelectedOption = (
    name: 'job_title' | 'tenant_id',
    value: string | number,
  ) => {
    console.log(name, value);
    setValue(name, value);
    if (name === 'tenant_id') {
      setSelectedTenantId(value as number);
    }
  };

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
        user_invitation_id: id,
      };
      const params = {
        url: api.Users,
        baseURL: FlaskURL,
        access_token: tok,
        data: postData,
        // isEncrypted: true,
        method: 'POST',
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(params, setIsLoading);
      if (res.data.user_id) {
        setCreatedUserId(res.data.user_id);
        toaster.show({message: res.data.message, type: 'success'});
      }

      // console.log(data);
    } catch (error) {
      setCreatedUserId(null);
      console.log(error, 'errors');
    }
  };

  useEffect(() => {
    (async () => {
      const params = {
        url: api.JobTitles,
        baseURL: FlaskURL,
        access_token: tok,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(params, () => {});
      const jobs = res.data.filter(
        (i: any) => i.tenant_id === selectedTenantId,
      );
      if (jobs.length) {
        setJobTitles(jobs);
      } else {
        setValue('job_title', '');
        setJobTitles([]);
      }
    })();
  }, [selectedTenantId, setValue, tok]);

  return (
    <ContainerNew
      edges={['top', 'left', 'right']}
      isRefresh={false}
      // backgroundColor={COLORS.lightBackground}
      isScrollView={isValidInvitation ? true : false}
      header={
        <View style={styles.headerStyle}>
          <Icon
            name="arrow-left"
            size={24}
            color="#000"
            onPress={handleGoBack}
          />
          <Text style={styles.headerText}>User Registration</Text>
        </View>
      }
      footer={
        !isValidInvitation && isLoading ? null : (
          <View style={styles.footerStyle}>
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
      <View>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.darkBlue} />
        ) : (
          <View>
            {!isValidInvitation ? (
              <View style={styles.isValidInvitationDiv}>
                {status === 'ACCEPTED' ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 15,
                    }}>
                    <LottieView
                      source={require('../../assets/animations/Dashboard.json')}
                      style={{
                        width: '100%',
                        height: '50%',
                      }}
                      autoPlay
                      loop
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: COLORS.darkBlue,
                      }}>
                      Invitation has already been accepted
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 15,
                    }}>
                    <LottieView
                      source={require('../../assets/animations/InvitationExpired.json')}
                      style={{
                        width: '100%',
                        height: '50%',
                      }}
                      autoPlay
                      loop
                    />
                    <Text style={{color: 'red'}}>{errorMessage}</Text>
                  </View>
                )}
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
                  setSelectedValue={handleSelectedOption}
                />
                <SelectDropsdown
                  name="job_title"
                  label={
                    !selectedTenantId
                      ? 'Select a Job Title'
                      : selectedTenantId && jobTitles.length
                      ? 'Select a Job Title'
                      : 'No Job Title Found'
                  }
                  data={jobTitles}
                  setSelectedValue={handleSelectedOption}
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
                  rules={{required: false}}
                />
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="last_name"
                  label="Last Name"
                  rules={{required: false}}
                />
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  secureTextEntry={showPass1}
                  name="password"
                  label="Password"
                  rules={{required: true}}
                  rightIcon={() => (
                    <TouchableOpacity onPress={() => setShowPass1(!showPass1)}>
                      <Icon
                        name={showPass1 ? 'eye-off' : 'eye'}
                        color={COLORS.iconColor}
                        size={22}
                      />
                    </TouchableOpacity>
                  )}
                />
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  secureTextEntry={showPass2}
                  name="confirm_password"
                  label="Confirm Password"
                  rules={{required: true}}
                  rightIcon={() => (
                    <TouchableOpacity onPress={() => setShowPass2(!showPass2)}>
                      <Icon
                        name={showPass2 ? 'eye-off' : 'eye'}
                        color={COLORS.iconColor}
                        size={22}
                      />
                    </TouchableOpacity>
                  )}
                />
                <Text>{errors.confirm_password?.message}</Text>
                {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
              </View>
            )}
          </View>
        )}
      </View>
    </ContainerNew>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  isValidInvitationDiv: {
    height: '100%',
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
  headerStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  footerStyle: {paddingBottom: 10, paddingHorizontal: 20},
});
