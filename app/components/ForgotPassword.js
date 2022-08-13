import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, Alert, TouchableWithoutFeedback, Animated, Pressable } from 'react-native';
import axios from "axios";
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal'
import { PinCodeView } from './pinCodeView';
import { useWindowDimensions } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

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

export const ForgotPassword = ({ navigation }) => {

  const [toolTipEmail, setToolTipEmail] = useState(false);
  const [count, setCount] = useState(0);
  const [email, onChangeEmail] = useState(null);
  const [emailColor, onChangeEmailColor] = useState("rgba(0,0,0,1)");
  const [passwordColor, onChangePasswordColor] = useState('rgba(0,0,0,1)');
  const [password, onChangePassword] = useState(null);
  const [showPassword, changeShowPassword] = useState(true);
  const [emailConfirm, changeShowEmailConfirm] = useState(false);
  const [passwordConfirm, changeShowPasswordConfirm] = useState(false);
  const [showAlert, changeShowAlert] = useState(false);
  const [alertTitle, changeAlertTitle] = useState();
  const [alertDesc, changeAlertDesc] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  const [key, onChangeKey] = useState("");
  const [value, onChangeValue] = useState("");

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  function validateEmail() {
    if ((email == null) || (email == "")) {
      changeShowEmailConfirm(false)
      onChangeEmailColor("rgba(255,0,0,1)")
    } else {
      //Regex for email according to RFC 5322
      const reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if (reg.test(String(email).toLowerCase())) {
        changeShowEmailConfirm(true)
        onChangeEmailColor("rgba(0,255,0,1)")
      } else {
        changeShowEmailConfirm(false)
        onChangeEmailColor("rgba(255,0,0,1)")
      }

    }
  }
  function checkValidation() {
    validateEmail()
    if ((emailConfirm == true)) {
      submitExecute()
    } else {
      warningAlert()
    }

  }

  function submitExecute() {
    api.forgotPassword(email).then(data => {
      if (data.check) {
        setModalVisible(true);
      } else {
        warningAlert();
      }
    })
  }

  function warningAlert() {
    changeAlertTitle("Invalid Email")
    changeAlertDesc("Please Enter a valid Email")
    openAlert();

  }

  function openAlert() {
    changeShowAlert(true);
  };

  function hideAlert() {
    changeShowAlert(false);
  };

  function saveEmail(email) {
    save('email', email);
  }

  return (


    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.screen}>
          <StatusBar style='dark' />

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
            <PinCodeView navigation={navigation} modal={setModalVisible} nextLocation={'ResetPassword'} email={email} />

          </Modal>

          <Image
            source={require('../assets/Login_Background3.jpg')}
            style={styles.background}
          />

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
          <MaterialIcons name="lock-outline" size={70} color='black'
            style={{ position: 'absolute', bottom: '83%', alignSelf: 'center' }} />
          <Text
            style={windowHeight < 700 ? styles.loginTitleSmall : styles.loginTitle}>
            Forgot Your Password?
          </Text>
          <Text style={styles.infoText}>Enter your email so we can reset your password!</Text>

          <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', marginTop: '5%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
              <MaterialIcons name={"mail"} size={20} color="black" />
              <Text style={styles.inputText}> Email</Text>
              <View style={{ marginLeft: '2%' }}>
                <Tooltip
                  arrowSize={{ width: 15, height: 8 }}
                  backgroundColor="rgba(0,0,0, 0.5)"
                  isVisible={toolTipEmail}
                  content={<Text>Enter your registered Email</Text>}
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
              style={[styles.input, { borderBottomColor: emailColor }]}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={onChangeEmail}
              onBlur={validateEmail}
              value={email}
            />
          </View>

          <Pressable
            style={styles.SubmitButton}
            onPressIn={Keyboard.dismiss}
            onPressOut={checkValidation}
          >
            <Text style={styles.loginText}>Submit</Text>
          </Pressable>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
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
    height: '65%',
    fontFamily: 'sans-serif-medium',
    color: '#694BBE',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: '9%',
    padding: 10,
    width: '100%',
  },
  loginTitleSmall: {
    position: 'absolute',
    height: '65%',
    fontFamily: 'sans-serif-medium',
    color: '#694BBE',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: '9%',
    padding: 10,
    width: '100%',
  },
  infoText: {
    marginTop: 20,
    fontFamily: 'sans-serif-medium',
    color: '#694BBE',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: '9%'
  },
  SubmitButton: {
    top: '10%',
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
  input: {
    height: 40,
    width: '90%',
    marginBottom: '10%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  modelView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 350,
    borderRadius: 30,
  },
  authenticationTitle: {
    bottom: 10,
    fontFamily: 'sans-serif-medium',
    color: '#694BBE',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 10,
  },
  authenticationInput: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0, 0.5)',
    width: '50%',
    height: 65,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 30
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
});