import React, { FC } from 'react';
import { Pressable, StyleSheet, View, ViewStyle, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface DatePickerProps {
    style?: ViewStyle;
    inputStyle?: ViewStyle;
    disabled?: boolean;
    isModalVisible: boolean;
    date?: Date;
    placeholder?: string;
    mode?: 'date' | 'time' | 'datetime';
    dateFormat?: string;
    onConfirm: (value: Date) => void;
    onCancel: () => void;
    onPress?: () => void;
}

const DatePicker: FC<DatePickerProps> = ({
    style,
    inputStyle,
    disabled,
    isModalVisible,
    date,
    placeholder,
    mode,
    dateFormat,
    onConfirm,
    onCancel,
    onPress,
}) => {
    const containerStyle = {
        marginTop: 5,
        marginHorizontal: 30,
        borderColor: "#CECECE",
        borderWidth: 2,
        borderRadius: 25,
    };

    const textStyle = {
        color: date && !disabled ? 'black' : '#9A9A9A',
    };

    function dateFormatFunction(){
        if (dateFormat){
            return dateFormat;
        }
        return 'dd/MM/yyyy';
    }

    return (
        <View style={[containerStyle, style, styles.flex1]}>
            <Pressable
                style={[styles.dateInputContainer, inputStyle]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={[styles.dateText, textStyle]}>
                    {date ? format(date, dateFormatFunction()) : placeholder ? placeholder : 'dd/mm/yyyy'}
                </Text>
                <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    size={18}
                    color={'#9A9A9A'}
                />
            </Pressable>
            <DateTimePickerModal
                textColor="black"
                isVisible={isModalVisible}
                mode = {mode ? mode : 'date'}
                onConfirm={onConfirm}
                onCancel={onCancel}
                date={date}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 22,
        paddingVertical: 18,
    },
    dateText: {
        fontSize: 13,
    },
    flex1: {
        flex: 1,
    },
});

export default DatePicker;
