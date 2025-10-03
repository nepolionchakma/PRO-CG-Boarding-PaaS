import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import Loader from '../auth/Loader';

const {Navigator, Screen} = createNativeStackNavigator();
const RootStack = () => {
  return (
    <Navigator initialRouteName="Loader" screenOptions={{headerShown: false}}>
      <Screen name="Loader" component={Loader} />
      <Screen name="Home" component={BottomTabs} />
    </Navigator>
  );
};

export default RootStack;
