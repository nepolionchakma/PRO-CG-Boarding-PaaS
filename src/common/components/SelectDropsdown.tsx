import React, {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface jobTitleProps {
  name: string;
  value: string;
}
interface tenantsProps {
  tenant_name: string;
  tenant_id: string;
}
interface selectProps {
  name: nameType;
  label: string;
  data: jobTitleProps[] | tenantsProps[];
  setSelectedValue: (name: nameType, value: string) => void;
}
type nameType = 'tenant_id' | 'job_title';
const SelectDropsdown = ({
  name,
  label,
  data,
  setSelectedValue,
}: selectProps) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem, index) => {
        // console.log(index, 'index');
        setSelectedValue(name, selectedItem.value || selectedItem.tenant_id);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            {/* {selectedItem && (
              <Icon
                name={selectedItem.icon}
                style={styles.dropdownButtonIconStyle}
              />
            )} */}
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.name) ||
                (selectedItem && selectedItem.tenant_name) ||
                label}
            </Text>
            <Icon
              name={isOpened ? 'chevron-up' : 'chevron-down'}
              style={styles.dropdownButtonArrowStyle}
            />
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && {backgroundColor: '#D2D9DF'}),
            }}>
            <Text style={styles.dropdownItemTxtStyle}>
              {item.name || item.tenant_name}
            </Text>
            {isSelected && (
              <Icon name="check" style={styles.dropdownItemIconStyle} />
            )}
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};
export default SelectDropsdown;
const styles = StyleSheet.create({
  dropdownButtonStyle: {
    // width: 200,
    height: 50,
    // backgroundColor: '#E9ECEF',
    borderColor: '#E9ECEF',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderColor: 'gray',
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
