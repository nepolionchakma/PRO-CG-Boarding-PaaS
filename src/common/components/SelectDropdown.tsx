import React, {useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {COLORS} from '../constant/Themes';

export type SelectItem = {
  label: string;
  value: string;
};

type SelectDropdownProps = {
  items: SelectItem[];
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  labelStyle?: {};
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  items,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  error,
  disabled,
  labelStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const selectedLabel = useMemo(() => {
    const found = items.find(i => i.value === value);
    return found?.label ?? '';
  }, [items, value]);

  const handleSelect = (val: string) => {
    onChange(val);
    setSelectedValue(val);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* {label ? <Text style={styles.label}>{label}</Text> : null} */}
      {selectedValue ? (
        <View>
          <Text style={[styles.newLabelIOS, labelStyle]}>{label} </Text>
        </View>
      ) : null}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => !disabled && setVisible(true)}
        style={[
          styles.input,
          disabled && styles.disabled,
          !!error && styles.inputError,
        ]}
        disabled={disabled}>
        <Text style={[styles.inputText, !selectedLabel && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>
      </TouchableOpacity>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={item => item.value}
              renderItem={({item}) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item.value)}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionSelected,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyboardShouldPersistTaps="handled"
              style={styles.flatList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFF',
  },
  disabled: {
    backgroundColor: '#F3F4F6',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '70%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  closeText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  optionSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  flatList: {
    // maxHeight: '60%',
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
    paddingHorizontal: 4,
  },
});

export default SelectDropdown;
