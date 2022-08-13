import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, TouchableWithoutFeedback, Pressable, ScrollView, TouchableHighlight } from 'react-native';
import { Octicons, MaterialIcons  } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as api from '../api/api';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';


const DismissKeyboard = ({children}) =>{
  <TouchableWithoutFeedback
  onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>
}



export const ResetPassword =({navigation})=>{
    const [count, setCount] = useState(0);
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [confirmPassword, onChangeConfirmPassword] = useState("");

    const [confirm, onChangeConfirm] = useState("");
    const [showPassword, changeShowPassword] = useState(true); //(Registration: In progress, looking for alternative button)
    const [showConfirmPassword, changeshowConfirmPassword] = useState(true);
    
    const [passwordColor, onChangePasswordColor] = useState('rgba(0,0,0,1)');
    const [confirmPasswordColor, onChangeConfirmPasswordColor] = useState("rgba(0,0,0,1)");

    const [passwordConfirm, changePasswordConfirm] = useState(false);
    const [CpasswordConfirm, changeCPasswordConfirm] = useState(false);
    

    const [showAlert, changeShowAlert] = useState(false);
    const [alertTitle, changeAlertTitle] = useState();
    const [alertDesc, changeAlertDesc] = useState();

    const [showComplete, changeShowComplete] = useState(false);
    const [completeTitle, changeCompleteTitle] = useState();
    const [completeDesc, changeCompleteDesc] = useState();

    const [showConfirm, changeShowConfirm] = useState(false);
    const [confirmTitle, changeConfirmTitle] = useState('Confirm Reset password');
    const [confirmDesc, changeConfirmDesc] = useState('Do you confirm to resetting your password?');

    const [nameToolTipVisible, setNameToolTipVisible] = useState(false);
    const [emailToolTipVisible, setEmailToolTipVisible] = useState(false);
    const [pwdToolTipVisible, setPwdToolTipVisible] = useState(false);
    const [cPwdPasswordToolTipVisible, setCPwdPasswordToolTipVisible] = useState(false);

    const [nameToolTipColor, setNameToolTipColor] = useState(false);
    const [emailToolTipColor, setEmailToolTipColor] = useState(false);
    const [pwdToolTipColor, setPwdToolTipColor] = useState(false);
    const [cPwdPasswordToolTipColor, setCPwdPasswordToolTipColor] = useState(false);


    function validatePassword(){
      if(password == null || password == ""){
        changePasswordConfirm(false);
        onChangePasswordColor("rgba(255,0,0,1)")
        
      } else{
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(reg.test(String(password))){
          changePasswordConfirm(true);
          onChangePasswordColor("rgba(0,255,0,1)")
        }else{
          changePasswordConfirm(false);
          onChangePasswordColor("rgba(255,0,0,1)")
        }
        
      }
    }

    function validateConfirmPassword(){
      if(confirmPassword == null || confirmPassword == "" || confirmPassword != password){
        changeCPasswordConfirm(false)
        onChangeConfirmPasswordColor("rgba(255,0,0,1)")
      } else{
        changeCPasswordConfirm(true)
        onChangeConfirmPasswordColor("rgba(0,255,0,1)")
      }
    }
    
    function finalValidation(){
       if (passwordConfirm == false){
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

    async function getValueFor(key) {
      let result = await SecureStore.getItemAsync(key);
      onChangeEmail(result);
    }
     
    function executeReset() {
      console.log(email);
      hideConfirm();
      api.hash(password).then(digest => {
        api.resetPassword(email.toLowerCase(), digest,).then(data => {
          if(data == true){
            changeCompleteTitle("Reset Password Successful")
            changeConfirmDesc("You have successfuly reset your password")
            openComplete()
          } else{
            changeAlertTitle("Something Went Wrong")
            changeAlertDesc("Something went wrong while reseting your password, try again")
            openAlert();
          }
        })
      })
      
    }

    getValueFor("email")
    return (
      
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.screen}>
            <StatusBar style='dark'/>

            <View style={{position: 'absolute', backgroundColor: '#694BBE', height: 700, width: 700, top: '85%', borderRadius:600}}/>

            <Text
            style={styles.title}
            >
            Reset Password
            </Text>
            <AwesomeAlert  //alert
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

            <AwesomeAlert    //Complete Alert
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
            
            <AwesomeAlert    //Confirmation
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
              executeReset();
            }}
            showCancelButton={true}
            cancelText="Cancel"
            cancelButtonColor="red"
            onCancelPressed={() => {
              hideConfirm();
            }}
            />

            <View style={{flexDirection: 'column', width: '100%', paddingLeft:'10%', bottom: '5%'}}>
              <View style={{flexDirection: 'row', alignItems:'center', height: 33, marginBottom: -9}}>
                <MaterialIcons name="lock" size={15} color="black" />
                <Text> New Password</Text>
                <View style={{marginLeft: '2%'}}>
                  <Tooltip
                  animated={true}
                  arrowSize={{width: 15, height: 8}}
                  backgroundColor="rgba(0,0,0,0.5)"
                  isVisible={pwdToolTipVisible}
                  content={<Text style={{fontSize: 13.5}}>{`Please enter your new password here:\n•Minimum 8 Characters Long\n•Include UpperCase and LowerCase Letter\n•Include Number\n•Include Special Character`}</Text>}
                  placement="top"
                  topAdjustment={-25.5}
                  onClose={() => setPwdToolTipVisible(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setPwdToolTipVisible(true)}>
                        <MaterialIcons name="info-outline" size={18} color={pwdToolTipVisible ? 'white' : 'red'}  />
                      </TouchableOpacity>
                    </View>
                  </Tooltip>
                </View>
              </View>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TextInput
                style={[styles.inputPassword, {borderBottomColor: passwordColor}]}
                secureTextEntry={showPassword}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={onChangePassword}
                onBlur={validatePassword}
                value={password}/>

                <TouchableOpacity 
                style={{position: 'absolute', alignSelf: 'baseline', left: '80%', top: '10%'}}
                onPress={() => {showPassword ? changeShowPassword(false) : changeShowPassword(true)} }
                >
                  <MaterialIcons name="remove-red-eye" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>


            <View style={{flexDirection: 'column', width: '100%', paddingLeft:'10%', marginBottom: '5%'}}>
              <View style={{flexDirection: 'row', alignItems:'center', height: 33, marginBottom: -9}}>
                <MaterialIcons name="lock" size={15} color="black" />
                <Text> Confirm New Password</Text>
                <View style={{marginLeft: '2%'}}>
                  <Tooltip
                  animated={true}
                  arrowSize={{width: 15, height: 8}}
                  backgroundColor="rgba(0,0,0,0.5)"
                  isVisible={cPwdPasswordToolTipVisible}
                  content={<Text>{`Please confirm your\nnew password here`}</Text>}
                  placement="top"
                  topAdjustment={-25.5}
                  onClose={() => setCPwdPasswordToolTipVisible(false)}
                  >
                    <View>
                      <TouchableOpacity onPress={() => setCPwdPasswordToolTipVisible(true)}>
                        <MaterialIcons name="info-outline" size={18} color={cPwdPasswordToolTipVisible ? 'white' : 'red'}  />
                      </TouchableOpacity>
                    </View>
                  </Tooltip>
                </View>
              </View>

              <View style={{flexDirection: 'row', width: '100%'}}>
                <TextInput
                style={[styles.inputPassword, {borderBottomColor: confirmPasswordColor}]}
                secureTextEntry={showConfirmPassword}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={onChangeConfirmPassword}
                onBlur={validateConfirmPassword}
                value={confirmPassword}/>

                <TouchableOpacity 
                style={{position: 'absolute', alignSelf: 'baseline', left: '80%', top: '10%'}}
                onPress={() => {showConfirmPassword ? changeshowConfirmPassword(false) : changeshowConfirmPassword(true)} }
                >
                  <MaterialIcons name="remove-red-eye" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>


            <Pressable
            style={styles.button}
            android_ripple={{color: 'white', borderless: false}}
            onPressIn={Keyboard.dismiss}
            onPressOut={finalValidation}
            >
              <Text style={styles.loginText}>Confirm</Text> 
            </Pressable>
            
            

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
      bottom: '80%',
      width: '100%',
      fontFamily: 'sans-serif-medium',
      color: '#694BBE',
      fontSize: 42,
      fontWeight: 'bold',
      textAlign: 'center',
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