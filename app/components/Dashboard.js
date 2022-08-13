import { StatusBar } from 'expo-status-bar';
import * as api from '../api/api';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  LogBox,
  TouchableOpacity,
  Switch
} from 'react-native';
import _ from "lodash"

import Traffic from './Traffic';


function Dashboard(props) {

  //Extended start
  const [Extended, setExtended] = useState([
    {
      Vehicle: "SBW12345",
      Duration: "15"
    },
    {
      Vehicle: "GGW54321",
      Duration: "16"
    },
    {
      Vehicle: "PEZ09876",
      Duration: "17"
    },
    {
      Vehicle: "STE98765",
      Duration: "18"
    },
    {
      Vehicle: "SEH93765",
      Duration: "19"
    },

  ])
  const [columns, setColumns] = useState([
    "Vehicle",
    "Duration"
  ])

  const [direction, setDirection] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState(null)

  const sortEx = (column) => {
    const newDirection = direction === "desc" ? "asc" : "desc"
    const sortedData = _.orderBy(Extended, [column], [newDirection])
    setSelectedColumn(column)
    setDirection(newDirection)
    setExtended(sortedData)
  }
  const ExHeader = () => (
    <View style={styles.tableHeader}>
      {
        columns.map((column, index) => {
          {
            return (
              <TouchableOpacity
                key={index}
                style={styles.columnHeader}
                onPress={() => sortEx(column)}>
                <Text style={styles.columnHeaderTxt}>{column + " "}
                  {selectedColumn === column && <MaterialCommunityIcons
                    name={direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"}
                  />
                  }
                </Text>
              </TouchableOpacity>
            )
          }
        })
      }
    </View>
  )
  //Extended end
  const [Guests, setGuests] = useState([]);
  //Guest start
  useEffect(
    () => {
      getGuestInformation()
    }, []
  )

  function getGuestInformation() {
    api.getDayGuest().then(data => {
      setGuests(data);
    })
  }

  const [Gcolumn, setGColumn] = useState([
    "VRN",
    "Guest",
    "Time",
    "Host"
  ])

  const [GDirection, setGDirection] = useState(null)
  const [GSelectedColumn, setGSelectedColumn] = useState(null)

  const sortG = (Gcolumn) => {
    const newGDirection = GDirection === "desc" ? "asc" : "desc"
    const GsortedData = _.orderBy(Guests, [Gcolumn], [newGDirection])
    setGSelectedColumn(Gcolumn)
    setGDirection(newGDirection)
    setGuests(GsortedData)
  }
  const GHeader = () => (
    <View style={styles.tableHeader}>
      {
        Gcolumn.map((Gcolumn, Gindex) => {
          {
            return (
              <TouchableOpacity
                key={Gindex}
                style={styles.columnHeader}
                onPress={() => sortG(Gcolumn)}>
                <Text style={styles.columnHeaderTxt}>{Gcolumn + " "}
                  {GSelectedColumn === Gcolumn && <MaterialCommunityIcons
                    name={GDirection === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"}
                  />
                  }
                </Text>
              </TouchableOpacity>
            )
          }
        })
      }
    </View>
  )
  //Guest end
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])
  return (

    <View>

      <Traffic />

      <View>
        <View style={{ marginHorizontal: 30 }}>
          <View>
            <Text style={styles.text}>
              {'Current Available \nNormal Lots'}
            </Text>

            <View style={{ marginBottom: 10 }} flexDirection="row">
              <Progress.Bar progress={0.5} height={15} width={300} color='#694BBE' borderWidth={3} />
              <Text style={styles.text2}>
                30/60
              </Text>
            </View>

          </View>
          <View>
            <Text style={styles.text}>
              {'Current Available\nHandicapped Lots'}
            </Text>
            <View flexDirection="row">
              <Progress.Bar progress={0.6} height={15} width={300} color='#694BBE' borderWidth={3} />
              <Text style={styles.text2}>
                3/5
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.switchbar}>
          <Text style={styles.switchtext}>
            {"Invited\nGuest"}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#767577' }}
            thumbColor={isEnabled ? '#694BBE' : '#694BBE'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text style={styles.switchtext}>
            {"Over\nStays"}
          </Text>
        </View>
        {isEnabled
          ?
          <View style={styles.Tablee}>
            <Text style={styles.TableTitle}>
              {'Cars Overstays'}
            </Text>
            <FlatList
              data={Extended}
              style={{ width: "100%" }}
              keyExtractor={(item, index) => index + ""}
              ListHeaderComponent={ExHeader}
              stickyHeaderIndices={[0]}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ ...styles.tableRow, backgroundColor: index % 2 == 1 ? "#cebdff" : "white" }}>
                    <Text style={{ ...styles.columnRowTxt, fontWeight: "bold" }}>{item.Vehicle}</Text>
                    <Text style={styles.columnRowTxt}>{item.Duration}</Text>
                  </View>
                )
              }}
            />
          </View>
          :
          <View style={styles.Tablee}>
            <Text style={styles.TableTitle}>
              {'Invited Guests'}
            </Text>
            {(Guests.length > 0)
              ? <FlatList
                data={Guests}
                style={{ width: "100%" }}
                keyExtractor={(item, index) => index + ""}
                ListHeaderComponent={GHeader}
                stickyHeaderIndices={[0]}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ ...styles.tableRow, backgroundColor: index % 2 == 1 ? "#cebdff" : "white" }}>
                      <Text style={{ ...styles.columnRowTxt, fontWeight: "bold" }}>{item.VRN}</Text>
                      <Text style={styles.columnRowTxt}>{item.Guest}</Text>
                      <Text style={styles.columnRowTxt}>{item.Time}</Text>
                      <Text style={styles.columnRowTxt}>{item.Host}</Text>
                    </View>
                  )
                }}
              />
              : <View style={styles.center}>
                <Text style={styles.textcenter}>  No more guests for the rest of the day</Text>
              </View>}
          </View>
        }

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  Tablee: {
    marginHorizontal: 20
  },
  TableTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center'
  },
  icon: {
    padding: 20,
  },
  switchbar: {
    marginTop: 40,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchtext: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 32,
  },
  head: {
    height: 60,
    backgroundColor: '#f1f8ff',
  },
  texttable: {
    textAlign: 'center',
    fontSize: 20
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 15,
  },

  text2: {
    marginLeft: 5,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 15,
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#694BBE",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50
  },
  tableRow: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: 'center'
  },
  columnHeader: {
    width: "20%",
    alignItems: "center"
  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "bold",
  },
  columnRowTxt: {
    width: "20%",
    textAlign: "center",
  },
  center: {
    alignItems: "center",
    padding: 20

  },
  textcenter: {
    fontWeight: 'bold',
    fontSize: 15,

  }
});

export default Dashboard;