import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, onPress } from 'react-native';
import * as api from '../api/api';
import { Switch } from 'react-native-paper';
export default function ProfilePage({ navigation }) {
    const [userId, setUserId] = useState(0);
    const [user, setUser] = useState("");
    const [userPic, setUserPic] = useState("");
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (key == 'user_id') {
            setUserId(result);
        }
        if (key == 'email') {
            setEmail(result);
        }
        if (key == 'fullname') {
            setFullname(result);
        }
        if (key == 'role_id') {
            setRole_id(result);
        }
    }

    useEffect(() => {
        getValueFor('user_id');
        api.getUser(userId).then(data => {
            setUser(data);
            //getUser will apply first then getProfilePic
            api.getProfilePic(userId).then(data => {
                setUserPic(data[0].face);
            })

        })

    }, [userId])


    var base64Image = `data:image/png;base64,{${userPic}}`;
    var role = "";

    function createAlert(userId) {
        Alert.alert(
            "Changing Manager to Staff",
            "Are you sure you want to change your role to staff?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => api.postManagerToStaff(userId) }
            ]
        );
    }

    function showRole() {
        if (user.role_id == 1) {
            role = "Staff";
        } else if (user.role_id == 2) {
            role = "Manager";
        }
        console.log(role)
    }
    showRole()

    return (
        <View style={styles.container}>

            <View style={styles.profile}>
                <Image
                    style={styles.image}
                    source={{ uri: base64Image }} />

                <Text style={styles.text}>
                    {user.fullname}
                </Text>
                <Text style={styles.text}>
                    {user.email}
                </Text>
                <Text style={styles.text}>
                    {role}
                </Text>

                <View >
                    <TouchableOpacity onPress={() => navigation.push('ResetPassword')} style={styles.button}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => createAlert(userId)} style={styles.button}>
                        <Text style={styles.buttonText}>Change to Staff</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#694BBE',
    },
    profile: {
        backgroundColor: 'white',
        width: '80%',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 400 / 2,
        position: 'absolute',
        top: '-20%',
    },
    text: {
        marginTop: '7%',
    },
    button: {
        backgroundColor: "#694BBE",
        padding: 10,
        marginTop: '7%',
        borderRadius: 10,
    },
    switch: {
        padding: 10,
        marginTop: 30,
        borderRadius: 10,
        width: 150,
        flexDirection: 'row',
    },
    buttonText: {
        color: "white",

    }
});
