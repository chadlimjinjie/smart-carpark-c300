import React, { useEffect, useState } from 'react';
import { StyleSheet, Animated, ScrollView, View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Feather, Octicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import * as api from '../api/api';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import Modal from 'react-native-modal';

export default function NotificaitonCard(props) {

    /**
     * Current props/arguments that are passed to be rendered.
     * unId: user notification id, uniquely identifies each notification
     * typeId: identifies the type of notification to be rendered
     * title: Title of the notification
     * fullname: fullname name of the guest. can probably also make use of this for the manager name don't need to pass any extra props.
     */
    var { unId, typeId, title, fullname, timestamp, broadcastId } = props;

    const [showAlert, changeShowAlert] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [broadcastText, setBroadcastText] = useState("");
    const [broadcastImage, setBroadcastImage] = useState(null);
    const [broadcastCategory, setBroadcastCategory] = useState(null);
    const [broadcastCreator, setBroadcastCreator] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    console.log(broadcastId);
    if (broadcastId != null) {
        api.getBroadcastInfo(broadcastId).then(data => {
            if (data.check) {
                //console.log("Base64: " + data.image64);
                setBroadcastMessage(data.message);
                setBroadcastText(`A ${data.category} has occurred in the carpark, broadcasted by Manager ${data.creator}`)
                setBroadcastCreator(data.creator);
                setBroadcastCategory(data.category);
                setBroadcastImage(data.image64);
            }
        })
    }

    if (fullname != null) {
        var words = fullname.trim().split(" ");
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        var name = words.join(" ");
    }

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

    function rightSwipeActions() {
        return (
            <TouchableOpacity style={styles.delete} onPress={() => { clearNotification(unId) }}>
                <Feather name="trash" size={24} color="white" />
            </TouchableOpacity>
        );
    }

    console.log(timestamp)
    // .add(8, 'hours')
    var date_format = moment(timestamp).format('DD/MM/YY');
    var time_format = moment(timestamp).format('hh:mma');
    var fromNow = moment(timestamp).fromNow();

    if (!clear) {
        if (typeId == 1) {
            return (
                <Swipeable renderRightActions={rightSwipeActions} overshootRight={false}>
                    <Animated.View style={[styles.card]}>
                        <View style={[{ flexDirection: "row" }]}>
                            <View style={[styles.reservation]} />
                            <View style={[{ padding: 8, flex: 1 }]}>
                                <Text style={[styles.title]}>{title}</Text>
                                <Text style={[styles.message]}>Reservation for {name} has been confirmed</Text>
                                {timestamp ? (<View style={[{ flexDirection: "row" }]}>
                                    <Text style={{ color: "grey", flex: 1 }}>{fromNow}</Text>
                                    <Text style={{ color: "grey", marginRight: 8 }}>{date_format}</Text>
                                    <Text style={{ color: "grey" }}>{time_format}</Text>
                                </View>) : null}
                            </View>
                        </View>
                    </Animated.View>
                </Swipeable>
            );
        } else if (typeId == 2) {
            return (
                <Swipeable renderRightActions={rightSwipeActions} overshootRight={false}>
                    <Animated.View style={[styles.card]}>
                        <View style={[{ flexDirection: "row" }]}>
                            <View style={[styles.arrival]} />
                            <View style={[{ padding: 8, flex: 1 }]}>
                                <Text style={[styles.title]}>{title}</Text>
                                <Text style={[styles.message]}>Guest {name} has arrived at the carpark</Text>
                                {timestamp ? (<View style={[{ flexDirection: "row" }]}>
                                    <Text style={{ color: "grey", flex: 1 }}>{fromNow}</Text>
                                    <Text style={{ color: "grey", marginRight: 8 }}>{date_format}</Text>
                                    <Text style={{ color: "grey" }}>{time_format}</Text>
                                </View>) : null}
                            </View>
                        </View>
                    </Animated.View>
                </Swipeable>
            );
        } else if (typeId == 3) {
            return (
                <Swipeable renderRightActions={rightSwipeActions} overshootRight={false}>
                    <Animated.View style={[styles.card]}>
                        <View style={[{ flexDirection: "row" }]}>
                            <View style={[styles.arrival]} />
                            <View style={[{ padding: 8, flex: 1 }]}>
                                <Text style={[styles.title]}>{title}</Text>
                                <Text style={[styles.message]}>VIP {name} has arrived at the carpark</Text>
                                {timestamp ? (<View style={[{ flexDirection: "row" }]}>
                                    <Text style={{ color: "grey", flex: 1 }}>{fromNow}</Text>
                                    <Text style={{ color: "grey", marginRight: 8 }}>{date_format}</Text>
                                    <Text style={{ color: "grey" }}>{time_format}</Text>
                                </View>) : null}
                            </View>
                        </View>
                    </Animated.View>
                </Swipeable>
            );
        } else if (typeId == 4) {
            /**
             * Render the Alert notifications here. 
             * Don't remove Swipeable and Animated.View this is for making the 
             * notification button to reveal the delete button.
             */
            return (
                <TouchableOpacity onPress={() => broadcastImage != null ? setModalVisible(true) : changeShowAlert(true)}>
                    {broadcastImage != null ?
                        <Modal
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            animationIn='bounceIn'
                            animationOut='bounceOut'
                            isVisible={modalVisible}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,1)' }} />
                                </TouchableWithoutFeedback>
                            }>
                            <View style={{ overflow: 'hidden', borderRadius: 10, borderWidth: 5, borderColor: '#694BBE', width: '100%', height: '100%' }}>
                                <ScrollView style={{ width: '100%', height: '100%', backgroundColor: 'white', padding: 5, paddingHorizontal: 5 }}>

                                    <TouchableOpacity style={{ left: '90%', top: 5 }} onPress={() => setModalVisible(false)}>
                                        <MaterialIcons name="cancel" size={30} color="red" />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 30, color: '#694BBE', textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>Broadcast</Text>

                                    <Text style={{ marginBottom: 10 }}><Text style={{ textAlign: 'left', fontSize: 18, fontWeight: 'bold', }}>Broadcast Creator: </Text><Text style={{ textAlign: 'left', fontSize: 18 }}>{broadcastCreator}</Text></Text>
                                    <Text style={{ marginBottom: 10 }}><Text style={{ textAlign: 'left', fontSize: 18, fontWeight: 'bold', }}>Broadcast Category: </Text><Text style={{ textAlign: 'left', fontSize: 18 }}>{broadcastCategory}</Text></Text>

                                    <Text style={{ textAlign: 'left', fontSize: 18, fontWeight: 'bold', }}>Broadcast Message:</Text>
                                    <Text style={{ textAlign: 'left', marginBottom: 25, fontSize: 18 }}>{broadcastMessage}</Text>

                                    <Image style={{ width: '100%', height: 250, marginBottom: 20 }} source={{ uri: `data:image/png;base64,${broadcastImage}` }} />

                                </ScrollView>
                            </View>
                        </Modal>

                        :
                        <AwesomeAlert
                            show={showAlert}
                            showProgress={false}
                            title={"Broadcast Message"}
                            message={broadcastMessage}
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            cancelText="Close"
                            cancelButtonColor="red"
                            onCancelPressed={() => {
                                changeShowAlert(false);
                            }}
                        />
                    }

                    <Swipeable renderRightActions={rightSwipeActions} overshootRight={false}>
                        <Animated.View style={[styles.card]}>
                            <View style={[{ flexDirection: "row" }]}>
                                <View style={[styles.broadcast]} />
                                <View style={[{ padding: 8, flex: 1 }]}>
                                    <Text style={[styles.title]}>{`Alert Broadcast - ${broadcastCategory}`}</Text>
                                    <Text style={[styles.message]}>{broadcastText}</Text>
                                </View>
                            </View>
                        </Animated.View>
                    </Swipeable>
                </TouchableOpacity>

            );
        } else if (typeId == 5) {
            return (
                <Swipeable renderRightActions={rightSwipeActions} overshootRight={false}>
                    <Animated.View style={[styles.card]}>
                        <View style={[{ flexDirection: "row" }]}>
                            <View style={[styles.broadcast]} />
                            <View style={[{ padding: 8, flex: 1 }]}>
                                <Text style={[styles.title]}>{title}</Text>
                                <Text style={[styles.message]}>There is a traffic jam at the carpark</Text>
                                {timestamp ? (<View style={[{ flexDirection: "row" }]}>
                                    <Text style={{ color: "grey", flex: 1 }}>{fromNow}</Text>
                                    <Text style={{ color: "grey", marginRight: 8 }}>{date_format}</Text>
                                    <Text style={{ color: "grey" }}>{time_format}</Text>
                                </View>) : null}
                            </View>
                        </View>
                    </Animated.View>
                </Swipeable>
            )
        }
        else {
            return null;
        }
    } else {
        return null;
    }

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderWidth: 1.6,
        borderColor: "#694BBE",
        borderRadius: 8,
        marginTop: '1%',
        marginBottom: '4%',
        marginHorizontal: '1%',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6
    },
    message: {
        fontSize: 14,
        paddingRight: 20
    },
    arrival: {
        borderRightWidth: 30,
        borderTopWidth: 30,
        backgroundColor: 0,
        borderTopLeftRadius: 6,
        borderRightColor: 0,
        borderTopColor: "rgba(98,255,0,255)",
    },
    reservation: {
        borderRightWidth: 30,
        borderTopWidth: 30,
        backgroundColor: 0,
        borderTopLeftRadius: 6,
        borderRightColor: 0,
        borderTopColor: "rgba(0.5,117,255,255)"
    },
    delete: {
        backgroundColor: "red",
        width: "64%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginTop: '1%',
        marginBottom: '4%',
        marginHorizontal: '1%',
    },
    broadcast: {
        borderRightWidth: 30,
        borderTopWidth: 30,
        backgroundColor: 0,
        borderTopLeftRadius: 6,
        borderRightColor: 0,
        borderTopColor: "rgba(255,0,0,1)",
    },
    LoginButton: {
        alignItems: "center",
        padding: 10,
        backgroundColor: "#694BBE",
        width: '80%',
        marginTop: '1%',
        borderRadius: 30,
        marginBottom: '5%',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5,
    },
    loginText: {
        textAlign: 'center',
        fontFamily: 'sans-serif-medium',
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 24,
    },
});
