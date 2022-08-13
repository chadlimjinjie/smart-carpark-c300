import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

import * as api from '../api/api';

const DATA = [
  {
    id: "1",
    name: "Lucas Wu",
    description: "VIP Lucas Wu has arrived at the carpark "
  },
  {
    id: "2",
    name: "Albert Wong",
    description: "Reservation for Albert Wong has been confirmed"
  },
  {
    id: "3",
    name: "Jack Li",
    description: "There is an alert made by Manager Christopher Wang"
  },
];

// Id 1 = Reservation Confirmed
// Id 2 = Guest Arrival
// Id 3 = VIP Arrival
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
      <View style={{ alignSelf: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 50 / 2, backgroundColor: 'red' }} />
      <View style={{ marginLeft: '5%', marginTop: '2%', width: '75%' }}>
        <Text style={[styles.name, textColor]}>{item.fullname}</Text>
        <Text style={styles.desc} numberOfLines={4} ellipsizeMode='tail'>{item.fullname} {item.type_id}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Homepage = () => {

  const [userId, setUserId] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [fullname, setFullname] = useState("");

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (key == 'user_id') {
      setUserId(result);
    }
    if (key == 'fullname') {
      setFullname(result);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getValueFor('fullname');
      getValueFor('user_id');
      retrieveNotifications();
    }, [userId])
  );

  function retrieveNotifications() {
    api.getNotifications(userId, '1,2,3').then(data => {
      setNotifications(data.slice(0, 3));
    });
  }

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "white" : "white";
    const color = item.id === selectedId ? 'black' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.Welcome}>
        {`Welcome,\n${fullname}`}
      </Text>

      <View style={styles.notif}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedId}
        />
      </View>

      <Image>

      </Image>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  Welcome: {
    fontSize: 48,
    padding: 40
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 300,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  name: {
    fontSize: 18,
    bottom: '25%',
    marginBottom: '-5%',
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium'
  },
  notif: {
    maxHeight: "24%",
    width: "100%"
  },
  desc: {
    width: '100%',
    fontFamily: 'sans-serif-medium',
    height: '100%',
  }
});

export default Homepage;