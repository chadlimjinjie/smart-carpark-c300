import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ScrollView, FlatList, Dimensions } from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CreateTextInput } from './InputCollection';
import Tooltip from 'react-native-walkthrough-tooltip';
import { LineChart } from "react-native-chart-kit";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import * as api from '../api/api';
import { render } from 'react-dom';



export const IncomeReport = ({ navigation }) => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const [start, setStart] = useState(true);
    const [entries, setEntries] = useState([]);
    const [date, setDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
    const [showDate, setShowDate] = useState(date.toISOString().slice(0, 10));
    const [startOfWeek, setStartOfWeek] = useState();
    const [endOfWeek, setEndOfWeek] = useState();
    const [month, setMonth] = useState(new Date());
    const [nameOfMonth, setNameOfMonth] = useState(monthNames[month.getMonth()]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [entryFee, setEntryFee] = useState();
    const [intervalFee, setIntervalFee] = useState();
    const [intervalTime, setIntervalTime] = useState();
    const [total, setTotal] = useState(0);
    const [dataPointsMorning, setDataPointsMorning] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [dataPointsEvening, setDataPointsEvening] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [dataPointsNight, setDataPointsNight] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [dataPointsWeek, setDataPointsWeek] = useState([0, 0, 0, 0, 0, 0, 0])


    //console.log(month);

    const [sortBy, setSortBy] = useState(1) // 1 = Today, 2 = Week, 3 = Month

    if (start) {
        setDataPointsMorning([0, 0, 0, 0, 0, 0, 0, 0]);
        api.getPricing().then(data => {
            if (data.check) {
                setEntryFee(data.entry_fee)
                setIntervalFee(data.interval_fee)
                var holdDate = new Date(data.interval_time)
                console.log(holdDate)
                setIntervalTime(holdDate.getHours())
                console.log(holdDate.getHours())
                holdDate.setDate(holdDate.getDate() + 1)
                getEntries(holdDate.toISOString().slice(0, 10));
            }
        });

        setStart(false);
    }

    function getEntries(sendDate) {
        setDataPointsMorning([0, 0, 0, 0, 0, 0, 0, 0]);
        api.getCarEntries(sendDate).then(data => {
            setEntries(data);
            setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 1)
            setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 2)
            setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 3)
            api.getBalance(data).then(data => {
                setTotal(data.balance.toFixed(2))
            });
        })
    }

    function backDate() {
        setDataPointsMorning([0, 0, 0, 0, 0, 0, 0, 0]);
        if (sortBy == 1) {
            var previousDate = date;
            previousDate.setDate(previousDate.getDate() - 1);
            setDate(previousDate);
            setShowDate(previousDate.toISOString().slice(0, 10));
            getEntries(previousDate.toISOString().slice(0, 10));
        }
        if (sortBy == 2) {
            var startDate = new Date(startOfWeek);
            startDate.setDate(startDate.getDate() - 1);
            var previousWeek = startDate.toISOString().slice(0, 10);
            //console.log(previousWeek);
            getWeek(previousWeek);
        }
        if (sortBy == 3) {
            var previousMonth = month;
            previousMonth.setMonth(previousMonth.getMonth() - 1);
            setMonth(previousMonth)
            setNameOfMonth(monthNames[previousMonth.getMonth()])
            setYear(previousMonth.getFullYear());
            getMonth((previousMonth.getMonth() + 1), (previousMonth.getFullYear()));
        }

    }

    function forwardDate() {
        setDataPointsMorning([0, 0, 0, 0, 0, 0, 0, 0]);
        if (sortBy == 1) {
            var nextDate = date;
            nextDate.setDate(nextDate.getDate() + 1);
            setDate(nextDate);
            setShowDate(nextDate.toISOString().slice(0, 10));
            getEntries(nextDate.toISOString().slice(0, 10));
        }
        if (sortBy == 2) {
            var startDate = new Date(endOfWeek);
            startDate.setDate(startDate.getDate() + 1);
            var nextWeek = startDate.toISOString().slice(0, 10);
            getWeek(nextWeek);
        }
        if (sortBy == 3) {
            var previousMonth = month;
            previousMonth.setMonth(previousMonth.getMonth() + 1);
            setMonth(previousMonth)
            setNameOfMonth(monthNames[previousMonth.getMonth()])
            setYear(previousMonth.getFullYear());
            getMonth((previousMonth.getMonth() + 1), (previousMonth.getFullYear()));
        }

    }

    function getWeek(checkDate) {
        api.getWeek(checkDate).then(data => {
            //console.log(data.start);
            //console.log(data.end);
            setStartOfWeek(data.start);
            setEndOfWeek(data.end);
            api.getWeekCarEntries(data.start, data.end).then(data => {
                setEntries(data);
                //setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 1)
                //setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 2)
                //setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 3)
                setGraphDataWeek([0, 0, 0, 0, 0, 0, 0], data, 0)
                api.getBalance(data).then(data => {
                    setTotal(data.balance.toFixed(2))
                });
            })

        });
    }

    function getMonth(month, year) {
        api.getMonthCarEntries(month, year).then(data => {
            //console.log(data);
            setEntries(data);
            setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 1)
            setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 2)
            setGraphDataToday([0, 0, 0, 0, 0, 0, 0, 0], data, 0, 3)
            api.getBalance(data).then(data => {
                setTotal(data.balance.toFixed(2))
            });
        })
    }

    function setSort(num) {
        if (sortBy == num) {
            return;
        }
        setSortBy(num);
        setDataPointsMorning([0, 0, 0, 0, 0, 0, 0, 0]);
        if (num == 1) {
            setTotal(0);

            setShowDate(currentDate);
            getEntries(currentDate);
        }
        if (num == 2) {
            setTotal(0);
            getWeek(currentDate);

        }
        if (num == 3) {
            setTotal(0);

            setNameOfMonth(monthNames[new Date().getMonth()]);
            setYear(new Date().getFullYear());
            setMonth(new Date());
            //console.log(month)
            //console.log(month.getMonth() + 1)
            getMonth((new Date().getMonth() + 1), (new Date().getFullYear()));
        }
    }

    function calculatePrice(item) {
        const holdDate = new Date(item.date_of_entry.slice(0, 10))
        holdDate.setDate(holdDate.getDate() + 1)

        const split_entry_time = item.entry_time.split(":");
        const split_exit_time = item.exit_time.split(":");

        var setting_entry_time = new Date(holdDate);
        var setting_exit_time = new Date(holdDate);

        if (split_entry_time[0].charAt(0) == '0') {
            split_entry_time[0] = split_entry_time[0].slice(1, 2);
        }
        if (split_entry_time[1].charAt(0) == '0') {
            split_entry_time[1] = split_entry_time[1].slice(1, 2);
        }

        if (split_exit_time[0].charAt(0) == '0') {
            split_exit_time[0] = split_exit_time[0].slice(1, 2);
        }
        if (split_exit_time[1].charAt(0) == '0') {
            split_exit_time[1] = split_exit_time[1].slice(1, 2);
        }

        const entry_hour = split_entry_time[0] - 16
        const exit_hour = split_exit_time[0] - 16

        setting_entry_time.setHours(entry_hour, split_entry_time[1], split_entry_time[2])
        setting_exit_time.setHours(exit_hour, split_exit_time[1], split_exit_time[2])

        var s_time = setting_entry_time.toISOString().slice(11, 16)
        var e_time = setting_exit_time.toISOString().slice(11, 16)

        var duration = setting_exit_time - setting_entry_time;

        var difference = new Date(duration);

        var diff_hours = difference.getHours() - 8;
        var diff_mins = difference.getMinutes();

        var diff_hours = (Math.abs(duration) / (60 * 60 * 1000)) | 0;

        var price = entryFee + intervalFee * (diff_hours * parseInt(intervalTime));

        return price.toFixed(2);


    }

    function setGraphDataToday(points, item, step, type) {
        console.log(type);
        if (typeof (item) == 'undefined' || (item.length == step)) {
            if (type == 1) {
                setDataPointsMorning(points);
            } else if (type == 2) {
                setDataPointsEvening(points);
            } else if (type == 3) {
                setDataPointsNight(points);
            }
            return;
        } else {
            const split_entry_time = item[step].entry_time.split(":");
            const split_exit_time = item[step].exit_time.split(":");

            if (split_entry_time[0].charAt(0) == '0') {
                split_entry_time[0] = split_entry_time[0].slice(1, 2);
            }
            if (split_exit_time[0].charAt(0) == '0') {
                split_exit_time[0] = split_exit_time[0].slice(1, 2);
            }

            if (type == 1) {
                for (var i = 5; i < 13; i++) {
                    if (i < 10) {
                        var time = "0" + i;
                    } else {
                        var time = "" + i;
                    }
                    if (parseInt(split_entry_time[0]) <= parseInt(time)) {
                        if (parseInt(split_exit_time[0]) >= parseInt(time)) {
                            points[i - 5] = points[i - 5] + 1;

                        }
                    }
                }
            } else if (type == 2) {
                var count = 0;
                for (var i = 13; i < 21; i++) {
                    if (i < 10) {
                        var time = "0" + i;
                    } else {
                        var time = "" + i;
                    }
                    if (parseInt(split_entry_time[0]) <= parseInt(time)) {
                        if (parseInt(split_exit_time[0]) >= parseInt(time)) {
                            points[count] = points[count] + 1;

                        }
                    }
                    count += 1;
                }
            } else if (type == 3) {
                var count = 0;
                for (var i = -3; i < 5; i++) {
                    if (i < 10) {
                        if (i == -3) {
                            var time = "" + 21;
                        } else if (i == -2) {
                            var time = "" + 22;
                        } else if (i == -1) {
                            var time = "" + 23;
                        } else if (i == 0) {
                            var time = "" + 24;
                        } else {
                            var time = "0" + i;
                        }
                    } else {
                        var time = "" + i;
                    }
                    if (parseInt(split_entry_time[0]) <= parseInt(time)) {
                        if (parseInt(split_exit_time[0]) >= parseInt(time)) {
                            points[count] = points[count] + 1;

                        }
                    }
                    count++;
                }
            }
            setGraphDataToday(points, item, step + 1, type);
        }

    }

    function setGraphDataWeek(points, item, step) {
        //points[0, 0, 0, 0, 0, 0, 0]
        //console.log(type);
        console.log("Hello There!")
        if (typeof (item) == 'undefined' || (item.length == step)) {
            setDataPointsWeek(points);
            return;
        } else {
            //const split_entry_time = item[step].entry_time.split(":");
            //const split_exit_time = item[step].exit_time.split(":");
            const holdDate = new Date(item[step].date_of_entry.slice(0, 10))
            holdDate.setDate(holdDate.getDate() + 1)
            console.log(holdDate.getDay());
            switch (holdDate.getDay()) {
                case 0:
                    points[0] = points[0] + 1;
                    break;
                case 1:
                    points[1] = points[1] + 1;
                    break;
                case 2:
                    points[2] = points[2] + 1;
                    break;
                case 3:
                    points[3] = points[3] + 1;
                    break;
                case 4:
                    points[4] = points[4] + 1;
                    break;
                case 5:
                    points[5] = points[5] + 1;
                    break;
                case 6:
                    points[6] = points[6] + 1;
                    break;
            }


            setGraphDataWeek(points, item, step + 1);
        }

    }

    function setGraphDataWeek(points, item, step) {
        //points[0, 0, 0, 0, 0, 0, 0]
        //console.log(type);
        console.log("Hello There!")
        if (typeof (item) == 'undefined' || (item.length == step)) {
            setDataPointsWeek(points);
            return;
        } else {
            //const split_entry_time = item[step].entry_time.split(":");
            //const split_exit_time = item[step].exit_time.split(":");
            const holdDate = new Date(item[step].date_of_entry.slice(0, 10))
            holdDate.setDate(holdDate.getDate() + 1)
            console.log(holdDate.getDay());
            switch (holdDate.getDay()) {
                case 0:
                    points[0] = points[0] + 1;
                    break;
                case 1:
                    points[1] = points[1] + 1;
                    break;
                case 2:
                    points[2] = points[2] + 1;
                    break;
                case 3:
                    points[3] = points[3] + 1;
                    break;
                case 4:
                    points[4] = points[4] + 1;
                    break;
                case 5:
                    points[5] = points[5] + 1;
                    break;
                case 6:
                    points[6] = points[6] + 1;
                    break;
            }


            setGraphDataWeek(points, item, step + 1);
        }

    }

    function swipeRight() {
        return (
            <LineChart
                data={{
                    labels: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
                    datasets: [
                        {
                            data: dataPointsEvening,
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 16} // from react-native
                height={220}
                fromZero={true}
                chartConfig={{
                    backgroundColor: '#694BBE',
                    backgroundGradientFrom: '#694BBE',
                    backgroundGradientTo: '#694BBE',
                    strokeWidth: 2,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                style={{
                    marginBottom: 10,
                    borderRadius: 16,
                }}
            />
        )
    }

    function swipeLeft() {
        return (
            <LineChart
                data={{
                    labels: ['21:00', '22:00', '23:00', '24:00', '01:00', '02:00', '03:00', '04:00'],
                    datasets: [{ data: dataPointsNight, },],
                }}
                width={Dimensions.get('window').width - 16} // from react-native
                height={220}
                fromZero={true}
                chartConfig={{
                    backgroundColor: '#694BBE',
                    backgroundGradientFrom: '#694BBE',
                    backgroundGradientTo: '#694BBE',
                    strokeWidth: 2,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                style={{
                    marginBottom: 10,
                    borderRadius: 16,
                }}
            />
        )
    }


    const renderItem = ({ item }) => {
        const id = item.car_entry_id
        const vehicle_number = item.vehicle_number;
        const holdDate = new Date(item.date_of_entry.slice(0, 10))
        holdDate.setDate(holdDate.getDate() + 1)
        const date_of_entry = holdDate.toISOString().slice(0, 10);


        const split_entry_time = item.entry_time.split(":");
        const split_exit_time = item.exit_time.split(":");

        const setting_entry_time = new Date();
        const setting_exit_time = new Date();

        const entry_time = item.entry_time.slice(0, 5);
        const exit_time = item.exit_time.slice(0, 5);
        //console.log('This Should only be done once')
        const price = calculatePrice(item);

        //console.log(entry_time);
        //setGraphData(item);

        //<Text style={{fontSize: 20, marginBottom: 10, lineHeight: 25}}>{`VRN: ${vehicle_number}\nDate: ${date_of_entry}\nEntry Time: ${entry_time}\nExit Time: ${exit_time}`}</Text>
        return (
            <View style={{ alignSelf: 'center', width: '100%', }}>
                <View style={{ width: '90%', alignSelf: 'center', borderWidth: 1, borderRadius: 10, padding: 5, marginBottom: 7, backgroundColor: '#694BBE' }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={{ marginRight: 'auto', fontSize: 25, color: 'white' }}>{`VRN: ${vehicle_number}`}</Text>
                        <Text style={{ marginLeft: 'auto', fontSize: 25, color: 'white' }}>{`$${price} `}</Text>
                    </View>
                    <View style={{
                        backgroundColor: 'white', width: '103.5%', alignSelf: 'center', borderBottomWidth: 1,
                        borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderWidth: 1, top: 6
                    }}>
                        <Text style={{ fontSize: 20, marginBottom: 10, lineHeight: 25, paddingLeft: 5 }}>{`Date: ${date_of_entry}\nEntry Time: ${entry_time}\nExit Time: ${exit_time}`}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.screen}>
                <FlatList data={entries} renderItem={renderItem} keyExtractor={item => item.car_entry_id.toString()} showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: '#694BBE' }}>
                                <Text style={{ width: '100%', height: 55, textAlign: 'center', fontSize: 30, color: 'white', fontWeight: 'bold', marginTop: 5 }}>Income Report</Text>
                                <View style={{ flexDirection: 'row', width: '100%', alignContent: 'center', justifyContent: 'center', marginBottom: 10, bottom: 5 }}>
                                    <TouchableOpacity style={{ width: '25%', height: 25, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} onPress={() => setSort(1)}><Text style={{ textAlign: 'center', fontSize: 18, color: '#694BBE' }}>Day</Text></TouchableOpacity>
                                    <TouchableOpacity style={{ width: '25%', height: 25, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontSize: 18, color: '#694BBE' }} onPress={() => setSort(2)}>Week</Text></TouchableOpacity>
                                    <TouchableOpacity style={{ width: '25%', height: 25, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', justifyContent: 'center', borderTopRightRadius: 10, borderBottomRightRadius: 10 }} onPress={() => setSort(3)}><Text style={{ textAlign: 'center', fontSize: 18, color: '#694BBE' }}>Month</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, backgroundColor: 'white' }}>
                                <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => backDate()}><MaterialIcons name="keyboard-arrow-left" size={40} color="black" /></TouchableOpacity>

                                {sortBy == 1 ?
                                    <Text style={{ fontSize: 25, color: 'black' }}>{showDate}</Text>
                                    : null}
                                {sortBy == 2 ?
                                    <Text style={{ fontSize: 23, color: 'black' }}>{startOfWeek} - {endOfWeek}</Text>
                                    : null}
                                {sortBy == 3 ?
                                    <Text style={{ fontSize: 23, color: 'black' }}>{nameOfMonth} {month.getFullYear()}</Text>
                                    : null}
                                <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={() => forwardDate()}><MaterialIcons name="keyboard-arrow-right" size={40} color="black" /></TouchableOpacity>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', marginTop: 10, backgroundColor: 'white' }}>

                                <Text style={{ fontSize: 25 }}>Total Earnings</Text>
                                <Text style={{ fontSize: 35, fontWeight: 'bold', color: '#694BBE' }}>{`$${total}`}</Text>
                                <Text style={{ fontSize: 15, color: 'black', opacity: 0.7, marginBottom: 20 }}>{showDate}</Text>
                                <View style={{ width: '20%', height: 1, marginBottom: 5, backgroundColor: 'black', opacity: 0.6 }} />
                                <View style={{ width: '100%', height: 2, backgroundColor: 'black', marginBottom: 10, opacity: 0.6 }} />

                                {sortBy == 1 ?
                                    <Swipeable renderRightActions={swipeRight} renderLeftActions={swipeLeft}>
                                        <LineChart
                                            data={{
                                                labels: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
                                                datasets: [
                                                    {
                                                        data: dataPointsMorning,
                                                    },
                                                ],
                                            }}
                                            width={Dimensions.get('window').width - 16} // from react-native
                                            height={220}
                                            fromZero={true}
                                            chartConfig={{
                                                backgroundColor: '#694BBE',
                                                backgroundGradientFrom: '#694BBE',
                                                backgroundGradientTo: '#694BBE',
                                                strokeWidth: 2,
                                                decimalPlaces: 0, // optional, defaults to 2dp
                                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                                            }}
                                            style={{
                                                marginBottom: 10,
                                                borderRadius: 16,
                                            }}
                                        />
                                    </Swipeable>
                                    :
                                    null
                                }
                                {sortBy == 2 ?
                                    <LineChart
                                        data={{
                                            labels: ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'],
                                            datasets: [
                                                {
                                                    data: dataPointsWeek,
                                                },
                                            ],
                                        }}
                                        width={Dimensions.get('window').width - 16} // from react-native
                                        height={220}
                                        fromZero={true}
                                        chartConfig={{
                                            backgroundColor: '#694BBE',
                                            backgroundGradientFrom: '#694BBE',
                                            backgroundGradientTo: '#694BBE',
                                            strokeWidth: 2,
                                            decimalPlaces: 0, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                                        }}
                                        style={{
                                            marginBottom: 10,
                                            borderRadius: 16,
                                        }}
                                    />
                                    :
                                    null
                                }






                            </View>

                        </View>
                    } />
            </View>

        </View>

    )

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: 'black',
    },
    screen: {
        flex: 1,
        marginTop: 25,
        width: '100%',
        backgroundColor: 'white'
    }


});