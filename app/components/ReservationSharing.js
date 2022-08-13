import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import {
    StyleSheet, 
    StatusBar,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';


const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text>
            Name:  {item.fullname}{"\n"}
            Email:   {item.email}
        </Text>
    </TouchableOpacity>
);

const Itemm = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text>
            Name:  {item.fullname}{"\n"}
            Date:   {item.reservation_date.slice(0, 10)}
        </Text>
    </TouchableOpacity>
);
export default function ReservationManagement() {
    const [userId, setUserId] = useState(0);
    async function getuserid() {
        let result = await SecureStore.getItemAsync('user_id');
        setUserId(result);
      }
      useFocusEffect(
        React.useCallback(() => {
          getuserid();
            console.log('userid: '+ userId)

            console.log('reserve')
            getReservationInformation(userId)
            
            console.log('staff')
            getAllStaffInformation()
          console.log('2userid: '+ userId)
        }, [userId, RsearchQuery])
      );

    

    //Reservation view
    const [ReservationInformation, setReservationInformation] = useState([]);
    const [RsearchQuery, setRSearchQuery] = React.useState('');
    const onRChangeSearch = Rquery => {
        setRSearchQuery(Rquery)
        console.log('Query '+ RsearchQuery)
        api.getSearchReservation(userId, Rquery)
            .then(data => {
                setReservationInformation(data)
            })
    };
    
      

    //Staff view
    const [shareduserId, setshareduserId] = useState(0);
    const [staffInformation, setStaffInformation] = useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => {
        setSearchQuery(query)
        api.getSearchStaffShare(query)
            .then(data => {
                setStaffInformation(data)
            })
    };

    

    function getAllStaffInformation() {
        {userId!=0 
        ? api.getAllStaffInformation().then(data => {
            setStaffInformation(data);
            console.log('succeed i guess?')
        })
        : getuserid();
        console.log('getstaffinformation here')
    }
    }
    function getReservationInformation() {
        api.getReservationInformation(userId).then(data => {
            setReservationInformation(data);
        })
    }
    //useEffect(
    //    () => {
    //        getuserid();
    //        console.log('userid: '+ userId)
//
    //        console.log('reserve')
    //        getReservationInformation(userId)
    //        
    //        console.log('staff')
    //        getStaffInformation()
    //    }, []
    //)
    
    
    const [ReservationID, setReservationID] = React.useState(null);
    const renderRes = ({ item }) => (
        <Itemm
            item={item}
            onPress={() => setReservationID(item.reservation_id)}
        />
    );
    const renderStaff = ({ item }) => (
        <Item
            item={item}
            onPress={() => TwoButtonAlert(item)}
        />
    );
    
    function TwoButtonAlert(item) {
        setshareduserId(item.user_id)
        console.log('shareduserid: '+ shareduserId)
        console.log('userid:' + userId);
        console.log('rese:'+ ReservationID)
        Alert.alert(
            "Sharing Reservation with this staff",
            "Are you sure you to share the reservation with this staff?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => api.postReservationShare(shareduserId, ReservationID) }
            ]
        );
    }



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.button}>
                    <Text style={styles.center}>Reservation Management</Text>
                </View>
                <Searchbar
                    placeholder="Search for Guest"
                    onChangeText={onRChangeSearch}
                    value={RsearchQuery}
                />
                

                {(ReservationInformation.length > 0)
                    ? <FlatList data={ReservationInformation} renderItem={renderRes} keyExtractor={(ReservationInformation) => ReservationInformation.reservation_id.toString()} />
                    : <View style={styles.center}>
                        <Text>No Reservation Found</Text>
                    </View>}
            </View>
            <View style={{marginTop: 30}}>
                <View style={styles.button}>
                    <Text style={styles.center}>Staff to Share</Text>
                </View>
                <Searchbar
                    placeholder="Search for Staff"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                

                {(staffInformation.length > 0)
                    ? <FlatList data={staffInformation} renderItem={renderStaff} keyExtractor={(staffInformation) => staffInformation.user_id.toString()} />
                    : <View style={styles.center}>
                        <Text>No Staff Found</Text>
                    </View>}
            </View>
            
        </SafeAreaView>
        </TouchableWithoutFeedback>
    );

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
    center: {
        alignItems: "center",
        padding: 10
    }
});