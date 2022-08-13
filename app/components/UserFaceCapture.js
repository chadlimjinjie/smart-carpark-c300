import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Pressable} from 'react-native';
import {Camera} from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as api from '../api/api';
import AwesomeAlert from 'react-native-awesome-alerts';

export function UserFaceCapture({navigation, modal, nextLocation}){
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [faceDetecting, setFaceDetecting] = useState(false);
  const [faces, setFaces] = useState([]);
  const [photo, setPhoto] = useState();
  const [user_id, setUser_id] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [failedAlert, setFailedAlert] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      /*
      axios.post("http://192.168.31.154:8080/api/face", {
        Photo: data.base64,
        id: user_id
      }
      )
      */
     console.log("Taking picture")
     setLoading(true);
     api.UserFaceCapture(data.base64, user_id).then(data => {
       console.log(data);
        if(data){
          setConfirmAlert(true);
        } else{
          setFailedAlert(true);
        }
      });
    }
  };
    
  
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    setUser_id(result);
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  getValueFor('user_id');

  function login(){
    console.log('Holy crap ya did it')
    modal(false);
    navigation.navigate(nextLocation)
  }
  function back(){
    console.log('Well that did not work')
    modal(false);
  }

  return (
    isFocused && (
      <View style={styles.container}>
        <AwesomeAlert
        show={loading}
        showProgress={false}
        customView={<ActivityIndicator size="large" color="#694BBE" />}
        message={"Loading..."}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        />

        <AwesomeAlert
        show={confirmAlert}
        title={"User has been verified"}
        message={`Welcome back!`}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Continue"
        confirmButtonColor="green"
        onConfirmPressed={() => {
          modal(false);
        }}
        />

        <AwesomeAlert
        show={failedAlert}
        title={"Face Not Recognized"}
        message={`Log in to try again`}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Back"
        confirmButtonColor="red"
        onConfirmPressed={() => {
          back();
        }}
        />
        
        <Text style={{textAlign: 'center', fontFamily: 'sans-serif-medium',fontWeight: 'bold', fontSize: 20}}>{`This photo will be used for Facial Recognition\nPress the start button to begin`}</Text>

      {active ? 
        <Camera style={styles.camera} type={type}
        ref={ref =>{
          this.camera = ref;
        }}
        >
        </Camera>
        : null
      }

        <Pressable style={styles.startbutton}
        onPressOut={takePicture}
        >
          <Text style={styles.startText}>Start</Text>
        </Pressable>

        <Pressable style={styles.backButton}
        onPressOut={back}
        >
          <Text style={styles.backText}>Cancel</Text>
        </Pressable>

      </View>
    )
    
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
  camera: {
    height: '60%',
    width: '80%',

  },
  startbutton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#694BBE",
    width: '80%',
    marginTop: '10%',
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
  startText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 24,
  },
  backButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#694BBE",
    width: '80%',
    marginTop: '5%',
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
  backText: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 24,
  },
});
