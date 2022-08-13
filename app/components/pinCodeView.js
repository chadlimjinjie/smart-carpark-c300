import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, Alert, TouchableWithoutFeedback, Animated, Pressable  } from 'react-native';
import { Octicons, MaterialIcons, Ionicons, Entypo   } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Tooltip from 'react-native-walkthrough-tooltip';
import * as api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Modal from 'react-native-modal'
import { render } from 'react-dom';
import CountDown from 'react-native-countdown-component';
import * as Haptics from 'expo-haptics';
import { useWindowDimensions } from 'react-native';

const DismissKeyboard = ({children}) =>{
  <TouchableWithoutFeedback
  onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>
}



export function PinCodeView({navigation, modal, nextLocation, email}) {
    const [onStart, setOnStart] = useState(true);
    const [pinId, setPinId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [showAlert, changeShowAlert] = useState(false);
    const [alertTitle, changeAlertTitle] = useState();
    const [alertDesc, changeAlertDesc] = useState();

    const [timeOut, setTimeOut] = useState(false);
    
    
    const [pin1, setPin1] = useState("")
    const [pin2, setPin2] = useState("")
    const [pin3, setPin3] = useState("")
    const [pin4, setPin4] = useState("")
    const [pin5, setPin5] = useState("")
    const [pin6, setPin6] = useState("")

    const [pin1Color, setPin1Color] = useState("black")
    const [pin2Color, setPin2Color] = useState("black")
    const [pin3Color, setPin3Color] = useState("black")
    const [pin4Color, setPin4Color] = useState("black")
    const [pin5Color, setPin5Color] = useState("black")
    const [pin6Color, setPin6Color] = useState("black")

    const [attempts, setAttempts] = useState(0);
    const [usedAttempts, setUsedAttempts] = useState(false);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;



    function pinExecute(){
        console.log('Activated')
        var combined = parseInt(pin1+pin2+pin3+pin4+pin5+pin6, 10);
        api.sendPin(pinId, combined).then(data =>{
          if(data){
            api.clearPin(pinId);
            modal(false);
            console.log('Holy crap ya did it')
            navigation.navigate(nextLocation)
          } else{
            setAttempts(attempts + 1);
            console.log(data);
            changeAlertTitle("Invalid Pin")
            changeAlertDesc("Please check your pin again")
            changeShowAlert(true);
            console.log('Back to the drawing board I guess')
          }
      })
    
    }

    function timeOutExecute(){
        setTimeOut(false);
        closeAuthentication();
    }
    function attemptsOut(){
        changeShowAlert(false);
        if(attempts >= 5){
            setUsedAttempts(true);
        }
        
    }

    function pinStart(){
      //console.log("Width: " + windowWidth)
      //console.log("Height: " + windowHeight)
      console.log(email);
      api.startPin(email).then(data =>{
        setPinId(data.id)
        console.log(data.id)
      })
    }
    
    function closeAuthentication(){
      api.clearPin(pinId);
      modal(false)
    };

    function handleInput(number){
        
        if(pin1 == ""){
            setPin1(number)
            setPin1Color("rgba(0,200,0,1)")
            return;
        }if(pin2 == ""){
            setPin2(number)
            setPin2Color("rgba(0,200,0,1)")
            return;
        }
        if(pin3 == ""){
            setPin3(number)
            setPin3Color("rgba(0,200,0,1)")
            return;
        }
        if(pin4 == ""){
            setPin4(number)
            setPin4Color("rgba(0,200,0,1)")
            return;
        }
        if(pin5 == ""){
            setPin5(number)
            setPin5Color("rgba(0,200,0,1)")
            return;
        }
        if(pin6 == ""){
            setPin6(number)
            setPin6Color("rgba(0,200,0,1)")
            return;
        } 
    };

    function back(){
        if(!pin6 == ""){
            setPin6("");
            setPin6Color("black");
            return;
        }
        if(!pin5 == ""){
            setPin5("");
            setPin5Color("black");
            return;
        }
        if(!pin4 == ""){
            setPin4("");
            setPin4Color("black");
            return;
        }
        if(!pin3 == ""){
            setPin3("");
            setPin3Color("black");
            return;
        }
        if(!pin2 == ""){
            setPin2("");
            setPin2Color("black");
            return;
        }
        if(!pin1 == ""){
            setPin1("");
            setPin1Color("black");
            return;
        }
    }

    function removeAll(){
        console.log('hi')
        setPin1("");
        setPin2("");
        setPin3("");
        setPin4("");
        setPin5("");
        setPin6("");

        setPin1Color("black");
        setPin2Color("black");
        setPin3Color("black");
        setPin4Color("black");
        setPin5Color("black");
        setPin6Color("black");
    }
    
    if(onStart){
        pinStart();
        setOnStart(false);
    }
      
    return (
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modelView}>
                <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertDesc}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="Close"
                cancelButtonColor="red"
                onCancelPressed={() => {
                    attemptsOut();
                }}
                />

                <AwesomeAlert
                show={timeOut}
                showProgress={false}
                title={'Timeout'}
                message={`You have exceeded the time given to enter your pin.`}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="Close"
                cancelButtonColor="red"
                onCancelPressed={() => {
                    timeOutExecute();

                }}
                />

                <AwesomeAlert
                show={usedAttempts}
                showProgress={false}
                title={'Out of Attempts'}
                message={`You have exceeded the amount of attempts provided (5 Attempts).\nThis account will be locked for 5 minutes.`}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                cancelText="Close"
                cancelButtonColor="red"
                onCancelPressed={() => {
                    closeAuthentication();

                }}
                />
                <View style={{marginBottom: '5%', flexDirection: 'row', alignContent: 'center'}}>
                    <View style={[attempts >= 1 ? styles.UsedAttempt : styles.freeAttempt]}/>
                    <View style={[attempts >= 2 ? styles.UsedAttempt : styles.freeAttempt]}/>
                    <View style={[attempts >= 3 ? styles.UsedAttempt : styles.freeAttempt]}/>
                    <View style={[attempts >= 4 ? styles.UsedAttempt : styles.freeAttempt]}/>
                    <View style={[attempts >= 5 ? styles.UsedAttemptLast : styles.freeAttemptLast]}/>
                </View>

                <CountDown
                until={300}
                onFinish={() => setTimeOut(true)}
                size={windowHeight < 700 ? 20 : 25}
                timeToShow={['M', 'S']}
                digitStyle={{backgroundColor: '#694BBE'}}
                digitTxtStyle={{color: '#ffffff'}}
                timeLabels={{m: null, s: null}}
                showSeparator
                />
                
                <Text style={windowHeight < 700 ? styles.authenticationTitleSmall : styles.authenticationTitle}>Authentication</Text>
                
                <View style={windowHeight < 700 ? styles.rowViewsSmall : styles.rowViews}>
                    <View style={[windowHeight < 700 ? styles.digitWindowSmall : styles.digitWindow, {borderColor: pin1Color}]}>
                        <Text style={styles.text}>{pin1}</Text>
                    </View>

                    <View style={[styles.digitWindow, {borderColor: pin2Color}]}>
                        <Text style={styles.text}>{pin2}</Text>
                    </View>

                    <View style={[styles.digitWindow, {borderColor: pin3Color}]}>
                        <Text style={styles.text}>{pin3}</Text>
                    </View>

                    <View style={[styles.digitWindow, {borderColor: pin4Color}]}>
                        <Text style={styles.text}>{pin4}</Text>
                    </View>

                    <View style={[styles.digitWindow, {borderColor: pin5Color}]}>
                        <Text style={styles.text}>{pin5}</Text>
                    </View>

                    <View style={[styles.digitWindow, {borderColor: pin6Color}]}>
                        <Text style={styles.text}>{pin6}</Text>
                    </View>

                  </View>

                  <View style={windowHeight < 700 ? styles.rowViewsSmall : styles.rowViews}>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('1')}>
                          <Text style={styles.digits}>1</Text>
                      </Pressable>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('2')}>
                          <Text style={styles.digits}>2</Text>
                      </Pressable>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('3')}>
                          <Text style={styles.digits}>3</Text>
                      </Pressable>

                  </View>

                  <View style={windowHeight < 700 ? styles.rowViewsSmall : styles.rowViews}>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('4')}>
                          <Text style={styles.digits}>4</Text>
                      </Pressable>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('5')}>
                          <Text style={styles.digits}>5</Text>
                      </Pressable>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('6')}>
                          <Text style={styles.digits}>6</Text>
                      </Pressable>

                  </View>

                  <View style={windowHeight < 700 ? styles.rowViewsSmall : styles.rowViews}>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('7')}>
                          <Text style={styles.digits}>7</Text>
                      </Pressable>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('8')}>
                          <Text style={styles.digits}>8</Text>
                      </Pressable>

                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('9')}>
                          <Text style={styles.digits}>9</Text>
                      </Pressable>

                  </View>

                  <View style={windowHeight < 700 ? styles.rowViewsSmall : styles.rowViews}>   
                      <Pressable
                      style={{width: 70, height: 70, marginLeft: 10, marginRight: 10, justifyContent: 'center'}}
                      onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      onPressOut={back}
                      onlongPress={removeAll}
                      >
                          <View style={{flexDirection: 'column', alignItems: 'center'}}>
                              <Ionicons name="backspace-outline" size={50} color="red" />
                          </View>
                      </Pressable>

                      
                      <Pressable style={windowHeight < 700 ? styles.buttonInputSmall : styles.buttonInput} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} onPressOut={() => handleInput('0')}>
                          <Text style={styles.digits}>0</Text>
                      </Pressable>

                      <Pressable style={{width: 70, height: 70, marginLeft: 10, marginRight: 10, justifyContent: 'center'}}
                      onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      onPressOut={pinExecute}
                      >
                          <View style={{flexDirection: 'column', alignItems: 'center'}}>
                              <Ionicons name="ios-send" size={35} color="green" />
                          </View>
                      </Pressable>
                      
                  </View>

                <Pressable style={styles.LoginButton}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPressOut={closeAuthentication}
                >
                    <Text style={styles.loginText}>Close</Text>
                </Pressable>

                </View>
              </TouchableWithoutFeedback>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        backgroundColor: 'rgba(255,255,255, 1)',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '110%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#694BBE',
      },
      modelView: {
        position: 'absolute',
        backgroundColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        height: '100%',
        borderRadius: 20

      },
      authenticationTitle: {
        fontFamily: 'sans-serif-medium',
        color: '#694BBE',
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'left',
        padding: 10,
      },
      authenticationTitleSmall: {
        fontFamily: 'sans-serif-medium',
        color: '#694BBE',
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'left',
      },
      buttonInput:{
        width: 70, 
        height: 70, 
        borderRadius: 35,
        marginLeft: 15, 
        marginRight: 15, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#694BBE',
        shadowOffset:{
            width: 0,
            height: 4,
          },
          shadowColor: 'black',
          shadowOpacity: 1,
          elevation: 10,
      },
      buttonInputSmall:{
        width: 60, 
        height: 60, 
        borderRadius: 30,
        marginLeft: 15, 
        marginRight: 15, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#694BBE',
        shadowOffset:{
            width: 0,
            height: 4,
          },
          shadowColor: 'black',
          shadowOpacity: 1,
          elevation: 10,
      },
      digitWindow:{
        width: 35, height: 40, borderWidth: 1, margin: 5, justifyContent: 'center',borderColor: 'black'
      },
      digitWindowSmall:{
        width: 35, height: 40, borderWidth: 1, margin: 5, justifyContent: 'center',borderColor: 'black'
      },
      digits: {
        color: 'white',
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 35
      },
      text: {
        textAlign: 'center', 
        justifyContent: 'center',
        fontSize: 40
      },
      rowViews: {
        flexDirection: 'row', marginBottom: 15
      },
      rowViewsSmall: {
        flexDirection: 'row', marginBottom: 5
      },
      LoginButton: {
        alignItems: "center",
        padding: 10,
        backgroundColor: "#694BBE",
        width: '80%',
        marginTop: '1%',
        borderRadius: 30,
        marginBottom: '5%',
        shadowOffset:{
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
      freeAttempt: {
        width: 20, height: 20, borderRadius: 10, backgroundColor: 'grey', marginRight: 10
      },
      UsedAttempt: {
        width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginRight: 10
      },
      freeAttemptLast: {
        width: 20, height: 20, borderRadius: 10, backgroundColor: 'grey', marginRight: 10
      },
      UsedAttemptLast: {
        width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginRight: 10
      }
});