import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../api/api';
import moment from 'moment';

export default function Traffic() {

    var [trafficThreshold, setTrafficThreshold] = useState(0);
    var [traffic, setTraffic] = useState({});

    // useEffect(() => {
    //     api.getTrafficThreshold().then(data => {
    //         setTrafficThreshold(data.traffic_threshold);
    //     });
    //     api.getTraffic().then(data => {
    //         setTraffic({ cars: data.cars, timestamp: data.timestamp });
    //     });
    //     var loop = setInterval(() => {
    //         api.getTrafficThreshold().then(data => {
    //             setTrafficThreshold(data.traffic_threshold);
    //         });
    //         api.getTraffic().then(data => {
    //             setTraffic({ cars: data.cars, timestamp: data.timestamp });
    //         });
    //     }, 15000);
    //     return () => {
    //         clearInterval(loop);
    //     }
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            api.getTrafficThreshold().then(data => {
                setTrafficThreshold(data.traffic_threshold);
            });
            api.getTraffic().then(data => {
                setTraffic({ cars: data.cars, timestamp: data.timestamp });
            });
            var loop = setInterval(() => {
                api.getTrafficThreshold().then(data => {
                    setTrafficThreshold(data.traffic_threshold);
                });
                api.getTraffic().then(data => {
                    setTraffic({ cars: data.cars, timestamp: data.timestamp });
                });
            }, 15000);
            return () => {
                clearInterval(loop);
            }
        }, [])
    );

    var vehicles = traffic.cars; // traffic.cars
    // var timestamp = moment(traffic.timestamp).add(8, 'hours').format('YYYY-MM-DD h:mm:ss a');
    var fromNow = moment(traffic.timestamp).fromNow();

    if (vehicles > 0 && vehicles < trafficThreshold + 1) {
        return (
            <View style={styles.traffic}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={[styles.normal, { marginRight: 10 }]}></View>
                    </View>
                    <View>
                        <Text>{`There are ${vehicles} vehicle(s)`}</Text>
                        <Text>{"Last Updated : " + fromNow}</Text>
                    </View>
                </View>
            </View>
        );
    } else if (vehicles > trafficThreshold) {
        return (
            <View style={styles.traffic}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={[styles.warning, { marginRight: 10 }]}></View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{`There are ${vehicles} car(s)`}</Text>
                        <Text>Entrance threshold limit of {trafficThreshold} have been reached</Text>
                        <Text>{"Last Updated : " + fromNow}</Text>
                    </View>
                </View>
            </View>
        );
    } else {
        return null
    }

}

const styles = StyleSheet.create({
    traffic: {
        margin: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: '#694BBE',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5
    },
    normal: {
        backgroundColor: "lime",
        width: 50,
        height: 50,
        borderRadius: 50 / 2
    },
    warning: {
        backgroundColor: "red",
        width: 50,
        height: 50,
        borderRadius: 50 / 2
    }
});
