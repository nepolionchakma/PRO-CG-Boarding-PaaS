import React from 'react';
import Home from '../modules/Home/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {Navigator, Screen} = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Icon name="home" size={24} color="black" />,
        }}
      />
    </Navigator>
  );
};

export default BottomTabs;
