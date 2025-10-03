import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../modules/Home/Home';

const {Navigator, Screen} = createNativeStackNavigator();
const RootStack = () => {
  return (
    <Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Screen name="Home" component={Home} />
    </Navigator>
  );
};

export default RootStack;
