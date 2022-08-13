import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, Alert, TouchableWithoutFeedback, Animated, Pressable } from 'react-native';
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Tooltip from 'react-native-walkthrough-tooltip';
import * as api from '../api/api';
import { render } from 'react-dom';
import { PinCodeView } from './pinCodeView';

const DismissKeyboard = ({ children }) => {
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>
}



export function NameTextInput({ nameInput, changeFullNameConfirm }) {
  const [fullName, onChangeFullName] = useState("");
  const [fullNameColor, onChangeFullNameColor] = useState("rgba(0,0,0,1)");

  const [nameToolTipVisible, setNameToolTipVisible] = useState(false);
  const [nameToolTipColor, setNameToolTipColor] = useState(false);

  function validateFullName() {
    if ((fullName == null) || (fullName == "")) {
      changeFullNameConfirm(false);
      onChangeFullNameColor("rgba(255,0,0,1)")
    } else {
      nameInput(fullName)
      changeFullNameConfirm(true);
      onChangeFullNameColor("rgba(0,255,0,1)")
    }
  }

  return (
    <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', height: 90 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
        <MaterialIcons name="person" size={18} color="black" />
        <Text> Full Name</Text>
        <View style={{ marginLeft: '2%' }}>
          <Tooltip
            arrowSize={{ width: 15, height: 8 }}
            backgroundColor="rgba(0,0,0, 0.5)"
            isVisible={nameToolTipVisible}
            content={<Text>Please enter your full name here</Text>}
            placement="top"
            topAdjustment={-25.5}
            onClose={() => setNameToolTipVisible(false)}
          >
            <View>
              <TouchableOpacity onPress={() => setNameToolTipVisible(true)}>
                <MaterialIcons name="info-outline" size={18} color={nameToolTipVisible ? 'white' : 'red'} />
              </TouchableOpacity>
            </View>

          </Tooltip>
        </View>
      </View>
      <TextInput
        style={[styles.inputPassword, { borderBottomColor: fullNameColor }]}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={onChangeFullName}
        onBlur={validateFullName}
        value={fullName} />
    </View>
  )
}

export function EmailTextInput({ textInput, changeShowEmailConfirm }) {
  const [email, onChangeEmail] = useState("");
  const [emailColor, onChangeEmailColor] = useState("rgba(0,0,0,1)");

  const [emailToolTipVisible, setEmailToolTipVisible] = useState(false);
  const [emailToolTipColor, setEmailToolTipColor] = useState(false);



  function validateEmail() {
    if ((email == null) || (email == "")) {
      changeShowEmailConfirm(false)
      onChangeEmailColor("rgba(255,0,0,1)")
    } else {
      //Regex for email according to RFC 5322
      const reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if (reg.test(String(email).toLowerCase())) {
        console.log('here')
        textInput(email)
        changeShowEmailConfirm(true)
        onChangeEmailColor("rgba(0,255,0,1)")
      } else {
        changeShowEmailConfirm(false)
        onChangeEmailColor("rgba(255,0,0,1)")
      }

    }
  }

  return (
    <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', height: 90 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
        <MaterialIcons name="email" size={18} color="black" />
        <Text> Email</Text>
        <View style={{ marginLeft: '2%' }}>
          <Tooltip
            animated={true}
            arrowSize={{ width: 15, height: 8 }}
            backgroundColor="rgba(0,0,0,0.5)"
            isVisible={emailToolTipVisible}
            content={<Text>{`Please enter your Email here`}</Text>}
            placement="top"
            topAdjustment={-25.5}
            onClose={() => setEmailToolTipVisible(false)}
          >
            <View>
              <TouchableOpacity onPress={() => setEmailToolTipVisible(true)}>
                <MaterialIcons name="info-outline" size={18} color={emailToolTipVisible ? 'white' : 'red'} />
              </TouchableOpacity>
            </View>
          </Tooltip>
        </View>
      </View>
      <TextInput
        style={[styles.inputPassword, { borderBottomColor: emailColor }]}
        keyboardType={'email-address'}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={onChangeEmail}
        onBlur={validateEmail}
        value={email} />
    </View>
  );
}


export function PasswordTextInput({ passwordInput, changeShowPasswordConfirm }) {
  const [passwordColor, onChangePasswordColor] = useState('rgba(0,0,0,1)');
  const [password, onChangePassword] = useState("");

  const [showPassword, changeShowPassword] = useState(true);
  const [pwdToolTipVisible, setPwdToolTipVisible] = useState(false);
  const [pwdToolTipColor, setPwdToolTipColor] = useState(false);

  function validatePassword() {
    if (password == null || password == "") {
      changeShowPasswordConfirm(false)
      onChangePasswordColor("rgba(255,0,0,1)")

    } else {
      const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      if (reg.test(String(password))) {
        passwordInput(password)
        changeShowPasswordConfirm(true)
        onChangePasswordColor("rgba(0,255,0,1)")
      } else {
        changeShowPasswordConfirm(false)
        onChangePasswordColor("rgba(255,0,0,1)")
      }

    }
  }

  return (
    <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 35, marginBottom: -10 }}>
        <MaterialIcons name="lock-outline" size={15} color="black" />
        <Text> Password</Text>
        <View style={{ marginLeft: '2%' }}>
          <Tooltip
            animated={true}
            arrowSize={{ width: 15, height: 8 }}
            backgroundColor="rgba(0,0,0,0.5)"
            isVisible={pwdToolTipVisible}
            content={<Text>Please enter your password here</Text>}
            placement="top"
            topAdjustment={-25.5}
            onClose={() => setPwdToolTipVisible(false)}
          >
            <View>
              <TouchableOpacity onPress={() => setPwdToolTipVisible(true)}>
                <MaterialIcons name="info-outline" size={18} color={pwdToolTipVisible ? 'white' : 'red'} />
              </TouchableOpacity>
            </View>
          </Tooltip>
        </View>
      </View>

      <View style={{ flexDirection: 'row', width: '100%' }}>
        <TextInput
          style={[styles.inputPassword, { borderBottomColor: passwordColor }]}
          secureTextEntry={showPassword}
          onSubmitEditing={Keyboard.dismiss}
          onChangeText={onChangePassword}
          onBlur={validatePassword}
          value={password} />

        <TouchableOpacity
          style={{ position: 'absolute', alignSelf: 'baseline', left: '80%', top: '10%' }}
          onPress={() => { showPassword ? changeShowPassword(false) : changeShowPassword(true) }}
        >
          <MaterialIcons name="remove-red-eye" size={30} color="black" />
        </TouchableOpacity>
      </View>

    </View>
  )

}




