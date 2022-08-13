import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { 
  SafeAreaView, 
  TextInput, 
  StatusBar, 
  StyleSheet, 
  Keyboard, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Alert,
  View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as api from '../api/api';


const Homepage = () => {
  const [vrn, setVrn] = useState("");
  const [sdate, setsDate] = useState(new Date());
  const [stime, setsTime] = useState("");
  const [edate, seteDate] = useState(new Date());
  const [etime, seteTime] = useState("");
  const [showsDate, setShowsDate] = useState("Select Robot Reservation Date");
  const [showsTime, setShowsTime] = useState("Select Start Time");
  const [showeDate, setShoweDate] = useState("");
  const [showeTime, setShoweTime] = useState("Select End Time");
  const [start, setstart] = useState(false);
  const [end, setend] = useState(false);

  const validate = () => {
    const car = /^[A-Za-z]{3}[\d]{4}[A-Za-z]{1}$/;
    seteDate(edate);
    console.log(vrn);
    console.log(stime);
    console.log(etime);
    console.log(sdate.toISOString().split("T")[0]);
    if (vrn === "" ||stime === '' || etime === ''|| sdate === '') {
      console.log(vrn);
      console.log(stime);
      console.log(etime);
      console.log(sdate);
      Alert.alert("Please enter all field");
    } else if (!car.test(vrn)) {
      Alert.alert("Please enter correct VRN");
    } else if (etime <= stime) {
      Alert.alert("Please enter valid timing");
    } else {
      Alert.alert(
        "Charging Robot Booking",
        "Are you sure you to reserve the robot at "+ stime +" ?",
        [
            {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Yes", onPress: () => api.createRobotReservation(vrn, sdate.toISOString().split("T")[0], stime, etime) }
        ]
    );
    }
  }
  


  

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onsChange = (event, selectedDate) => {
    const currentDate = selectedDate || sdate;
    setShow(false);
    setsDate(currentDate);
    seteDate(currentDate);
    setShowsDate(currentDate.toDateString());
    setShoweDate(currentDate.toDateString());
    if (start) {
      setsTime(currentDate.toLocaleTimeString().substring(0, 5));
      setShowsTime(currentDate.toLocaleTimeString().substring(0, 5));
      setstart(false);
    } else if (end) {
      seteTime(currentDate.toLocaleTimeString().substring(0, 5));
      setShoweTime(currentDate.toLocaleTimeString().substring(0, 5));
      setend(false);
    }

  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  


  useEffect(() => {
    if (vrn.length == 8) {
      const car = /^[A-Za-z]{3}[\d]{4}[A-Za-z]{1}$/;
      if (!car.test(vrn)) {
        alert("Please enter correct VRN");
      } else {
        console.log('can!!');
        //setdisable(true);
      }
    }
  }, [vrn])


  const [VRNValidate, onChangeVRNValidate] = useState(true);
  const [editable, onChangeEditable] = useState(true);
  
  function Validate() {
    //regex for VRN
    const regex = /^[a-zA-Z]+$/
    if (regex.test(vrn)) {
        onChangeVRNValidate(true);
    }
    else {
        onChangeVRNValidate(false);
    }
  }
  const onChangeVRN = vrn => {
    setVrn(vrn)
    console.log('vrn: '+ vrn)
    
};
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.Welcome}>
        {`Guest Charging Robot Booking\n`}
      </Text>
      <Text style={styles.vrn}>
        Vehicle Registration Number: 
      </Text>
      <TextInput style={[styles.Input, !VRNValidate ? styles.Error : null]}
                onChangeText={onChangeVRN}
                onBlur={Validate}
                value={vrn.toString()}
                editable={editable}>
      </TextInput>
      
      <TouchableOpacity style={styles.Date} onPress={showDatepicker}>
        <Text style={{ width: '100%', height: '100%', color: 'black' }}>
          {showsDate}
        </Text>
      </TouchableOpacity>

      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.time_input} onPress={showTimepicker} onPressOut={() => setstart(true)}>
          <Text style={{ width: '100%', height: '100%', color: 'black' }}>
            {showsTime}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.time_input} onPress={showTimepicker} onPressOut={() => setend(true)}>
          <Text style={{ width: '100%', height: '100%', color: 'black' }}>
            {showeTime}
          </Text>
        </TouchableOpacity>

        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={sdate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onsChange}
          minimumDate={new Date()}

        />
      )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={validate
        }
      >
        <Text style={styles.btntext}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    margin: 20
  },
  Welcome: {
    fontSize: 24,
    margin: 40
  },
  vrn: {
    fontSize: 18,
    marginLeft: 40
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 300,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  Input: {
    marginBottom: 20,
    marginLeft: 40,
    borderBottomWidth: 3,
    fontSize: 18,
    width: 250,
  },
  button: {
    width: 100,
    alignItems: "center",
    padding: 20,
    backgroundColor: "lightblue",
    marginTop: 30,
    width: "100%"
  },
  name: {
    fontSize: 18,
    bottom: '25%',
    marginBottom: '-5%',
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium'
  },
  notif: {
    maxHeight: "24%",
    width: "100%"
  },
  desc: {
    width: '100%',
    fontFamily: 'sans-serif-medium',
    height: '100%',
  },
  Date: {
    height: 40,
    margin: 20,
    width: "90%",
    marginBottom: "10%",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  time_input: {
    height: 40,
    width: "40%",
    marginBottom: "10%",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    margin: 20
  },
  rowContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Homepage;