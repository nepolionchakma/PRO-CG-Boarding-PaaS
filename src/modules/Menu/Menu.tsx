import React, {StyleSheet, Text, View} from 'react-native';
const Menu = () => {
  return (
    <View>
      <Text style={styles.textStyle}>Menu</Text>
    </View>
  );
};
export default Menu;
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});
