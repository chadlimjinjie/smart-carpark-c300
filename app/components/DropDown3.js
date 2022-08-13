import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { View, StyleSheet } from "react-native";

export default function DropDown3() {
    const [BufferTime, setBufferTime] = useState("");
    return (
        <View>
            <RNPickerSelect
                style={customPickerStyles}
                selectedValue={BufferTime}
                onValueChange={(BufferTime) => setBufferTime(BufferTime)}
                items={[
                    { label: "No Buffer Time", value: "NBF" },
                    { label: "15 Minutes", value: "15Mins" },
                    { label: "20 Minutes", value: "20Mins" },
                    { label: "25 Minutes", value: "25Mins" },
                    { label: "30 Minutes", value: "30Mins" },

                ]}
            />
        </View>
    );
}
const customPickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
