import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  Keyboard,
  Alert
} from "react-native";
import axios from "axios";
import * as api from "../api/api"
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Confirmation({ route, navigation }) {
  const { name, email, vrn, sdate, stime, edate, etime, vip, evc, id, guest } =
    route.params;
  const [sdateTime, setsDateTime] = useState(sdate + " " + stime);
  const [edateTime, seteDateTime] = useState(edate + " " + etime);
  var senddate = new Date(sdateTime);
  var sendedate = new Date(edateTime);

  function x() {
    api.createReservation(name, email, vrn, sdate, stime, etime, vip, evc, id, guest).then(data => {
      console.log("data =>" + data);
      if (data == 1) {

        Alert.alert("Reservation",
          "Reservation Create Successful",
          [
            {
              text: "Ok",
              onPress: () => {
                navigation.navigate("Reservation");

              },
            },
          ],
          { cancelable: false })
      }
    })


  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('reset', value)
    } catch (e) {
      console.log("Error at confirmation")
    }
  }

  function cancel() {
    storeData("false");
    navigation.navigate("Reservation")
  }

  console.log(typeof (JSON.stringify(evc)))
  return (
    <View style={styles.container}>

      <View style={{ width: '95%', height: '95%', backgroundColor: 'white', borderRadius: 10 }}>
        <Text style={{
          alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
          fontSize: 35, fontWeight: 'bold', color: '#694BBE', fontFamily: 'sans-serif-medium',
          marginTop: '5%'
        }}>{`Confirm\nReservation`}</Text>
        <View style={{ height: 1, width: '80%', backgroundColor: '#694BBE', alignSelf: 'center', marginBottom: '5%' }} />

        <View style={{ height: '20%', width: '80%', backgroundColor: '#694BBE', alignSelf: 'center', borderRadius: 10, marginBottom: '2%' }}>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', paddingLeft: '5%', marginBottom: '5%', marginTop: '2%' }}>
            <MaterialIcons name="person" size={22} color="white" style={{ top: 1, paddingRight: 5 }} />
            <Text style={{
              alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
            }}>{name}</Text>
          </View>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', paddingLeft: '5%', marginBottom: '5%' }}>
            <MaterialIcons name="email" size={22} color="white" style={{ top: 1, paddingRight: 5 }} />
            <Text style={{
              alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
            }}>{email}</Text>
          </View>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', paddingLeft: '5%', marginBottom: '1%' }}>
            <MaterialIcons name="directions-car" size={22} color="white" style={{ top: 1, paddingRight: 5 }} />
            <Text style={{
              alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
            }}>{vrn}</Text>
          </View>



        </View>

        <View style={{ height: '40%', width: '80%', backgroundColor: '#694BBE', alignSelf: 'center', borderRadius: 10, marginBottom: '7%' }}>

          <Text style={{
            alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
            fontSize: 25, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium', borderBottomWidth: 1, borderBottomColor: 'white',
            marginTop: '5%'
          }}>{`Reservation`}</Text>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <Text style={{
              alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
            }}>{sdate}</Text>
          </View>

          <Text style={{
            alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
            fontSize: 25, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium', borderBottomWidth: 1, borderBottomColor: 'white'
          }}>{`Duration`}</Text>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom: '5%' }}>
            <Text style={{
              alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
            }}>{stime + " - " + etime}</Text>
          </View>

          {vip == "" ? null :
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', paddingLeft: '5%', marginBottom: '5%' }}>
              <MaterialIcons name="star" size={22} color="white" style={{ top: 1, paddingRight: 5 }} />
              <Text style={{
                alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
                fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
              }}>{'Super VIP'}</Text>
            </View>
          }

          {JSON.stringify(evc) === 'true' ? (<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start', paddingLeft: '5%', marginBottom: '5%' }}>
            <MaterialCommunityIcons name="robot" size={22} color="white" style={{ top: 1, paddingRight: 5 }} />
            <Text style={{
              alignSelf: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium',
            }}>{`Robot Charger Enabled`}</Text>
          </View>) : null
          }


        </View>

        <View style={{ flexDirection: 'row', width: '80%', alignSelf: 'center' }}>
          <TouchableOpacity style={{ width: 120, height: 60, position: 'absolute', left: 0, borderRadius: 10, backgroundColor: '#694BBE', justifyContent: 'center' }} onPress={cancel}>
            <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium', }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: 120, height: 60, position: 'absolute', right: 0, borderRadius: 10, backgroundColor: '#694BBE', justifyContent: 'center' }}
            onPress={x}>
            <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif-medium', }}>Confirm</Text>
          </TouchableOpacity >
        </View>


      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#694BBE",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    color: "blue",
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: "blue",
    borderBottomLeftRadius: 1,
  },
  text: {
    padding: 10,
    fontSize: 20,
    textAlign: "left",
    flex: 1

    //borderBottomColor: "black",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  button: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "lightblue",
    marginTop: 30,
  },
});
