import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, Alert, TouchableWithoutFeedback, Animated, Pressable } from 'react-native';
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Tooltip from 'react-native-walkthrough-tooltip';
import * as api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Modal from 'react-native-modal'
import { render } from 'react-dom';
import { PinCodeView } from './pinCodeView';
import { EmailTextInput, PasswordTextInput } from './InputCollection'
import { FaceRecognition } from './faceRecognition';
import { UserFaceCapture } from './UserFaceCapture';

const DismissKeyboard = ({ children }) => {
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>
}

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}





export const Login = ({ navigation }) => {

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState(null);

  const [emailConfirm, changeShowEmailConfirm] = useState(false);
  const [passwordConfirm, changeShowPasswordConfirm] = useState(false);

  const [showAlert, changeShowAlert] = useState(false);
  const [alertTitle, changeAlertTitle] = useState();
  const [alertDesc, changeAlertDesc] = useState();

  const [key, onChangeKey] = useState("");
  const [value, onChangeValue] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [faceRecog, setFaceRecog] = useState(false);
  const [faceRecogAlert, setFaceRecogAlert] = useState(false);

  function checkValidation() {
    console.log(emailConfirm)
    console.log(passwordConfirm)
    if ((emailConfirm == true) && (passwordConfirm == true)) {
      loginExecute()
    } else {
      warningAlert()
    }
  }

  function saveUserDetails(user_id, email, fullname, role_id) {
    save('user_id', user_id.toString());
    save('email', email);
    save('fullname', fullname);
    save('role_id', role_id.toString());
  }

  function loginExecute() {

    setFaceRecog(false);
    setFaceRecogAlert(false);

    api.hash(password).then(digest => {
      api.executeLogin(email.toLowerCase(), digest).then(data => {
        if (data.check) {
          saveUserDetails(data.user_id, data.email, data.fullname, data.role_id);
          // console.log(data.face);
          if (data.face != null) {
            setFaceRecogAlert(true);
          } else {
            setModalVisible(true);
          }

          console.log("Yeah it worked");
          // setModalVisible(true);
        } else {
          changeAlertTitle("Invalid Login")
          changeAlertDesc("Please recheck login details")
          openAlert();
        }
      })

    });

  }

  function warningAlert() {
    if (emailConfirm == false) {
      changeAlertTitle("Invalid Email")
      changeAlertDesc("Please Enter a valid Email")
      openAlert();


    } else if (passwordConfirm == false) {
      changeAlertTitle("Invalid Password")
      changeAlertDesc("Please Enter a valid Password")
      openAlert();

    }

  }

  function openAlert() {
    changeShowAlert(true);
  };

  function hideAlert() {
    changeShowAlert(false);
  };

  function openPinWindow() {
    modalVisible = true;
  };

  function yesFaceRecog() {
    setFaceRecogAlert(true);
    setFaceRecog(true);
    setModalVisible(true);
  }

  function noFaceRecog() {
    setFaceRecogAlert(false);
    setFaceRecog(false);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.screen}>
          <StatusBar style='dark' />

          <View style={{ position: 'absolute', backgroundColor: '#694BBE', height: 700, width: 700, top: '85%', borderRadius: 600 }} />

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
              hideAlert();
            }}
          />

          <AwesomeAlert
            show={faceRecogAlert}
            showProgress={false}
            title={"Face Recognition"}
            message={"Do you want to use Face Recognition to login?"}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="No"
            cancelButtonColor="red"
            onCancelPressed={() => {
              noFaceRecog();
            }}
            showConfirmButton={true}
            confirmText="Yes"
            confirmButtonColor="green"
            onConfirmPressed={() => {
              yesFaceRecog();
            }}
          />

          <Modal
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            animationIn='bounceIn'
            animationOut='bounceOut'
            isVisible={modalVisible}
            customBackdrop={
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,1)' }} />
              </TouchableWithoutFeedback>
            }
          >

            {faceRecog ? <FaceRecognition navigation={navigation} modal={setModalVisible} nextLocation={'Dashboard'} /> :
              <PinCodeView navigation={navigation} modal={setModalVisible} nextLocation={'Dashboard'} email={email} />
            }

            {/* <PinCodeView navigation={navigation} modal={setModalVisible} nextLocation={'Dashboard'} email={email} /> */}
            {/* <FaceRecognition navigation={navigation} modal={setModalVisible} nextLocation={'Dashboard'} /> */}
            {/* <UserFaceCapture navigation={navigation} modal={setModalVisible} nextLocation={'Dashboard'} /> */}

          </Modal>

          <Text
            style={styles.loginTitle}
          >
            Welcome back,
            Login to Continue
          </Text>

          <EmailTextInput textInput={onChangeEmail} changeShowEmailConfirm={changeShowEmailConfirm} />

          <PasswordTextInput passwordInput={onChangePassword} changeShowPasswordConfirm={changeShowPasswordConfirm} />

          <View style={styles.middleTextButtons}>
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => navigation.push('ForgotPassword')}>
              <Text style={styles.textMiddleButtons}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Pressable
            style={styles.LoginButton}
            android_ripple={{ color: 'white', borderless: false }}
            onPressIn={Keyboard.dismiss}
            onPressOut={checkValidation}
          >
            <Text style={styles.loginText}>Login</Text>
          </Pressable>

          <View style={styles.bottomArea}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => navigation.push('Registration')}
            >
              <Text style={styles.bottomText}>Sign Up Now!</Text>
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
    backgroundColor: 'rgba(255,255,255, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 1)',
    alignItems: 'center',
    justifyContent: 'center',
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

  },
  loginTitle: {
    position: 'absolute',
    height: '85%',
    fontFamily: 'sans-serif-medium',
    color: '#694BBE',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '5%',
    paddingLeft: '9%',
    padding: 10,
  },
  LoginButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#694BBE",
    width: '80%',
    marginTop: '1%',
    borderRadius: 30,
    marginBottom: '5%',
    shadowOffset: {
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
  middleTextButtons: {
    width: "80%",
    fontFamily: 'sans-serif-medium',
    alignItems: 'flex-end',
  },
  showButton: {
    backgroundColor: "transparent",
    height: 40,
    alignSelf: 'flex-end',
    marginBottom: '5%',
  },
  textMiddleButtons: {
    color: "#694BBE",
    textAlign: "right",
  },
  bottomButton: {
    backgroundColor: "transparent",
  },
  bottomText: {
    color: "#694BBE",
    fontFamily: 'sans-serif-medium',
    textAlign: "center",
  },
});