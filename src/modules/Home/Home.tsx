import {Alert, BackHandler, StyleSheet, Text} from 'react-native';
import React from 'react';
import ContainerNew from '../../common/components/ContainerNew';

const Home = () => {
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
      {
        text: 'Cancel',
        onPress: () => {
          return false;
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          BackHandler.exitApp();
          return true;
        },
      },
    ]);
    return true;
  };

  BackHandler.addEventListener('hardwareBackPress', backAction);

  return (
    <ContainerNew>
      <Text>Home</Text>
    </ContainerNew>
  );
};

export default Home;

const styles = StyleSheet.create({});