export function ConfirmPasswordTextInput({ password, ConfirmPasswordInput, changeCPasswordConfirm }) {
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [showConfirmPassword, changeshowConfirmPassword] = useState(true);
  const [confirmPasswordColor, onChangeConfirmPasswordColor] = useState("rgba(0,0,0,1)");

  const [cPwdPasswordToolTipVisible, setCPwdPasswordToolTipVisible] = useState(false);
  const [cPwdPasswordToolTipColor, setCPwdPasswordToolTipColor] = useState(false);

  function validateConfirmPassword() {
    if (confirmPassword == null || confirmPassword == "" || confirmPassword != password) {
      changeCPasswordConfirm(false)
      onChangeConfirmPasswordColor("rgba(255,0,0,1)")
    } else {
      ConfirmPasswordInput(confirmPassword)
      changeCPasswordConfirm(true)
      onChangeConfirmPasswordColor("rgba(0,255,0,1)")
    }
  }

  return (
    <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
        <MaterialIcons name="lock" size={15} color="black" />
        <Text> Confirm Password</Text>
        <View style={{ marginLeft: '2%' }}>
          <Tooltip
            animated={true}
            arrowSize={{ width: 15, height: 8 }}
            backgroundColor="rgba(0,0,0,0.5)"
            isVisible={cPwdPasswordToolTipVisible}
            content={<Text>Please confirm your password here</Text>}
            placement="top"
            topAdjustment={-25.5}
            onClose={() => setCPwdPasswordToolTipVisible(false)}
          >
            <View>
              <TouchableOpacity onPress={() => setCPwdPasswordToolTipVisible(true)}>
                <MaterialIcons name="info-outline" size={18} color={cPwdPasswordToolTipVisible ? 'white' : 'red'} />
              </TouchableOpacity>
            </View>
          </Tooltip>
        </View>
      </View>

      <View style={{ flexDirection: 'row', width: '100%' }}>
        <TextInput
          style={[styles.inputPassword, { borderBottomColor: confirmPasswordColor }]}
          secureTextEntry={showConfirmPassword}
          onSubmitEditing={Keyboard.dismiss}
          onChangeText={onChangeConfirmPassword}
          onBlur={validateConfirmPassword}
          value={confirmPassword} />

        <TouchableOpacity
          style={{ position: 'absolute', alignSelf: 'baseline', left: '80%', top: '10%' }}
          onPress={() => { showConfirmPassword ? changeshowConfirmPassword(false) : changeshowConfirmPassword(true) }}
        >
          <MaterialIcons name="remove-red-eye" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}



export function CreateTextInput({ value, nameOfInput, iconType, toolTipText, inputFunction, confirmInputFunction, editable, validationFunction }) {
  const [input, setInput] = useState(value);
  const [inputColor, setInputColor] = useState("rgba(0,0,0,1)");

  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [toolTipDesc, setToolTipDesc] = useState(toolTipText);
  const [nameToolTipColor, setToolTipColor] = useState(false);
  const[edit, setEdit] = useState(true);

  function validateInput() {
    if ((input == null) || validationFunction(input)) {
      confirmInputFunction(false);
      inputFunction(input);
      setInputColor("rgba(0,255,0,1)") //green colors
    } else {
      confirmInputFunction(true);
      setInputColor("rgba(255,0,0,1)") //red color
    }
  }


  return (
    <View style={{ flexDirection: 'column', width: '100%', paddingLeft: '10%', marginTop: '10%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 33, marginBottom: -9 }}>
        <MaterialIcons name={iconType} size={18} color="black" />
        <Text> {nameOfInput}</Text>
        <View style={{ marginLeft: '2%' }}>
          <Tooltip
            arrowSize={{ width: 15, height: 8 }}
            backgroundColor="rgba(0,0,0, 0.5)"
            isVisible={toolTipVisible}
            content={<Text>{toolTipDesc}</Text>}
            placement="top"
            topAdjustment={-25.5}
            onClose={() => setToolTipVisible(false)}
          >
            <View>
              <TouchableOpacity onPress={() => setToolTipVisible(true)}>
                <MaterialIcons name="info-outline" size={18} color={toolTipVisible ? 'white' : 'red'} />
              </TouchableOpacity>
            </View>
          </Tooltip>
        </View>
      </View>
      <TextInput
        style={[styles.inputPassword, { borderBottomColor: inputColor }]}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={setInput}
        onBlur={validateInput}
        editable={editable}
        value={input} />
    </View>
  )
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '90%',
    marginBottom: '10%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  inputPassword: {
    height: 40,
    width: '90%',
    marginBottom: '10%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});