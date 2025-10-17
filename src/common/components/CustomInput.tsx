import React, {Fragment} from 'react';
import {Controller} from 'react-hook-form';
import {
  KeyboardTypeOptions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {COLORS, SIZES} from '../constant/Themes';
interface ValidationRules {
  required?: boolean | string | {value: boolean; message: string};
  pattern?: {value: RegExp; message: string}; // Correcting this line
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
}

const CustomInputNew = ({
  control,
  name,
  rules,
  placeholder,
  secureTextEntry = false,
  label,
  disabled = false,
  multiline,
  rightIcon,
  leftIcon,
  keyboardType = 'default',
  inputMainStyle,
  labelStyle,
  textInputStyle,
  setValue,
  // isAuth = false,
  onChange,
  selectionColor,
}: // isImportant,
Props) => {
  const handleChange = (e: string) => {
    if (onChange) {
      onChange(e);
    } else {
      setValue(name, e, {shouldDirty: true});
    }
  };
  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value, onBlur}, fieldState: {error}}) => {
          console.log(error, 'error');
          return (
            <>
              <View>
                <View style={[inputMainStyle]}>
                  <View style={styles.box}>
                    {value ? (
                      <View>
                        <Text style={[styles.newLabelIOS, labelStyle]}>
                          {label}
                        </Text>
                      </View>
                    ) : null}

                    <View style={[styles.leftIcon]}>
                      <>{leftIcon ? leftIcon() : null}</>
                    </View>

                    <TextInput
                      style={[
                        styles.newInputIOS,
                        textInputStyle,
                        {
                          // borderColor: error ? 'red' : COLORS.offDay,

                          borderColor: value
                            ? COLORS.offDay
                            : error
                            ? 'red'
                            : COLORS.offDay,
                          width: leftIcon ? SIZES.width / 1.25 : '100%',
                        },
                        disabled ? styles.disabled : {},
                      ]}
                      selectionColor={selectionColor || 'black'}
                      placeholder={placeholder || label}
                      onBlur={onBlur}
                      onChangeText={e => handleChange(e)}
                      editable={!disabled}
                      value={value}
                      secureTextEntry={secureTextEntry}
                      multiline={multiline}
                      keyboardType={keyboardType}
                      placeholderTextColor={COLORS.graySubText}
                    />
                  </View>
                </View>
                {rightIcon ? (
                  <View style={[styles.rightIcon]}>
                    {rightIcon && rightIcon()}
                  </View>
                ) : null}
                {error && <Text style={styles.error}>{error.message}</Text>}
              </View>
            </>
          );
        }}
      />
    </Fragment>
  );
};

export default CustomInputNew;

const styles = StyleSheet.create({
  newLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  newLabelIOS: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.graySubText,
    top: -10,
    position: 'absolute',
    zIndex: 9999,
    marginLeft: 16,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 16,
  },

  newInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offDay,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: Platform?.OS === 'ios' ? 48 : 40,
    maxHeight: 100,
  },
  newInputIOS: {
    borderWidth: 1,
    borderColor: COLORS.offDay,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    // paddingTop: 9,
    // paddingBottom: 14.5,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  disabled: {
    backgroundColor: 'rgba(99, 99, 99,0.1)',
    marginTop: 1.2,
    borderRadius: 6,
  },
  rightIcon: {
    // paddingBottom: 8,
    position: 'absolute',
    zIndex: 999999,
    right: 10,
    top: 10,
  },
  leftIcon: {
    paddingBottom: 8,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 999999,
    marginLeft: 20,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
