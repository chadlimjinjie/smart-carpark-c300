import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableOpacityBase,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CheckBox from "@react-native-community/checkbox";
import { useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RNPickerSelect from "react-native-picker-select";
import * as SecureStore from 'expo-secure-store';
import * as api from "../api/api"
import { CreateTextInput } from './InputCollection';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DismissKeyboard = ({ children }) => {
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>
}


export default function Reservation({ navigation }) {


  const [a, setA] = useState("true");
  const [vip, setVip] = useState("");
  const [evc, setEvc] = useState(false);
  const [calCheckSum, setcalCheckSum] = useState(true);
  const [name, setName] = useState();
  const [email, setEmail] = useState("");
  const [vrn, setVrn] = useState("");
  const [sdate, setsDate] = useState(new Date());
  const [stime, setsTime] = useState("");
  const [edate, seteDate] = useState(new Date());
  const [etime, seteTime] = useState("");
  const [userId, setUserId] = useState(0);
  const [guestId, setGuestId] = useState(0);
  const [showsDate, setShowsDate] = useState("Select Reservation Date");
  const [showsTime, setShowsTime] = useState("Select Start Time");
  const [showeDate, setShoweDate] = useState("");
  const [showeTime, setShoweTime] = useState("Select End Time");
  const [start, setstart] = useState(false);
  const [end, setend] = useState(false);
  const [disable, setdisable] = useState(false);
  const [data, setData] = useState([]);
  const [role, setRole] = useState([]);
  const [toolTipVrn, setToolTipVrn] = useState(false);
  const [toolTipName, setToolTipName] = useState(false);
  const [toolTipEmail, setToolTipEmail] = useState(false);
  const [toolTipDate, setToolTipDate] = useState(false);
  const [toolTipStime, setToolTipStime] = useState(false);
  const [toolTipEtime, setToolTipEtime] = useState(false);
  const [toolTipVip, setToolTipVip] = useState(false);
  const [toolTipEvc, setToolTipEvc] = useState(false);
  const [display, setDisplay] = useState(1);

  const [checksum, setChecksum] = useState("AZYXUTSRPMLKJHGEDCB");

  const [item, setItem] = useState(1);

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


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('reset')
      if (value !== null) {
        if (value == a) {
          emptyInput();
        }
      }
    } catch (e) {
      console.log("Value wrong")
    }
  }


  const validate = () => {
    const reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (name === "" || email === "" || vrn === "" || typeof stime === 'undefined' || typeof etime === 'undefined' || stime === '' || etime === '') {
      alert("Please enter all field");
    } else if (!reg.test(email)) {
      alert("Please enter correct email");
    } else if (etime < stime) {
      alert("Please enter valid end time");
    } else {
      navigate();
    }
  }

  const validateEmail = () => {
    const reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (!reg.test(email)) {
      alert("Please enter correct email");
    }
  }

  const navigate = async () => {
    var split = name.split(" ");
    var newName = "";
    for (var i = 0; i < split.length; i++) {
      newName += split[i].charAt(0).toUpperCase() + split[i].slice(1) + " "
    }

    await AsyncStorage.setItem('reset', "true");

    navigation.navigate("Confirmation", {
      name: newName,
      email: email,
      vrn: vrn.toUpperCase(),
      sdate: sdate.toISOString().split("T")[0],
      stime: stime,
      edate: edate.toISOString().split("T")[0],
      etime: etime,
      vip: vip,
      evc: evc,
      id: userId,
      guest: guestId,
    })
  }

  function retrieveGuest() {
    api.getGuest(vrn).then(data => {
      setData(data)
    })
  }

  function retrieveRole() {
    var list = [];
    api.getRole().then(data => {
      data.forEach(d => {
        if (d["role_name"] != "") {
          list.push({ label: d["role_name"], value: d["role_id"] })
        }

      });
      setRole(list);
    })

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


  const retrive = () => {
    if (data.length > 0) {
      setName(data[0]["fullname"]);
      setEmail(data[0]["email"])
      setGuestId(data[0]["guest_id"])
    } else {
      setName();
      setEmail("");
      setGuestId(0);
    }


  }

  const setd = () => {
    if (display === 1) {
      setDisplay(2);

    } else {
      setDisplay(1);

    }

  };

  const emptyInput = () => {
    setName();
    setVrn("");
    setEmail("");
    setsDate(new Date());
    setShowsDate("Select Reservation Date");
    setShowsTime("Select Start Time");
    setShoweTime("Select End Time");
    setVip("");
    setEvc(false);
    setsTime("");
    seteTime("");
    setdisable(false);
    setGuestId(0);
    setData([]);
    setDisplay(1);

  }



  const vrnValidate = () => {
    const alpha = /^[A-Za-z]/;

    if (vrn.length >= 3 && alpha.test(vrn.charAt(vrn.length - 1))) {
      const checkVrn = /^[A-za-z]{1,3}\d{1,4}[A-za-z]/;
      const tem = vrn;
      if (!checkVrn.test(vrn)) {
        alert("Invalid VRN");
      } else if (tem.replace(tem.match(/^[A-za-z]{1,3}\d{1,4}[A-za-z]/g), "").length != 0) {
        alert("Invalid VRN");
      } else {
        let letters = vrn.toUpperCase().match(/^[A-Z]{1,3}/g)[0];
        if (letters.length !== 2) {
          letters = letters.length === 3 ? letters.slice(1) : letters;
        }
        let letterValue = letters.split('').map(i => i.charCodeAt() - 64);
        if (letterValue.length !== 2) {
          letterValue.unshift(0);
        };
        let numbers = vrn.match(/[0-9]{1,4}/g)[0];
        while (numbers.length < 4) {
          numbers = '0' + numbers;
        };
        let numberValue = numbers.split('').map(i => parseInt(i));
        const sixDigit = [...letterValue, ...numberValue];
        const fixedNumbers = [9, 4, 5, 4, 3, 2];
        const remainder =
          sixDigit
            .map((i, index) => i * fixedNumbers[index])
            .reduce((a, b) => a + b) % 19;

        if (vrn.charAt(vrn.length - 1).toUpperCase() !== checksum.charAt(remainder)) {
          alert("Please enter valid vrn")
          setdisable(false);


        } else {
          retrieveGuest();
          setdisable(true);
        }

      }

    } else {
      alert("Invalid VRN");
      setdisable(false);
      setName("");
      setEmail("");

    }
  }



  useEffect(() => {
    if (vrn.length > 8) {
      alert("Invalid VRN");
    } else if (vrn.length != 0) {
      setdisable(true);
      const alpha = /^[A-Za-z]/;
      if (vrn.length >= 3 && alpha.test(vrn.charAt(vrn.length - 1)) && vrn.match(/[0-9]{1,4}/g) != null) {
        if (calCheckSum) {
          vrnValidate();
        }

      } else if (!alpha.test(vrn.charAt(vrn.length - 1))) {
        setdisable(false);
        setName("");
        setEmail("");
      }
    }

  }, [vrn])


  useFocusEffect(
    React.useCallback(() => {
      getValueFor('user_id');
      retrieveRole();
      getData();

      return async () => {
        AsyncStorage.setItem('reset', "true");
      }

    }, [])
  );




  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>


        <Text style={{
          width: '70%', height: 50, fontWeight: 'bold', color: '#694BBE', fontFamily: 'sans-serif-medium',
          borderRadius: 10, alignSelf: 'center', textAlign: 'center', fontSize: 36, position: 'absolute',
          top: 0, marginTop: '3%', backgroundColor: 'white'
        }}>Reservation</Text>



        {display === 1 ?
          <View style={{
            backgroundColor: 'white', width: '95%', alignSelf: 'center', height: '80%', top: '5%',
            borderRadius: 10, shadowOffset: { width: 0, height: 4, }, shadowColor: 'black', shadowOpacity: 1, elevation: 5,
          }}>
            <Text style={{ textAlign: 'center', marginTop: '10%', fontSize: 24, fontWeight: 'bold', marginBottom: '5%', color: '#694BBE' }}>Guest Information</Text>

            {/*<Text style={{ alignSelf: "center", fontWeight: "bold" }}>Guest Information</Text>*/}


            {/* <CreateTextInput 
      value={vrn}
      nameOfInput={"Vehicle Registration Number"}
      iconType={"directions-car"}
      toolTipText={"Please enter VRN"}
      inputFunction={setVrn}
      confirmInput={setVrnConfirm}
      validationFunction={fakeValidate}
      editable={true}
      /> */}

            <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                <MaterialIcons name={"directions-car"} size={20} color="black" />
                <Text style={styles.inputText}> Vehicle Registration Number</Text>
                <View style={{ marginLeft: '2%' }}>
                  <Tooltip
                    arrowSize={{ width: 15, height: 8 }}
                    backgroundColor="rgba(0,0,0, 0.5)"
                    isVisible={toolTipVrn}
                    content={<Text>Please enter VRN {'\n'} The checkbox toggle the checksum calculation of VRN</Text>}
                    placement="top"
                    topAdjustment={-25.5}
                    onClose={() => setToolTipVrn(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setToolTipVrn(true)}>
                        <MaterialIcons name="info-outline" size={18} color={toolTipVrn ? 'white' : 'red'} />
                      </TouchableOpacity>
                    </View>

                  </Tooltip>
                </View>
                <CheckBox
                  style={{ position: 'relative', left: 20, bottom: 1 }}
                  disabled={false}
                  tintColors={{ true: '#694BBE', false: 'grey' }}
                  value={calCheckSum}
                  onValueChange={(newValue) => setcalCheckSum(newValue)} ></CheckBox>
              </View>
              <TextInput
                style={[styles.inputPassword]}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={setVrn}
                onBlur={retrive}
                value={vrn} />
            </View>

            {/* 
            <CheckBox
                  disabled={false}
                  value={calCheckSum}
                  onValueChange={(newValue) => setcalCheckSum(newValue)} ></CheckBox>
            */}



            <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                <MaterialIcons name={"person"} size={20} color="black" />
                <Text style={styles.inputText}> Name</Text>
                <View style={{ marginLeft: '2%' }}>
                  <Tooltip
                    arrowSize={{ width: 15, height: 8 }}
                    backgroundColor="rgba(0,0,0, 0.5)"
                    isVisible={toolTipName}
                    content={<Text>Please enter your name</Text>}
                    placement="top"
                    topAdjustment={-25.5}
                    onClose={() => setToolTipName(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setToolTipName(true)}>
                        <MaterialIcons name="info-outline" size={18} color={toolTipName ? 'white' : 'red'} />
                      </TouchableOpacity>
                    </View>

                  </Tooltip>
                </View>
              </View>
              <TextInput
                style={styles.inputPassword}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={setName}
                value={name}
                editable={disable} />
            </View>

            <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                <MaterialIcons name={"mail"} size={20} color="black" />
                <Text style={styles.inputText}> Email</Text>
                <View style={{ marginLeft: '2%' }}>
                  <Tooltip
                    arrowSize={{ width: 15, height: 8 }}
                    backgroundColor="rgba(0,0,0, 0.5)"
                    isVisible={toolTipEmail}
                    content={<Text>Please enter email</Text>}
                    placement="top"
                    topAdjustment={-25.5}
                    onClose={() => setToolTipEmail(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setToolTipEmail(true)}>
                        <MaterialIcons name="info-outline" size={18} color={toolTipEmail ? 'white' : 'red'} />
                      </TouchableOpacity>
                    </View>

                  </Tooltip>
                </View>
              </View>
              <TextInput
                style={styles.inputPassword}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={setEmail}
                onBlur={validateEmail}
                value={email}
                editable={disable} />
            </View>

            <TouchableOpacity style={{
              width: 130, height: 50, backgroundColor: '#694BBE',
              position: 'relative', alignSelf: 'flex-end', marginRight: 10, top: '10%',
              borderRadius: 10, justifyContent: 'center', alignItems: 'center'
            }}
              onPress={setd}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ alignContent: 'center', color: 'white', fontSize: 26, bottom: 1, fontWeight: 'bold' }}>Next</Text>
                <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
              </View>

            </TouchableOpacity>
            {/*
            <TouchableOpacity style={{ backgroundColor: "skyblue", position: "absolute", right: 0, bottom: 0, marginTop: 20, marginRight: 30, borderRadius: 30, width: 40, alignItems: "center" }} onPress={setd}>
              <Text>Next</Text>
            </TouchableOpacity>
          */}
          </View>


          :
          <View style={{
            backgroundColor: 'white', width: '95%', alignSelf: 'center', height: '80%', top: '5%',
            borderRadius: 10,
            shadowOffset: { width: 0, height: 4, }, shadowColor: 'black', shadowOpacity: 1, elevation: 5,
          }}>
            {/*<Text style={{ alignSelf: "center", fontWeight: "bold" }}>Reservation Timing</Text>*/}
            <Text style={{ textAlign: 'center', marginTop: '10%', fontSize: 24, fontWeight: 'bold', marginBottom: '5%', color: '#694BBE' }}>Reservation Information</Text>

            <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                <MaterialIcons name='calendar-today' size={20} color="black" />
                <Text style={styles.inputText}> Reservation Date</Text>
                <View style={{ marginLeft: '2%' }}>
                  <Tooltip
                    arrowSize={{ width: 15, height: 8 }}
                    backgroundColor="rgba(0,0,0, 0.5)"
                    isVisible={toolTipDate}
                    content={<Text>Enter Reservation Date</Text>}
                    placement="top"
                    topAdjustment={-25.5}
                    onClose={() => setToolTipDate(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setToolTipDate(true)}>
                        <MaterialIcons name="info-outline" size={18} color={toolTipDate ? 'white' : 'red'} />
                      </TouchableOpacity>
                    </View>
                  </Tooltip>
                </View>
              </View>
              <TouchableOpacity style={styles.inputPassword}
                onPress={showDatepicker}>
                <Text style={{ width: '100%', height: '100%', color: 'black', top: 15 }}>
                  {showsDate == 'Select Reservation Date' ? "" : showsDate}
                </Text>
              </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: '3%' }}>
              <View style={{ flexDirection: 'column', width: '45%', alignSelf: 'center', marginLeft: '7%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                  <MaterialIcons name='access-time' size={20} color="black" />
                  <Text style={styles.inputText}> Start Time</Text>
                  <View style={{ marginLeft: '2%' }}>
                    <Tooltip
                      arrowSize={{ width: 15, height: 8 }}
                      backgroundColor="rgba(0,0,0, 0.5)"
                      isVisible={toolTipStime}
                      content={<Text>Enter start time of Reservation</Text>}
                      placement="top"
                      topAdjustment={-25.5}
                      onClose={() => setToolTipStime(false)}
                    >
                      <View>
                        <TouchableOpacity onPress={() => setToolTipStime(true)}>
                          <MaterialIcons name="info-outline" size={18} color={toolTipStime ? 'white' : 'red'} />
                        </TouchableOpacity>
                      </View>
                    </Tooltip>
                  </View>
                </View>
                <TouchableOpacity style={styles.inputPassword}
                  onPress={showTimepicker} onPressOut={() => setstart(true)}>
                  <Text style={{ width: '100%', height: '100%', color: 'black', top: 15 }}>
                    {showsTime == "Select Start Time" ? "" : showsTime}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'column', width: '45%', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                  <MaterialIcons name='access-time' size={20} color="black" />
                  <Text style={styles.inputText}> End Time</Text>
                  <View style={{ marginLeft: '2%' }}>
                    <Tooltip
                      arrowSize={{ width: 15, height: 8 }}
                      backgroundColor="rgba(0,0,0, 0.5)"
                      isVisible={toolTipEtime}
                      content={<Text>Enter end time of Reservation</Text>}
                      placement="top"
                      topAdjustment={-25.5}
                      onClose={() => setToolTipEtime(false)}
                    >
                      <View>
                        <TouchableOpacity onPress={() => setToolTipEtime(true)}>
                          <MaterialIcons name="info-outline" size={18} color={toolTipEtime ? 'white' : 'red'} />
                        </TouchableOpacity>
                      </View>
                    </Tooltip>
                  </View>
                </View>
                <TouchableOpacity style={styles.inputPassword}
                  onPress={showTimepicker} onPressOut={() => setend(true)}>
                  <Text style={{ width: '100%', height: '100%', color: 'black', top: 15 }}>
                    {showeTime == "Select End Time" ? "" : showeTime}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                <MaterialIcons name='person' size={18} color="black" />
                <Text style={styles.inputText}> VIP</Text>
                <View style={{ marginLeft: '2%' }}>
                  <Tooltip
                    arrowSize={{ width: 30, height: 8 }}
                    backgroundColor="rgba(0,0,0, 0.5)"
                    isVisible={toolTipVip}
                    content={<Text>Please select the VIP type,Normal Guest as default type</Text>}
                    placement="top"
                    topAdjustment={-25.5}
                    onClose={() => setToolTipVip(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setToolTipVip(true)}>
                        <MaterialIcons name="info-outline" size={18} color={toolTipVip ? 'white' : 'red'} />
                      </TouchableOpacity>
                    </View>
                  </Tooltip>
                </View>
              </View>
              <View style={{ borderWidth: 1, marginRight: 25, paddingBottom: 10, marginTop: 10, borderRadius: 15 }}>
                <RNPickerSelect
                  style={customPickerStyles}
                  value={vip}
                  onValueChange={(vip) => setVip(vip)}
                  placeholder={{ label: "Chose VIP type", value: "Testing" }}
                  items={role}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', marginTop: '5%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
                <MaterialIcons name='battery-charging-full' size={18} color="black" />
                <View style={{ marginRight: 5 }}>
                  <Tooltip
                    arrowSize={{ width: 15, height: 8 }}
                    backgroundColor="rgba(0,0,0, 0.5)"
                    isVisible={toolTipEvc}
                    content={<Text>Select the electric robot to charge electric cars</Text>}
                    placement="top"
                    topAdjustment={-25.5}
                    onClose={() => setToolTipEvc(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setToolTipEvc(true)}>
                        <MaterialIcons name="info-outline" size={18} color={toolTipEvc ? 'white' : 'red'} />
                      </TouchableOpacity>
                    </View>
                  </Tooltip>
                </View>
                <Text style={styles.inputText}>Robot Charge</Text>
                <CheckBox
                  disabled={false}
                  value={evc}
                  tintColors={{ true: '#694BBE', false: 'grey' }}
                  onValueChange={(newValue) => setEvc(newValue)} ></CheckBox>

              </View>
            </View>

            {/* <View style={{ flexDirection: "row", width: "100%", paddingTop: 10, marginLeft: '15%' }}>
        <CheckBox
          disabled={false}
          value={evc}
          onValueChange={(newValue) => setEvc(newValue)} ></CheckBox>
        <Text style={{ paddingTop: 5 }}>Robot Charge</Text>
      </View> */}

            <View style={{ flexDirection: 'row', width: '100%', marginTop: '10%' }}>
              <TouchableOpacity style={{
                width: 130, height: 50, backgroundColor: '#694BBE',
                position: 'relative', alignSelf: 'flex-start', marginLeft: 10, left: 0,
                borderRadius: 10, justifyContent: 'center', alignItems: 'center'
              }}
                onPress={setd}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                  <Text style={{ alignContent: 'center', color: 'white', fontSize: 26, bottom: 1, right: 7, fontWeight: 'bold' }}>Back</Text>
                </View>

              </TouchableOpacity>

              <TouchableOpacity style={{
                width: 130, height: 50, backgroundColor: '#694BBE',
                position: 'absolute', alignSelf: 'flex-end', marginRight: 10, right: 0,
                borderRadius: 10, justifyContent: 'center', alignItems: 'center'
              }}
                onPress={validate}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ alignContent: 'center', color: 'white', fontSize: 26, bottom: 1, fontWeight: 'bold' }}>Submit</Text>
                  <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
                </View>

              </TouchableOpacity>
            </View>

          </View>
        }

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
        <View style={{ flexDirection: 'row', alignSelf: 'center', position: 'absolute', top: 0, marginTop: '20%' }}>
          <TouchableOpacity
            style={display === 1 ? styles.roundButtonSelect : styles.roundButton}
          >
            <Text style={{ fontSize: 24, fontFamily: 'sans-serif-medium', fontWeight: 'bold', color: '#694BBE' }}>1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={display === 2 ? styles.roundButtonSelect : styles.roundButton}
          >
            <Text style={{ fontSize: 24, fontFamily: 'sans-serif-medium', fontWeight: 'bold', color: '#694BBE' }}>2</Text>
          </TouchableOpacity>
        </View>
        {/*}
      <TouchableOpacity
        style={styles.button}
        onPress={validate
        }
      >
        <Text style={styles.btntext}>Submit</Text>
      </TouchableOpacity>
      */}
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#694BBE",
    // alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  header: {
    fontSize: 24,
    color: "blue",
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: "blue",
    borderBottomLeftRadius: 1,
  },
  TextInput: {
    padding: 20,
    fontSize: 20,
    //borderBottomColor: "black",
  },
  button: {
    width: 100,
    alignItems: "center",
    padding: 20,
    backgroundColor: "lightblue",
    marginTop: 30,
    width: "100%"
  },
  input: {
    height: 40,
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
    marginLeft: 20,
    marginRight: 20
  },
  rowContainer: {
    //flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  roundButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 5,
  },
  roundButtonSelect: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#694BBE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 5,
  },
  inputPassword: {
    height: 40,
    width: '90%',
    marginBottom: '10%',
    backgroundColor: '#ffffff',
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  inputText: {
    fontSize: 16, fontFamily: 'sans-serif-medium',
  },
});
const customPickerStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginTop: 5,
    paddingVertical: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});