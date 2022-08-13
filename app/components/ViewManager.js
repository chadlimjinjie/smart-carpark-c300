import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import { Searchbar } from 'react-native-paper';
import {
  StyleSheet, StatusBar, TouchableOpacity,
  View, FlatList, SafeAreaView, ScrollView, Text
} from 'react-native';


export default function ViewManager() {
  const [managerInformation, setManagerInformation] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => {
    setSearchQuery(query)
    api.getSearchManager(query)
      .then(data => {
        setManagerInformation(data)
      })
  };

  const Item = ({ item, onPress}) => (
    <TouchableOpacity onPress={onPress} disabled={true} style={[styles.item]}>
      <Text>
        Name:  {item.fullname}{"\n"}
        Email:   {item.email}
      </Text>
    </TouchableOpacity>
  );


  function getManagerInformation() {
    api.getManagerInformation().then(data => {
      setManagerInformation(data);
    })
  }




  useEffect(
    () => {
      getManagerInformation()
    }, []
  )

  const renderItem = ({ item }) => (
    <Item
      item={item}
    />
  );

  return (
    
    
     
      <View style={styles.container}>
        <Searchbar
          placeholder="Search for Manager"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        
        {(managerInformation.length > 0)
          ? <FlatList data={managerInformation} renderItem={renderItem} keyExtractor={(managerInformation) => managerInformation.user_id.toString()} />
          : <View style={styles.center}>
            <Text style={styles.center}>No Manager Found</Text>
          </View>}
      </View>
    
    

  );

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#694BBE',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  center: {
    alignItems: "center",
    padding: 10,
    fontSize:25,
    backgroundColor: 'white',
  }
});