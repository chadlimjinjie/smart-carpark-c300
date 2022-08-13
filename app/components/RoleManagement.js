import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import { Searchbar } from 'react-native-paper';
import {
    StyleSheet, StatusBar, TouchableOpacity,
    View, FlatList, SafeAreaView, Text, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text>
            Name:  {item.fullname}{"\n"}
      Email:   {item.email}
        </Text>
    </TouchableOpacity>
);

export default function RoleManagement() {
    const [staffInformation, setStaffInformation] = useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => {
        setSearchQuery(query)
        api.getSearchStaff(query)
            .then(data => {
                setStaffInformation(data)
            })
    };


    function getStaffInformation() {
        api.getStaffInformation().then(data => {
            setStaffInformation(data);
        })
    }

    // useEffect(
    //     () => {
    //         getStaffInformation()
    //     }, []
    // )

    useFocusEffect(
        React.useCallback(() => {
            getStaffInformation();
          }, [])
    );

    const renderItem = ({ item }) => (
        <Item
            item={item}
            onPress={() => createTwoButtonAlert(item)}
        />
    );

    function createTwoButtonAlert(item) {
        Alert.alert(
            "Changing Staff to Manager",
            "Are you sure you want to change this staff to manager?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => api.postStaffToManager(item.user_id) }
            ]
        );
    }



    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Searchbar
                    placeholder="Search for Staff"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />

                {(staffInformation.length > 0)
                    ? <FlatList data={staffInformation} renderItem={renderItem} keyExtractor={(staffInformation) => staffInformation.user_id.toString()} />
                    : <View style={styles.center}>
                        <Text style={styles.center}>No Staff Found</Text>
                    </View>}
            </View>
        </SafeAreaView>

    );

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#694BBE',
      },
      item: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
      },
      center: {
        alignItems: "center",
        padding: 10,
        fontSize:25,
        backgroundColor: 'white',
      }
    });