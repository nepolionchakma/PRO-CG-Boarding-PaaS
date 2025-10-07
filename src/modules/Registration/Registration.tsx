import React, {useEffect} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const Registration = () => {
  const route = useRoute<any>();
  const {user_invitation_id, token} = route.params || {};
  //backpress to BottomTabs
  const navigation = useNavigation<any>();

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

  return (
    <View style={styles.container}>
      <Text>Registration</Text>
      <Text style={styles.text}>User ID: {user_invitation_id}</Text>
      <Text style={styles.text}>Token: {token}</Text>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 8,
  },
});
