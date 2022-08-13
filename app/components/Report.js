import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  Keyboard,
  Button,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CheckBox from "@react-native-community/checkbox";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import * as api from "../api/api"
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();

export default function Report({ navigation }) {
  const [head, sethead] = useState(['Fullname', 'Arrival Date', 'Start Time', 'End Time', 'Action'])
  const [data, setdata] = useState([])
  const [full, setFull] = useState([])
  const [RefreshPage, setRefreshPage] = useState(0);
  const [userId, setUserId] = useState(0);

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (key == 'user_id') {
      setUserId(result);
      console.log(result);
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

  useFocusEffect(
    React.useCallback(() => {
      getValueFor('user_id');

      getall();
    }, [userId]))

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     getValueFor('user_id');
  //     // The screen is focused
  //     // Call any action
  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, []);

  function getall() {
    var list = [];
    console.log("user > " + userId);
    api.getall(userId).then(data => {
      data.forEach(d => {

        // list.push([d[head[0].toLowerCase()], d[head[1].toLowerCase()].split("T")[0], d[head[2].toLowerCase()], d[head[3].toLowerCase()], 'action'])
        list.push([d[head[0].toLowerCase()],d["reservation_date"].split("T")[0],d["start_time"].substring(0, 5),d["end_time"].substring(0, 5),'action'])
      });
      setdata(list);
      setFull(data);


    });
  }



  const deleteR = (id) => {

    var rid = full[id]["reservation_id"];
    api.delReservation(rid).then(data => {
      if (data == 1) {
        Alert.alert("Alert",
          "Delete Success",
          [
            {
              text: "Ok",
              onPress: () => {
                setRefreshPage(Math.random() * 100);

              },
            },
          ],
          { cancelable: false })
      }
    })
    var newData = data;
    newData.splice(id, 1);
    var newData = full;
    newData.splice(id, 1);

  }

  const del = (data, index) => (
    <TouchableOpacity onPress={() => Alert.alert(
      "Alert Title",
      "Delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteR(index) }
      ]
    )}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>del</Text>
      </View>

    </TouchableOpacity>
  );

  return (

    // {data.length === 0 ? 
    // <View>
    //   <Text>
    //     There is no reservation
    //   </Text>
    // </View>
    // :
    <View style={styless.Tablee}>
      <Text style={styless.TableTitle}>
        {'Reservation History'}
      </Text>
      <Table borderStyle={{ borderColor: 'transparent' }}>
        <Row data={head} style={styles.head} textStyle={styles.text} />
        {
          data.map((rowData, index) => (
            <TableWrapper key={index} style={{ ...styles.row, backgroundColor: index % 2 == 1 ? "#f1f8ff" : "white" }}>
              {
                rowData.map((cellData, cellIndex) => (
                  <Cell key={cellIndex} data={cellIndex === 4 ? del(data, index) : cellData} textStyle={styles.text} />
                ))
              }
            </TableWrapper>
          ))
        }
      </Table>

    </View>




  )
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 50, backgroundColor: '#f1f8ff', width: '100%' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1', width: '100%' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
});

const styless = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  Tablee: {
    marginHorizontal: 10
  },
  TableTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center'
  },
  icon: {
    padding: 20,
  },
  switchbar: {
    marginTop: 40,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchtext: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 32,
  },
  head: {
    height: 60,
    backgroundColor: '#f1f8ff',
  },
  texttable: {
    textAlign: 'center',
    fontSize: 20
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 15,
  },

  text2: {
    marginLeft: 5,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 15,
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#694BBE",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50
  },
  tableRow: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: 'center'
  },
  columnHeader: {
    width: "20%",
    alignItems: "center"
  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "bold",
  },
  columnRowTxt: {
    width: "20%",
    textAlign: "center",
    justifyContent: "center"
    //marginRight : 15
  },
});