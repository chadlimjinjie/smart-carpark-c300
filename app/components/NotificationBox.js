import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as api from '../api/api';

export default function NotificationBox(props) {

    var { unId, typeId, title, fullname } = props;
    
    var words = fullname.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    var name = words.join(" ");

    var [clear, setClear] = useState(false);

    function clearNotification(unId) {
        api.deleteNotification(unId).then(data => {
            var affectedRows = data.affectedRows;
            if (affectedRows == 1) {
                setClear(true);
            } else {
                console.log('Error clearing Notification');
            }
        });
    }

    if (!clear) {
        if (typeId == 1) {
            return (
                <View style={styles.container}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ justifyContent: "center" }}>
                            <View style={styles.reservation} />
                        </View>
                        <View style={{ flexDirection: "column", flex: 1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{title}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => { clearNotification(unId) }} >
                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.message}>Reservation for {name} has been confirmed</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else if (typeId == 2) {
            return (
                <View style={styles.container}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ justifyContent: "center" }}>
                            <View style={styles.arrival} />
                        </View>
                        <View style={{ flexDirection: "column", flex: 1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{title}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => { clearNotification(unId) }} >
                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.message}>Guest {name} has arrived at the carpark</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else if (typeId == 3) {
            return (
                <View style={styles.container}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ justifyContent: "center" }}>
                            <View style={styles.arrival} />
                        </View>
                        <View style={{ flexDirection: "column", flex: 1 }}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{title}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => { clearNotification(unId) }} >
                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.message}>VIP {name} has arrived at the carpark</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    } else {
        return null;
    }

}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderStyle: "solid",
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: "white"
    },
    title: {
        marginBottom: 10,
        fontWeight: "bold",
        fontSize: 16,
        flexBasis: "auto"
    },
    message: {
        fontSize: 14
    },
    arrival: {
        width: 50,
        height: 50,
        marginLeft: 4,
        marginRight: 10,
        borderRadius: 50 / 2,
        borderWidth: .15,
        borderColor: "lightgrey",
        backgroundColor: "rgba(98,255,0,255)" // replace with rgb()
    },
    reservation: {
        width: 50,
        height: 50,
        marginLeft: 4,
        marginRight: 10,
        borderRadius: 50 / 2,
        borderWidth: .15,
        borderColor: "lightgrey",
        backgroundColor: "rgba(0.5,117,255,255)" // replace with rgb()
    },
});
