import React from 'react';
import Home from '../modules/Home/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Menu from '../modules/Menu/Menu';
const {Navigator, Screen} = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {display: 'none'},
          // tabBarIconStyle: {backgroundColor: 'red'},
          tabBarIcon: ({focused}) => (
            <Icon name="home" size={24} color={focused ? '#000' : '#ccc'} />
          ),
        }}
      />
      <Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarLabel: 'Menu',
          tabBarLabelStyle: {display: 'none'},
          // tabBarIconStyle: {backgroundColor: 'red'},
          tabBarIcon: ({focused}) => (
            <Icon name="menu" size={24} color={focused ? '#000' : '#ccc'} />
          ),
        }}
      />
    </Navigator>
  );
};

export default BottomTabs;
