import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, TouchableWithoutFeedback, Pressable, ScrollView, TouchableHighlight } from 'react-native';
import { Octicons, MaterialIcons  } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as api from '../api/api';
import * as Crypto from 'expo-crypto';
import { ConfirmPasswordTextInput, EmailTextInput, NameTextInput, PasswordTextInput } from './InputCollection';


const DismissKeyboard = ({children}) =>{
  <TouchableWithoutFeedback
  onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>
}



export const Registration =({navigation})=>{
    const [count, setCount] = useState(0);
    const [fullName, onChangeFullName] = useState("");
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [confirmPassword, onChangeConfirmPassword] = useState("");

    const [confirm, onChangeConfirm] = useState("");

    const [fullNameColor, onChangeFullNameColor] = useState("rgba(0,0,0,1)");
    const [emailColor, onChangeEmailColor] = useState("rgba(0,0,0,1)");
    const [passwordColor, onChangePasswordColor] = useState('rgba(0,0,0,1)');
    const [confirmPasswordColor, onChangeConfirmPasswordColor] = useState("rgba(0,0,0,1)");

    const [fullNameConfirm, changeFullNameConfirm] = useState(false);
    const [emailConfirm, changeEmailConfirm] = useState(false);
    const [passwordConfirm, changePasswordConfirm] = useState(false);
    const [CpasswordConfirm, changeCPasswordConfirm] = useState(false);
    

    const [showAlert, changeShowAlert] = useState(false);
    const [alertTitle, changeAlertTitle] = useState();
    const [alertDesc, changeAlertDesc] = useState();

    const [showComplete, changeShowComplete] = useState(false);
    const [completeTitle, changeCompleteTitle] = useState();
    const [completeDesc, changeCompleteDesc] = useState();

    const [showConfirm, changeShowConfirm] = useState(false);
    const [confirmTitle, changeConfirmTitle] = useState();
    const [confirmDesc, changeConfirmDesc] = useState();

    const [nameToolTipVisible, setNameToolTipVisible] = useState(false);
    const [emailToolTipVisible, setEmailToolTipVisible] = useState(false);
    const [pwdToolTipVisible, setPwdToolTipVisible] = useState(false);
    const [cPwdPasswordToolTipVisible, setCPwdPasswordToolTipVisible] = useState(false);

    const [nameToolTipColor, setNameToolTipColor] = useState(false);
    const [emailToolTipColor, setEmailToolTipColor] = useState(false);
    const [pwdToolTipColor, setPwdToolTipColor] = useState(false);
    const [cPwdPasswordToolTipColor, setCPwdPasswordToolTipColor] = useState(false);

    
    function finalValidation(){
      if(fullNameConfirm == false){
        changeAlertTitle("Invalid Name")
        changeAlertDesc("Full Name cannot be left blank")
        openAlert();

      } else if (emailConfirm == false){
        changeAlertTitle("Invalid Email")
        changeAlertDesc("Please Enter a valid Email")
        openAlert();

      } else if (passwordConfirm == false){
        changeAlertTitle("Invalid Password")
        changeAlertDesc("Please Enter a valid Password")
        openAlert();

      } else if (CpasswordConfirm == false){
        changeAlertTitle("Invalid Password")
        changeAlertDesc("Confirm Password cannot be blank")
        openAlert();

      } else{
        if(password != confirmPassword){
          changeAlertTitle("Password Incorrect")
          changeAlertDesc("Confirm Password must be identical to Password")
          openAlert();
  
        } else{
          changeConfirmTitle("Confirm Registration Details")
          changeConfirmDesc(`
          Full Name: ${fullName}\n
          Email: ${email}
          `)
          openConfirm()

        }  
      }
      
    }

    

    function openAlert() {
      changeShowAlert(true);
    };
   
    function hideAlert() {
      changeShowAlert(false);
    };

    function openComplete() {
      changeShowComplete(true);
    };
   
    function hideComplete() {
      changeShowComplete(false);
    };

    function openConfirm() {
      changeShowConfirm(true);
    };
   
    function hideConfirm() {
      changeShowConfirm(false);
    };
     
    function executeRegistration() {
      hideConfirm();
      api.hash(password).then(digest => {
        api.executeRegistration(fullName, email.toLowerCase(), digest,).then(data => {
          if(data == true){
            changeCompleteTitle("Registration Successful")
            changeConfirmDesc("You have successfuly registered your new account")
            openComplete()
          } else{
            changeAlertTitle("Invalid Registration")
            changeAlertDesc("Please recheck Register details")
            openAlert();
          }
        })
      })
      
    }

    

    return (
      
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.screen}>
            <StatusBar style='dark'/>

            <View style={{position: 'absolute', backgroundColor: '#694BBE', height: 700, width: 700, top: '85%', borderRadius:600}}/>

            <Text
            style={styles.title}
            >
            Member Registration
            </Text>
            <AwesomeAlert  //Warning alert
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
              hideAlert();
            }}
            />

            <AwesomeAlert    //Registration Complete Alert
            show={showComplete}
            showProgress={false}
            title={completeTitle}
            message={completeDesc}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="Close"
            confirmButtonColor="green"
            onConfirmPressed={() => {
              navigation.navigate('Login');
            }}
            />
            
            <AwesomeAlert    //Registration Confirmation
            show={showConfirm}
            showProgress={false}
            title={confirmTitle}
            message={confirmDesc}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Confirm"
            confirmButtonColor="green"
            onConfirmPressed={() => {
              executeRegistration();
            }}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="red"
            onCancelPressed={() => {
              hideConfirm();
            }}
            />
            

            <NameTextInput nameInput={onChangeFullName} changeFullNameConfirm={changeFullNameConfirm}/>

            <EmailTextInput textInput={onChangeEmail} changeShowEmailConfirm={changeEmailConfirm}/>

            <PasswordTextInput passwordInput={onChangePassword} changeShowPasswordConfirm={changePasswordConfirm}/>
            
            <ConfirmPasswordTextInput password={password} ConfirmPasswordInput={onChangeConfirmPassword} changeCPasswordConfirm={changeCPasswordConfirm}/>
            <Pressable
            style={styles.button}
            android_ripple={{color: 'white', borderless: false}}
            onPressIn={Keyboard.dismiss}
            onPressOut={finalValidation}
            >
              <Text style={styles.loginText}>Register</Text> 
            </Pressable>
            
            <View style={styles.bottomArea}>
              <Text>Already have an account? </Text>
              <TouchableOpacity 
              style={styles.bottomButton}
              onPress={() => navigation.push('Login')}
              >
                <Text style={styles.bottomText}>Login Now!</Text>
              </TouchableOpacity>
            </View>

          </View>

        </TouchableWithoutFeedback>
        
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,1)',
    },
  screen:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    height: '100%',
    width: '100%',
  },
  background: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      resizeMode: "stretch",
      height: '100%',
      width: '100%'
    },
    bottomArea: {
      flexDirection: "row",
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '5%'
      
    },
    logo: {
      position: 'relative',
      bottom: "5%",
      width: '80%',
      resizeMode: 'contain',
    },
    loginScreen: {
      flex: 1,
      marginTop: "10%",
      marginBottom: "20%",
      width: "90%",
      borderRadius: 20,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginError: {
      position: 'absolute',
      top: 0,
      height: '9%',
      width: '100%',
      backgroundColor: 'red',
      
      
    },
    errorText: {
      textAlign: 'center',
      paddingTop: '10%',
      color: 'white',
      fontFamily: 'sans-serif-medium',
      fontWeight: 'bold',
    },
    title: {
      position: 'absolute',
      height: '90%',
      fontFamily: 'sans-serif-medium',
      color: '#694BBE',
      fontSize: 38,
      fontWeight: 'bold',
      textAlign: 'left',
      paddingLeft: '9%',
      padding: 10,
    },
    button: {
      alignItems: "center",
      padding: 10,
      backgroundColor: "#694BBE",
      width: '80%',
      marginTop: '1%',
      marginBottom: '5%',
      borderRadius: 30,
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
    textShowPassword:{
      color: "#694BBE",
      textAlign: "right",
    },
    bottomButton:{
      backgroundColor: "transparent",
    },
    bottomText:{
      color: "#694BBE",
      fontFamily: 'sans-serif-medium',
      textAlign: "center",
    },
    inputPassword: {
      height: 40,
      width: '90%',
      marginBottom: '5%',
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
  
    },
});