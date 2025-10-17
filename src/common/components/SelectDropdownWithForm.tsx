import React, {Fragment} from 'react';
import {View} from 'react-native';
import {Controller} from 'react-hook-form';
import {KeyboardTypeOptions} from 'react-native';
// import {COLORS} from '../constant/Themes';
import SelectDropdown from './SelectDropdown';
interface ValidationRules {
  required?: boolean | string | {value: boolean; message: string};
  pattern?: {value: RegExp; message: string};
  minLength?: {value: number; message: string};
  maxLength?: {value: number; message: string};
  min?: {value: number; message: string};
  max?: {value: number; message: string};
  validate?: {[key: string]: (value: any) => boolean | string};
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  disabled?: boolean;
}
interface Props {
  control: any;
  name: any;
  rules?: ValidationRules;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  disabled?: boolean;
  multiline?: boolean;
  rightIcon?: () => JSX.Element;
  leftIcon?: () => JSX.Element;
  keyboardType?: KeyboardTypeOptions;
  inputMainStyle?: {};
  labelStyle?: {};
  textInputStyle?: {};
  setValue?: any;
  isAuth?: boolean;
  onChange?: any;
  selectionColor?: string;
  isImportant?: boolean;
  data: jobTitleProps[] | tenantsProps[];
  setSelectedValue: (name: nameType, value: string) => void;
}

interface jobTitleProps {
  job_title_id: number;
  job_title_name: string;
}
interface tenantsProps {
  tenant_name: string;
  tenant_id: string;
}
type nameType = 'tenant_id' | 'job_title';
const SelectDropdownWithForm = ({
  control,
  name,
  rules,
  label,
  data,
  setSelectedValue,
  placeholder,
}: Props) => {
  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value, onChange}, fieldState: {error}}) => {
          const items = Array.isArray(data)
            ? data.map((item: any) => {
                if (typeof item?.job_title_id !== 'undefined') {
                  return {
                    label: String(item.job_title_name),
                    value: String(item.job_title_id),
                  };
                }
                if (typeof item?.tenant_id !== 'undefined') {
                  return {
                    label: String(item.tenant_name),
                    value: String(item.tenant_id),
                  };
                }
                return {
                  label: String(item?.label ?? ''),
                  value: String(item?.value ?? ''),
                };
              })
            : [];

          const handleChange = (val: string) => {
            onChange(val);
            setSelectedValue(name as nameType, val);
          };

          return (
            <View>
              <SelectDropdown
                items={items}
                value={value}
                onChange={handleChange}
                label={label}
                error={error?.message}
                disabled={items.length === 0}
                placeholder={placeholder}
              />
            </View>
          );
        }}
      />
    </Fragment>
  );
};

export default SelectDropdownWithForm;

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
