// import React, {StyleSheet, Text, View} from 'react-native';
// import SelectDropdown from 'react-native-select-dropdown';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {Controller} from 'react-hook-form';
// import {KeyboardTypeOptions, Platform} from 'react-native';
// import {COLORS} from '../constant/Themes';
// import {Fragment} from 'react';

// interface Props {
//   control: any;
//   name: any;
//   rules?: {};
//   placeholder?: string;
//   secureTextEntry?: boolean;
//   label?: string;
//   disabled?: boolean;
//   multiline?: boolean;
//   rightIcon?: () => JSX.Element;
//   leftIcon?: () => JSX.Element;
//   keyboardType?: KeyboardTypeOptions;
//   inputMainStyle?: {};
//   labelStyle?: {};
//   textInputStyle?: {};
//   setValue?: any;
//   isAuth?: boolean;
//   onChange?: any;
//   selectionColor?: string;
//   isImportant?: boolean;
//   data: jobTitleProps[] | tenantsProps[];
//   setSelectedValue: (name: nameType, value: string) => void;
// }

// interface jobTitleProps {
//   job_title_id: number;
//   job_title_name: string;
// }
// interface tenantsProps {
//   tenant_name: string;
//   tenant_id: string;
// }
// type nameType = 'tenant_id' | 'job_title';
// const SelectDropdownWithForm = ({
//   control,
//   name,
//   rules = {},
//   label,
//   data,
//   setSelectedValue,
// }: Props) => {
//   return (
//     <Fragment>
//       <Controller
//         name={name}
//         control={control}
//         rules={rules}
//         render={() => {
//           // console.log(value, 'value', error, 'error');
//           return (
//             <SelectDropdown
//               data={data}
//               onSelect={selectedItem => {
//                 if (selectedItem.job_title_name) {
//                   setSelectedValue(name, selectedItem.job_title_name);
//                 } else {
//                   setSelectedValue(name, selectedItem.tenant_id);
//                 }
//               }}
//               renderButton={(selectedItem, isOpened) => {
//                 return (
//                   <View style={styles.dropdownButtonStyle}>
//                     <Text style={styles.dropdownButtonTxtStyle}>
//                       {(selectedItem && selectedItem.job_title_name) ||
//                         (selectedItem && selectedItem.tenant_name) ||
//                         label}
//                     </Text>
//                     <Icon
//                       name={isOpened ? 'chevron-up' : 'chevron-down'}
//                       style={styles.dropdownButtonArrowStyle}
//                     />
//                   </View>
//                 );
//               }}
//               renderItem={(item, index, isSelected) => {
//                 return (
//                   <View
//                     style={{
//                       ...styles.dropdownItemStyle,
//                       ...(isSelected && {backgroundColor: '#D2D9DF'}),
//                     }}>
//                     <Text style={styles.dropdownItemTxtStyle}>
//                       {item.job_title_name || item.tenant_name}
//                     </Text>
//                     {isSelected && (
//                       <Icon name="check" style={styles.dropdownItemIconStyle} />
//                     )}
//                   </View>
//                 );
//               }}
//               showsVerticalScrollIndicator={false}
//               dropdownStyle={styles.dropdownMenuStyle}
//               disabled={data.length === 0}
//             />
//           );
//         }}
//       />
//     </Fragment>
//   );
// };

// export default SelectDropdownWithForm;

// const styles = StyleSheet.create({
//   newLabel: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: COLORS.textNewColor,
//   },
//   newLabelIOS: {
//     fontSize: 16,
//     lineHeight: 20,
//     color: COLORS.graySubText,
//     top: -10,
//     position: 'absolute',
//     zIndex: 9999,
//     marginLeft: 16,
//     backgroundColor: 'white',
//   },
//   error: {
//     color: 'red',
//     fontSize: 10,
//     marginTop: -18,
//     marginBottom: 10,
//   },

//   newInput: {
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.offDay,
//     fontSize: 16,
//     lineHeight: 24,
//     color: COLORS.textNewColor,
//     paddingVertical: 0,
//     paddingHorizontal: 0,
//     paddingTop: 4,
//     paddingBottom: 4,
//     minHeight: Platform?.OS === 'ios' ? 48 : 40,
//     maxHeight: 100,
//   },
//   newInputIOS: {
//     borderWidth: 1,
//     borderColor: COLORS.offDay,
//     fontSize: 16,
//     lineHeight: 24,
//     color: COLORS.textNewColor,
//     // paddingTop: 9,
//     // paddingBottom: 14.5,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: '#f9f9f9',
//   },
//   disabled: {
//     backgroundColor: 'rgba(99, 99, 99,0.1)',
//     marginTop: 1.2,
//     borderRadius: 6,
//   },
//   rightIcon: {
//     // paddingBottom: 8,
//     position: 'absolute',
//     zIndex: 999999,
//     right: 10,
//     top: 10,
//   },
//   leftIcon: {
//     paddingBottom: 8,
//     alignSelf: 'flex-end',
//     position: 'absolute',
//     zIndex: 999999,
//     marginLeft: 20,
//   },
//   box: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dropdownButtonStyle: {
//     // width: 200,
//     height: 50,
//     // backgroundColor: '#E9ECEF',
//     borderColor: '#E9ECEF',
//     borderWidth: 1,
//     borderRadius: 12,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//   },
//   dropdownButtonTxtStyle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#151E26',
//   },
//   dropdownButtonArrowStyle: {
//     fontSize: 28,
//   },
//   dropdownButtonIconStyle: {
//     fontSize: 28,
//     marginRight: 8,
//   },
//   dropdownMenuStyle: {
//     backgroundColor: '#E9ECEF',
//     borderRadius: 8,
//   },
//   dropdownItemStyle: {
//     width: '100%',
//     flexDirection: 'row',
//     paddingHorizontal: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 0.3,
//     borderColor: 'gray',
//   },
//   dropdownItemTxtStyle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#151E26',
//   },
//   dropdownItemIconStyle: {
//     fontSize: 28,
//     marginRight: 8,
//   },
// });
