import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import Loader from '../auth/Loader';
import Registration from '../modules/Registration/Registration';

const {Navigator, Screen} = createNativeStackNavigator();
const RootStack = () => {
  return (
    <Navigator initialRouteName="Loader" screenOptions={{headerShown: false}}>
      <Screen name="Loader" component={Loader} />
      <Screen name="BottomTabs" component={BottomTabs} />
      <Screen name="Registration" component={Registration} />
    </Navigator>
  );
};

export default RootStack;
