import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard, Alert, TouchableWithoutFeedback, Animated, Pressable, Button } from 'react-native';
import axios from "axios";
import { Octicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { NavigationActions } from 'react-navigation';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Tooltip from 'react-native-walkthrough-tooltip';
import * as SecureStore from 'expo-secure-store';
import * as api from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal'

const DismissKeyboard = ({ children }) => {
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
  >
    {children}

  </TouchableWithoutFeedback>

}





export const ManagerBroadcast = ({ navigation }) => {

  const [category, setCategory] = useState("Select a Category");
  const [message, setMessage] = useState("");

  const [categoryTT, setCategoryTT] = useState(false); //TT = ToolTip
  const [broadcastTT, setBroadcastTT] = useState(false);

  const [userID, setUserID] = useState();

  const [error, setError] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [image, setImage] = useState(null);
  const [imageTT, setImageTT] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [uri, setUri] = useState('');
  const [image64, setImage64] = useState('');

  /*
  const [test, setTest] = useState(false);
  const [testTitle, setTestTitle] = useState("");
  const [testMessage, setTestMessage] = useState("");
  */
  async function getValueFor() {
    let result = await SecureStore.getItemAsync('user_id');
    setUserID(result);
  }

  function validate() {
    if (category == "Select a Category") {
      setErrorTitle("Invalid Category")
      setErrorMessage("Please select a Category")
      setError(true);
      return
    }
    if (message == "") {
      setErrorTitle("Missing Broadcast Message")
      setErrorMessage("Please enter a Broadcast Message")
      setError(true);
    } else {
      setConfirm(true);
    }
  }

  function sendBroadcast() {
    setConfirm(false);
    console.log(message);
    console.log(category);
    api.sendBroadcast(userID, category, message, image64).then(data => {
      if (data) {
        setSuccess(true);
        /*
        api.getBroadcastInfo(10).then(data=>{
          if(data.check){
            setTestTitle(data.category);
            setTestMessage(data.message);
            setTest(true);
          }
        })
        */
        setMessage(""); //Remove if doing alert message test
      } else {
        setErrorTitle("ERROR")
        setErrorMessage(`There was an error while sending Broadcast Message.
        \nPlease try again, or contact an administrator for assistance.`)
        setError(true);
      }
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    setUri(result.uri);
    setImage64(result.base64);

    console.log(result);
    //console.log(result.base64);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  function showImage(){
    setModalVisible(true)
  }

  useEffect(() => {
    getValueFor();
  })
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.screen}>
          <AwesomeAlert
            show={error}
            showProgress={false}
            title={errorTitle}
            message={errorMessage}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="red"
            onCancelPressed={() => {
              setError(false);
            }}
          />
          <AwesomeAlert
            show={confirm}
            showProgress={false}
            title={"Confirm Broadcast"}
            message={"Do you want to send this Broadcast Message? This action cannot be undone."}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Confirm"
            confirmButtonColor="green"
            onConfirmPressed={() => {
              sendBroadcast();
            }}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="red"
            onCancelPressed={() => {
              setConfirm(false);
            }}

          />
          <AwesomeAlert
            show={success}
            showProgress={false}
            title={"Broadcast Successful"}
            message={"Your Broadcast Message has been successfully sent!"}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Close"
            confirmButtonColor="green"
            onConfirmPressed={() => {
              setSuccess(false);
            }}
          />
          {/*}
            <AwesomeAlert
            show={test}
            showProgress={false}
            title={testTitle}
            message={testMessage}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Close"
            confirmButtonColor="green"
            onConfirmPressed={() => {
              setTest(false);
            }}
            />*/}
          <LinearGradient
            colors={['#572378', '#694BBE', '#2033AB']}
            style={styles.background} />

          <Text style={styles.title}>Manager Broadcast</Text>

          <View style={styles.middleWindow}>

            <View style={{ backgroundColor: 'white', position: 'absolute', width: '100%', height: '100%', borderRadius: 20 }} />

            <View style={{ width: '80%', marginBottom: '5%' }}>
              <View style={{ flexDirection: 'row', right: 20 }}>
                <Tooltip
                  animated={false}
                  arrowSize={{ width: 15, height: 8 }}
                  backgroundColor="rgba(0,0,0,0.5)"
                  isVisible={categoryTT}
                  content={<Text>Please select the Category of the broadcast</Text>}
                  placement="right"
                  topAdjustment={-31.5}
                  onClose={() => setCategoryTT(false)}
                >
                  <View style={{ top: 4, marginRight: 5 }}>
                    <TouchableOpacity onPress={() => setCategoryTT(true)}>
                      <MaterialIcons name="info-outline" size={18} color={categoryTT ? 'white' : 'red'} />
                    </TouchableOpacity>
                  </View>
                </Tooltip>
                <Text style={{ fontSize: 18, marginBottom: 5, color: 'black' }}>Category:</Text>
              </View>

              <View style={styles.pickerWindow}>
                <Picker style={{ width: '95%', height: '100%', }}
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value)} >
                  <Picker.Item enabled={false} label={"Select a Category"} />
                  <Picker.Item label="Collision" value={"Collision"} />
                  <Picker.Item label="Illegal Parking" value={"Illegal Parking"} />
                  <Picker.Item label="Theft" value={"Theft"} />
                  <Picker.Item label="Hit and Run" value={"Hit and Run"} />
                  <Picker.Item label="Other" value={"Other"} />
                </Picker>
              </View>
            </View>

            <View style={{ width: '80%', marginBottom: '5%' }}>
              <View style={{ flexDirection: 'row', right: 20 }}>
                <Tooltip
                  animated={false}
                  arrowSize={{ width: 15, height: 8 }}
                  backgroundColor="rgba(0,0,0,0.5)"
                  isVisible={imageTT}
                  content={<Text>{image == null ? `Select an image from your phone's gallery to add in the broadcast message.`
                                  : `You've successfully attached an image, click the button again to view/change it.`}</Text>}
                  placement="right"
                  topAdjustment={-31.5}
                  onClose={() => setImageTT(false)}
                >
                  <View style={{ top: 4, marginRight: 5 }}>
                    <TouchableOpacity onPress={() => setImageTT(true)}>
                      <MaterialIcons name="info-outline" size={18} color={imageTT ? 'white' : 'red'} />
                    </TouchableOpacity>
                  </View>
                </Tooltip>
                <Text style={{ fontSize: 18, marginBottom: 5, color: 'black' }}>Image:</Text>
              </View>

              <TouchableOpacity style={styles.pickerWindow} onPress={image == null ? pickImage : showImage}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons name="attach-file" size={20} color="black" style={{top: 1}}/>
                  <Text style={{ fontSize: 18, marginBottom: 5, color: 'black', bottom: 1 }}>{image == null ? 'Insert Image' : 'Image has been attached'}</Text>
                </View>

              </TouchableOpacity>
            </View>

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
            <View style={{width: '100%', height: '70%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 5, borderColor: '#694BBE', paddingHorizontal: 5}}>
              <Image style={{width: '100%', height: 250, bottom: '5%'}} source={{uri: uri}}/>
              <TouchableOpacity style={[styles.LoginButton, {top: '5%'}]} onPress={pickImage}>
                <Text style={styles.loginText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.LoginButton, {top: '5%'}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.loginText}>Close</Text>
              </TouchableOpacity>
            </View>

            

          </Modal>


            <View style={{ width: '90%', height: '50%', marginBottom: '15%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Tooltip
                  animated={false}
                  arrowSize={{ width: 15, height: 8 }}
                  backgroundColor="rgba(0,0,0,0.5)"
                  isVisible={broadcastTT}
                  content={<Text>Please enter Broadcast Message</Text>}
                  placement="right"
                  topAdjustment={-31.5}
                  onClose={() => setBroadcastTT(false)}
                >
                  <View style={{ top: 4, marginRight: 5 }}>
                    <TouchableOpacity onPress={() => setBroadcastTT(true)}>
                      <MaterialIcons name="info-outline" size={18} color={broadcastTT ? 'white' : 'red'} />
                    </TouchableOpacity>
                  </View>
                </Tooltip>
                <Text style={{ fontSize: 18, marginBottom: 5, color: 'black' }}>Broadcast Message:</Text>
              </View>

              <View style={styles.textWindow}>
                <TextInput style={styles.textInput}
                  multiline={true}
                  placeholder={"Enter Broadcast Message"}
                  onChangeText={setMessage}
                  value={message}
                ></TextInput>
              </View>
            </View>


            <Pressable
              style={styles.LoginButton}
              android_ripple={{ color: 'white', borderless: false }}
              onPressIn={Keyboard.dismiss}
              onPressOut={() => validate()}
            >
              <Text style={styles.loginText}>Submit</Text>
            </Pressable>

            <StatusBar backgroundColor='black' style='light' />

          </View>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  text: {
    marginBottom: 20,
    fontSize: 15
  },
  background: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%'
  },
  title: {
    fontFamily: 'sans-serif-medium',
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: '5%',
    padding: 10,
    borderRadius: 20,
    marginTop: '10%',
  },
  middleWindow: {
    alignItems: 'center',
    paddingTop: '5%',
    width: '95%',
    height: '82%',
    borderRadius: 20
  },
  pickerWindow: {
    width: '100%',
    height: 30,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#694BBE',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  textWindow: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    borderColor: '#694BBE',
    backgroundColor: 'white'
  },
  textInput: {
    width: '98%',
    height: '98%',
    textAlignVertical: 'top',
    fontSize: 18,
    alignSelf: 'center'
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

});