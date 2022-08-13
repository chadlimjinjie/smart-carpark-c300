import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

import * as api from '../api/api';
import NotificationCard from './NotificationCard';

export default function NotificationCentre() {

  const [userId, setUserId] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);
  // Initialize the values to be pre-selected when the Notification page loads
  const [values, setValues] = useState([1, 2, 3, 4, 5]);
  // The label and its value of the items in the dropdown
  const [items, setItems] = useState([
    { label: 'Reservation Confirmation', value: 1 },
    { label: 'Guest Arrival', value: 2 },
    { label: 'VIP Arrival', value: 3 },
    { label: 'Broadcast', value: 4 },
    { label: 'Traffic Jam', value: 5 },
  ]);

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

  useFocusEffect(
    React.useCallback(() => {

      getValueFor('user_id');
      // setUserId(1);
      retrieveNotifications();
      var loop = setInterval(() => {
        retrieveNotifications();
      }, 10000);
      return () => {
        clearInterval(loop);
      }
    }, [userId, values])
  );

  /**
   * This function is called when the page first loads and when an item from the dropdown list is selected or de-selected. 
   * This function joins the selected value from the dropdown then pass currently logged in user_id and the selected value to getNotification in api to get and filter the notification.
   */
  function retrieveNotifications() {
    console.log('User ID > ', userId);
    console.log('?', values.join());
    /**
     * Call the api getNotifications function which takes in the user_id and the selected filter values.
     */
    api.getNotifications(userId, values.join()).then(data => {
      setNotifications(data);
    });
  }

  function clearAllNotifications(userId) {
    api.clearAllNotifications(userId, values.join()).then(data => {
      var affectedRows = data.affectedRows;
      if (affectedRows > 0) {
        setNotifications([]);
      } else {
        console.log('Error clearing all Notifications');
      }
    });
  }

  const renderItem = ({ item }) => (
    <NotificationCard unId={item.id} typeId={item.type_id} title={item.title} fullname={item.fullname} timestamp={item.timestamp} broadcastId={item.broadcast_id} />
  );

  return (
    <View style={[styles.container]}>

      <DropDownPicker
        open={open}
        value={values}
        items={items}
        setOpen={setOpen}
        setValue={setValues}
        setItems={setItems}
        multiple={true}
        showBadgeDot={false}
        onChangeValue={() => setOpen(false)}
        style={{ borderWidth: 1.6, borderColor: "#694BBE", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowColor: "black", elevation: 5 }}
        containerStyle={{ marginBottom: 20 }}
        dropDownContainerStyle={{
          borderWidth: 1.6,
          borderTopWidth: 0,
          borderRadius: 6,
          borderColor: "#694BBE",
          shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowColor: "black", elevation: 5
        }}
      />

      <FlatList style={{ marginBottom: 20 }} data={notifications} renderItem={renderItem} keyExtractor={(notification) => notification.id.toString()} />

      <TouchableOpacity style={styles.clearAllButton} onPress={() => { setShowAlert(true) }}>
        <Text style={{ color: "white", fontWeight: 'bold' }}>Clear All</Text>
      </TouchableOpacity>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Clear all Notifications?"
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
          clearAllNotifications(userId);
        }}
        onDismiss={() => {
          setShowAlert(false);
        }}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '6%',
    margin: '8%'
  },
  clearAllButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6
  }
});
