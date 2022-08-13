import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ScrollView, SafeAreaView } from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { CreateTextInput } from './InputCollection';
import * as api from '../api/api';
import { useFocusEffect } from '@react-navigation/native'

var ip = "https://c300-final.azurewebsites.net"
export const ManagerSettingForm = (props) => {

    var data = props.data;

    const [isLoading, setIsLoading] = useState(false);
    const [testData, setTestData] = useState({});

    // make an API call to get the data 
    const getData = async () => {

        //The data will retrieve from the URL
        //The URL retrieved all the data from the database
        const response = await fetch(ip + '/api/CarparkFee');

        const myJson = await response.json(); //extract JSON from the http response
        // change the state of isLoading
        setIsLoading(true);

        // change the state of testData
        //(the reason of using setIsLoading,setTestData etc is because in react, we cannot change value of variable directly like
        // testData = newData; otherwise it will not reflect the latest value, we have to use the setter setTestData, what this does is it notifies the reactjs system that there 
        // has been a change in the state a.k.a the value of the variable, and request it to update the view/frontend

        setTestData(myJson[0]);
        return myJson[0];
    };

    const getData2 = async () => {

        const response2 = await fetch(ip + '/api/Roles');

        const myJson2 = await response2.json();

        setIsLoading(true)

        setTestData(myJson2[0]);

        return myJson2;
    };

    //Used var instead of const so that the value can be change   

    const [EntryFee, onChangeEntryFee] = useState("");
    const [IntervalFee, onChangeIntervalFee] = useState("");
    const [Intervalmode, setIntervalMode] = useState('time');
    const [Intervalshow, setIntervalShow] = useState(false);
    const [Intervaltime, setIntervalDate] = useState(new Date(1598051730000));
    const [Buffermode, setBufferMode] = useState('time');
    const [Buffershow, setBufferShow] = useState(false);
    const [Buffertime, setBufferDate] = useState(new Date(1598051730000));



    const onChangeIntervalTime = (event, selectedIntervalTime) => {


        const IntervalTime = selectedIntervalTime || Intervaltime;
        setIntervalShow(false);
        setIntervalDate(IntervalTime);

        console.log(IntervalTime);
        console.log(selectedIntervalTime);
    };


    const showIntervalMode = (currentIntervalMode) => {
        setIntervalShow(true);
        setIntervalMode(currentIntervalMode);
    };

    const showIntervalTimepicker = () => {
        showIntervalMode('time');
    };


    const onChangeBufferTime = (event, selectedBufferTime) => {


        const BufferTime = selectedBufferTime || Buffertime;
        setBufferShow(false);
        setBufferDate(BufferTime);

        console.log(BufferTime);
        console.log(selectedBufferTime);


    };


    const showBufferMode = (currentBufferMode) => {
        setBufferShow(true);
        setBufferMode(currentBufferMode);
    };

    const showBufferTimepicker = () => {
        showBufferMode('time');
    };


    const [User1, onChangeUser1] = useState("");
    const [User2, onChangeUser2] = useState("");
    const [User3, onChangeUser3] = useState("");

    const [trafficThreshold, setTrafficThreshold] = useState("");
    const [isValidThreshold, setIsValidThreshold] = useState(false);
    function checkNumber(text) {
        console.log(!isNaN(text));
        return !isNaN(text);
    }

    const [EntryFeeValidate, onChangeEntryFeeValidate] = useState(true);
    const [IntervalFeeValidate, onChangeIntervalFeeValidate] = useState(true);
    const [User1Validate, onChangeUser1Validate] = useState(true);
    const [User2Validate, onChangeUser2Validate] = useState(true);
    const [User3Validate, onChangeUser3Validate] = useState(true);
    const [disabled, onChangeDisabled] = useState(true);
    const [editable, setEditable] = useState(false);

    const [IntervalToolTipVisible, setIntervalToolTipVisible] = useState(false);
    const [BufferToolTipVisible, setBufferToolTipVisible] = useState(false);

    const [Btn1Show, setBtn1Show] = useState(false);
    const [Btn2Show, setBtn2Show] = useState(false);
    const [Btn3Show, setBtn3Show] = useState(false);


    function formEditable() {
        if (editable) {
            setEditable(false);
            onChangeDisabled(true);

        }
        else {
            setEditable(true);
            onChangeDisabled(false);

        }

    }

    function FirstUserValidate(input) {
        const guest = /^[a-zA-Z]+$/
        if (guest.test(input)) {
            return true;
        }
        else {
            return false;
        }
    }


    function SecondUserValidate(input) {
        const guest = /^[a-zA-Z]+$/
        if (guest.test(input)) {
            return true;
        }
        else {
            return false;
        }
    }


    function ThirdUserValidate(input) {
        const guest = /^[a-zA-Z]+$/
        if (guest.test(input)) {
            return true;
        }
        else {
            return false;
        }
    }


    function EFValidate(input) {

        const numeric = /^[+-]?\d+(\.\d+)?$/

        if (numeric.test(input)) {
            return true;
        }

        else {
            return false;
        }
    }


    function IFValidate(input) {

        const numeric = /^[+-]?\d+(\.\d+)?$/

        if (numeric.test(input)) {
            return true;
        }

        else {
            return false;
        }
    }


    function saveCarParkFeeSettings() {

        if (editable) {

            // insert data only when the form become not editable

            api.saveCarParkFeeSettings(EntryFee, IntervalFee, Intervaltime, Buffertime, trafficThreshold).then(data => {
                console.log(data);

                if (data != null) {
                    console.log('Successfully Inserted')
                } else {
                    console.log('Failed to insert')
                }
            })
        }
    }

    function updateGuestRole1() {

        if (editable) {
            console.log('user1 >', User1);

            api.updateGuestRole1(User1).then(data => {

                console.log(data);
                if (data != null) {
                    console.log('Successfully Inserted')
                } else {
                    console.log('Failed to insert')
                }
            })
        }
    }

    function updateGuestRole2() {

        if (editable) {

            api.updateGuestRole2(User2).then(data => {

                console.log(data);
                if (data != null) {
                    console.log('Successfully Inserted')
                } else {
                    console.log('Failed to insert')
                }
            })
        }
    }

    function updateGuestRole3() {

        if (editable) {

            api.updateGuestRole3(User3).then(data => {

                console.log(data);
                if (data != null) {
                    console.log('Successfully Inserted')
                } else {
                    console.log('Failed to insert')
                }
            })
        }
    }


    function MultipleFunctions() {
        formEditable();
        saveCarParkFeeSettings();
        updateGuestRole1();
        updateGuestRole2();
        updateGuestRole3();

    }



    // this function is similar to componentDidMount , it runs the function once after the components are ready
    // https://reactjs.org/docs/hooks-effect.html
    // so it will call the api once to get data that we use in the form
    useEffect(() => {
        var data = getData();
        data.then((d) => {

            console.log(d);

            // these functions is to update the variables
            setIsLoading(true);
            onChangeEntryFee(d['entry_fee'].toString());
            onChangeIntervalFee(d['interval_fee'].toString());
            setIntervalDate(new Date(Date.parse(d['interval_time'])));
            setBufferDate(new Date(Date.parse(d['buffer_time'])));
            console.log(new Date(Date.parse(d['buffer_time'])));
            console.log(new Date(Date.parse(d['interval_time'])));
            setTrafficThreshold(d["traffic_threshold"]);

        })
    }, []);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         var data = getData();
    //         data.then((d) => {

    //             console.log(d);

    //             // these functions is to update the variables
    //             setIsLoading(true);
    //             onChangeEntryFee(d['entry_fee'].toString());
    //             onChangeIntervalFee(d['interval_fee'].toString());
    //             setIntervalDate(new Date(Date.parse(d['interval_time'])));
    //             setBufferDate(new Date(Date.parse(d['buffer_time'])));
    //             console.log(new Date(Date.parse(d['buffer_time'])));
    //             console.log(new Date(Date.parse(d['interval_time'])));


    //         })
    //     }, [])


    // );

    useEffect(() => {
        var data = getData2();
        data.then((d) => {



            setIsLoading(true);
            onChangeUser1(d[0]['role_name']);
            onChangeUser2(d[1]['role_name']);
            onChangeUser3(d[2]['role_name']);


        })
    }, []);

    var loadedForm = null

    // this check is to check whether the data from the API call is ready, if it is, render the form, if not don't show anything yet
    if (isLoading === true) {
        loadedForm = (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}>
                            <Text style={styles.textHeader}>Car Park Settings Form</Text>
                        </View>

                        <View style={styles.footer}>

                            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                                <TouchableOpacity
                                    style={styles.HideShowBtn}
                                    onPress={() => setBtn1Show(!Btn1Show)}
                                >
                                    <View style={{ flexDirection: 'row' }}></View>
                                    <MaterialIcons name="drive-eta" color='white' size={20}>
                                    </MaterialIcons>

                                    <Text style={styles.HideShowBtnText}>Car Park Fee and Time Settings</Text>
                                </TouchableOpacity>
                            </View>


                            {Btn1Show ? (
                                <View style={styles.FeeSettings}>
                                    <CreateTextInput
                                        style={styles.Label}
                                        value={EntryFee}
                                        editable={editable}
                                        nameOfInput={"Entry Fee Per Hour"}
                                        iconType={"person"} toolTipText={"The charging fee that occurs during the first hour entry of carpark"}
                                        inputFunction={onChangeEntryFee}
                                        confirmInputFunction={EFValidate}
                                        validationFunction={EFValidate}

                                    />

                                    <CreateTextInput
                                        style={styles.Label}
                                        value={IntervalFee}
                                        editable={editable}
                                        nameOfInput={"Interval Fee Per Hour"}
                                        iconType={"person"} toolTipText={"The charging fee that charges in between the reservation timing after the first hour"}
                                        inputFunction={onChangeIntervalFee}
                                        confirmInputFunction={IFValidate}
                                        validationFunction={IFValidate}
                                    />

                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 10, marginBottom: 10 }}>
                                            <View style={{ paddingBottom: 2, paddingTop: 50, paddingLeft: 20 }}>
                                                <MaterialIcons name="timer" color='black' size={20} />
                                            </View>
                                            <Text style={styles.IntervalTimeLabel}>Interval Time</Text>
                                            <View style={{ marginLeft: '1%' }}>
                                                <Tooltip
                                                    arrowSize={{ width: 15, height: 8 }}
                                                    backgroundColor="rgba(0,0,0,0.5)"
                                                    isVisible={IntervalToolTipVisible}
                                                    content={<Text style={styles.DescripText}>The total usage of time for all the carpark slots</Text>}
                                                    placement="top"
                                                    topAdjustment={-18}
                                                    onClose={() => setIntervalToolTipVisible(false)}
                                                >
                                                    <View style={{ paddingTop: 25 }}>
                                                        <TouchableOpacity onPress={() => setIntervalToolTipVisible(true)}>
                                                            <MaterialIcons name="info-outline" size={20} color={IntervalToolTipVisible ? 'white' : 'red'} />
                                                        </TouchableOpacity>
                                                    </View>

                                                </Tooltip>
                                            </View>
                                        </View>


                                        <View>
                                            <TouchableOpacity style={styles.IntervalTimePicker} onPress={showIntervalTimepicker}>
                                                <Text style={styles.HideShowBtnText}>Select a Time</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {Intervalshow && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={Intervaltime}
                                                mode={Intervalmode}
                                                is24Hour={true}
                                                display="default"
                                                disabled={true}
                                                onChange={onChangeIntervalTime}
                                            />
                                        )}


                                        <View>
                                            <Text style={styles.IntervalTimeInput}>
                                                {Intervaltime.getHours()} h {Intervaltime.getMinutes()} min
                                            </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 10, marginBottom: 10 }}>
                                            <View style={{ paddingTop: 160, paddingLeft: 20 }}>
                                                <MaterialIcons name="timer" color='black' size={20} />
                                            </View>
                                            <Text style={styles.BufferTimeLabel}>Buffer Times</Text>
                                            <View style={{ marginLeft: '1%' }}>
                                                <Tooltip
                                                    arrowSize={{ width: 15, height: 8 }}
                                                    backgroundColor="rgba(0,0,0,0.5)"
                                                    isVisible={BufferToolTipVisible}
                                                    content={<Text style={styles.DescripText}>The extra time given to the car park user and apply to both reservation start and end time</Text>}
                                                    placement="top"
                                                    topAdjustment={-18}
                                                    onClose={() => setBufferToolTipVisible(false)}
                                                >
                                                    <View style={{ paddingTop: 140 }}>
                                                        <TouchableOpacity onPress={() => setBufferToolTipVisible(true)}>
                                                            <MaterialIcons name="info-outline" size={20} color={BufferToolTipVisible ? 'white' : 'red'} />
                                                        </TouchableOpacity>
                                                    </View>

                                                </Tooltip>
                                            </View>
                                        </View>



                                        <View>
                                            <TouchableOpacity style={styles.BufferTimePicker} onPress={showBufferTimepicker}>
                                                <Text style={styles.HideShowBtnText}>Select a Time</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {Buffershow && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={Buffertime}
                                                mode={Buffermode}
                                                is24Hour={true}
                                                display="default"
                                                disabled={true}
                                                onChange={onChangeBufferTime}
                                            />
                                        )}


                                        <View>
                                            <Text style={styles.BufferTimeInput}>
                                                {Buffertime.getHours()} h {Buffertime.getMinutes()} min
                                            </Text>
                                        </View>
                                    </View>


                                </View>
                            ) : null}

                            <View style={{ flexDirection: 'row', paddingTop: 120 }}>
                                <TouchableOpacity
                                    style={styles.HideShowBtn2}
                                    onPress={() => setBtn2Show(!Btn2Show)}
                                >
                                    <MaterialIcons name="person-add" color='white' size={20}>
                                    </MaterialIcons>
                                    <Text style={styles.HideShowBtnText}>Guest Role Settings</Text>

                                </TouchableOpacity>
                            </View>


                            {Btn2Show ? (
                                <View style={styles.RoleSettings}>
                                    <CreateTextInput
                                        style={styles.Label}
                                        value={User1}
                                        editable={editable}
                                        nameOfInput={"Guest Role 1"}
                                        iconType={"person"} toolTipText={"The first option of guest role which will be display in the reservation form"}
                                        inputFunction={onChangeUser1}
                                        confirmInputFunction={FirstUserValidate}
                                        validationFunction={FirstUserValidate}
                                    />

                                    <CreateTextInput
                                        style={styles.Label}
                                        value={User2}
                                        editable={editable}
                                        nameOfInput={"Guest Role 2"}
                                        iconType={"person"} toolTipText={"The second option of guest role which will be display in the reservation form"}
                                        inputFunction={onChangeUser2}
                                        confirmInputFunction={SecondUserValidate}
                                        validationFunction={SecondUserValidate}
                                    />

                                    <CreateTextInput
                                        style={styles.Label}
                                        value={User3}
                                        editable={editable}
                                        nameOfInput={"Guest Role 3"}
                                        iconType={"person"} toolTipText={"The third option of guest role which will be display in the reservation form"}
                                        inputFunction={onChangeUser3}
                                        confirmInputFunction={ThirdUserValidate}
                                        validationFunction={ThirdUserValidate}
                                    />
                                </View>
                            ) : null}

                            <View style={{ flexDirection: 'row', paddingTop: 100 }}>
                                <TouchableOpacity
                                    style={styles.HideShowBtn3}
                                    onPress={() => setBtn3Show(!Btn3Show)}
                                >
                                    <MaterialIcons name="traffic" color='white' size={20}>
                                    </MaterialIcons>
                                    <Text style={styles.HideShowBtnText}>Traffic Settings</Text>

                                </TouchableOpacity>
                            </View>


                            {Btn3Show ? (
                                <View style={styles.TrafficSettings}>
                                    <CreateTextInput
                                        style={styles.Label}
                                        value={trafficThreshold}
                                        editable={editable}
                                        nameOfInput="Vehicle Threshold"
                                        iconType="track-changes"
                                        toolTipText="Minimum vehicles before detecting a traffic jam"
                                        inputFunction={setTrafficThreshold}
                                        confirmInputFunction={checkNumber}
                                        validationFunction={checkNumber}
                                    />

                                </View>
                            ) : null}



                        </View>
                    </ScrollView>

                    {editable
                        ? <TouchableOpacity style={styles.SaveBtn} onPress={MultipleFunctions}>
                            <MaterialIcons name="save" size={37} color="white" />
                        </TouchableOpacity>


                        : <TouchableOpacity style={styles.EditBtn} onPress={formEditable}>
                            <MaterialIcons name="mode-edit" size={37} color="white" />
                        </TouchableOpacity>}

                    {editable
                        ? <TouchableOpacity style={styles.EditBtn} onPress={formEditable}>
                            <MaterialIcons name="cancel" size={37} color="white" />
                        </TouchableOpacity>

                        : null}


                </View>
            </SafeAreaView>





        );

    }
    else if (isLoading === false) {

        loadedForm = (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}>
                            <Text style={styles.textHeader}>Car Park Settings Form</Text>
                        </View>

                        <View style={styles.footer}>

                            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                                <TouchableOpacity
                                    style={styles.HideShowBtn}
                                    onPress={() => setBtn1Show(!Btn1Show)}
                                >
                                    <View style={{ flexDirection: 'row' }}></View>
                                    <MaterialIcons name="drive-eta" color='white' size={20}>
                                    </MaterialIcons>

                                    <Text style={styles.HideShowBtnText}>Car Park Fee and Time Settings</Text>
                                </TouchableOpacity>
                            </View>


                            {Btn1Show ? (
                                <View style={styles.FeeSettings}>
                                    <CreateTextInput
                                        style={styles.Label}
                                        value={EntryFee}
                                        editable={editable}
                                        nameOfInput={"Entry Fee Per Hour"}
                                        iconType={"person"} toolTipText={"The charging fee that occurs during the first hour entry of carpark"}
                                        inputFunction={onChangeEntryFee}
                                        confirmInputFunction={EFValidate}
                                        validationFunction={EFValidate}

                                    />

                                    <CreateTextInput
                                        style={styles.Label}
                                        value={IntervalFee}
                                        editable={editable}
                                        nameOfInput={"Interval Fee Per Hour"}
                                        iconType={"person"} toolTipText={"The charging fee that charges in between the reservation timing after the first hour"}
                                        inputFunction={onChangeIntervalFee}
                                        confirmInputFunction={IFValidate}
                                        validationFunction={IFValidate}
                                    />

                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 10, marginBottom: 10 }}>
                                            <View style={{ paddingBottom: 2, paddingTop: 50, paddingLeft: 20 }}>
                                                <MaterialIcons name="timer" color='black' size={20} />
                                            </View>
                                            <Text style={styles.IntervalTimeLabel}>Interval Time</Text>
                                            <View style={{ marginLeft: '1%' }}>
                                                <Tooltip
                                                    arrowSize={{ width: 15, height: 8 }}
                                                    backgroundColor="rgba(0,0,0,0.5)"
                                                    isVisible={IntervalToolTipVisible}
                                                    content={<Text style={styles.DescripText}>The total usage of time for all the carpark slots</Text>}
                                                    placement="top"
                                                    topAdjustment={-18}
                                                    onClose={() => setIntervalToolTipVisible(false)}
                                                >
                                                    <View style={{ paddingTop: 25 }}>
                                                        <TouchableOpacity onPress={() => setIntervalToolTipVisible(true)}>
                                                            <MaterialIcons name="info-outline" size={20} color={IntervalToolTipVisible ? 'white' : 'red'} />
                                                        </TouchableOpacity>
                                                    </View>

                                                </Tooltip>
                                            </View>
                                        </View>


                                        <View>
                                            <TouchableOpacity style={styles.IntervalTimePicker} onPress={showIntervalTimepicker}>
                                                <Text style={styles.HideShowBtnText}>Select a Time</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {Intervalshow && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={Intervaltime}
                                                mode={Intervalmode}
                                                is24Hour={true}
                                                display="default"
                                                disabled={true}
                                                onChange={onChangeIntervalTime}
                                            />
                                        )}


                                        <View>
                                            <Text style={styles.IntervalTimeInput}>
                                                {Intervaltime.getHours()} h {Intervaltime.getMinutes()} min
                                            </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 10, marginBottom: 10 }}>
                                            <View style={{ paddingTop: 160, paddingLeft: 20 }}>
                                                <MaterialIcons name="timer" color='black' size={20} />
                                            </View>
                                            <Text style={styles.BufferTimeLabel}>Buffer Times</Text>
                                            <View style={{ marginLeft: '1%' }}>
                                                <Tooltip
                                                    arrowSize={{ width: 15, height: 8 }}
                                                    backgroundColor="rgba(0,0,0,0.5)"
                                                    isVisible={BufferToolTipVisible}
                                                    content={<Text style={styles.DescripText}>The extra time given to the car park user and apply to both reservation start and end time</Text>}
                                                    placement="top"
                                                    topAdjustment={-18}
                                                    onClose={() => setBufferToolTipVisible(false)}
                                                >
                                                    <View style={{ paddingTop: 140 }}>
                                                        <TouchableOpacity onPress={() => setBufferToolTipVisible(true)}>
                                                            <MaterialIcons name="info-outline" size={20} color={BufferToolTipVisible ? 'white' : 'red'} />
                                                        </TouchableOpacity>
                                                    </View>

                                                </Tooltip>
                                            </View>
                                        </View>



                                        <View>
                                            <TouchableOpacity style={styles.BufferTimePicker} onPress={showBufferTimepicker}>
                                                <Text style={styles.HideShowBtnText}>Select a Time</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {Buffershow && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={Buffertime}
                                                mode={Buffermode}
                                                is24Hour={true}
                                                display="default"
                                                disabled={true}
                                                onChange={onChangeBufferTime}
                                            />
                                        )}


                                        <View>
                                            <Text style={styles.BufferTimeInput}>
                                                {Buffertime.getHours()} h {Buffertime.getMinutes()} min
                                            </Text>
                                        </View>
                                    </View>


                                </View>
                            ) : null}

                            <View style={{ flexDirection: 'row', paddingTop: 120 }}>
                                <TouchableOpacity
                                    style={styles.HideShowBtn2}
                                    onPress={() => setBtn2Show(!Btn2Show)}
                                >
                                    <MaterialIcons name="person-add" color='white' size={20}>
                                    </MaterialIcons>
                                    <Text style={styles.HideShowBtnText}>Guest Role Settings</Text>

                                </TouchableOpacity>
                            </View>


                            {Btn2Show ? (
                                <View style={styles.RoleSettings}>
                                    <CreateTextInput
                                        style={styles.Label}
                                        value={User1}
                                        editable={editable}
                                        nameOfInput={"Guest Role 1"}
                                        iconType={"person"} toolTipText={"The first option of guest role which will be display in the reservation form"}
                                        inputFunction={onChangeUser1}
                                        confirmInputFunction={FirstUserValidate}
                                        validationFunction={FirstUserValidate}
                                    />

                                    <CreateTextInput
                                        style={styles.Label}
                                        value={User2}
                                        editable={editable}
                                        nameOfInput={"Guest Role 2"}
                                        iconType={"person"} toolTipText={"The second option of guest role which will be display in the reservation form"}
                                        inputFunction={onChangeUser2}
                                        confirmInputFunction={SecondUserValidate}
                                        validationFunction={SecondUserValidate}
                                    />

                                    <CreateTextInput
                                        style={styles.Label}
                                        value={User3}
                                        editable={editable}
                                        nameOfInput={"Guest Role 3"}
                                        iconType={"person"} toolTipText={"The third option of guest role which will be display in the reservation form"}
                                        inputFunction={onChangeUser3}
                                        confirmInputFunction={ThirdUserValidate}
                                        validationFunction={ThirdUserValidate}
                                    />
                                </View>
                            ) : null}

                            <View style={{ flexDirection: 'row', paddingTop: 100 }}>
                                <TouchableOpacity
                                    style={styles.HideShowBtn3}
                                    onPress={() => setBtn3Show(!Btn3Show)}
                                >
                                    <MaterialIcons name="traffic" color='white' size={20}>
                                    </MaterialIcons>
                                    <Text style={styles.HideShowBtnText}>Traffic Settings</Text>

                                </TouchableOpacity>
                            </View>


                            {Btn3Show ? (
                                <View style={styles.TrafficSettings}>
                                    <CreateTextInput
                                        style={styles.Label}
                                        value={trafficThreshold}
                                        editable={editable}
                                        nameOfInput="Vehicle Threshold"
                                        iconType="track-changes"
                                        toolTipText="Minimum vehicles before detecting a traffic jam"
                                        inputFunction={setTrafficThreshold}
                                        confirmInputFunction={checkNumber}
                                        validationFunction={checkNumber}
                                    />

                                </View>
                            ) : null}



                        </View>
                    </ScrollView>

                    {editable
                        ? <TouchableOpacity style={styles.SaveBtn} onPress={MultipleFunctions}>
                            <MaterialIcons name="save" size={37} color="white" />
                        </TouchableOpacity>


                        : <TouchableOpacity style={styles.EditBtn} onPress={formEditable}>
                            <MaterialIcons name="mode-edit" size={37} color="white" />
                        </TouchableOpacity>}

                    {editable
                        ? <TouchableOpacity style={styles.EditBtn} onPress={formEditable}>
                            <MaterialIcons name="cancel" size={37} color="white" />
                        </TouchableOpacity>

                        : null}


                </View>
            </SafeAreaView>






        );

    }

    return loadedForm;
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: '#694BBE'


    },
    scrollView: {
        marginRight: 10
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingTop: 50

    },

    footer: {
        flex: 3,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingBottom: 390,
        paddingRight: 110,
        paddingLeft: 80


    },

    textHeader: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25,
        paddingLeft: 55
    },

    textFooter: {
        color: '#05375a',
        fontSize: 18,
        margin: 20,

    },


    IntervalTimeLabel: {
        fontSize: 15,
        marginTop: 10,
        paddingTop: 40,
        paddingLeft: 2

    },

    BufferTimeLabel: {
        fontSize: 15,
        marginTop: 10,
        paddingTop: 150,
        paddingLeft: 2

    },

    Input: {
        height: 40,
        borderBottomWidth: 2,
        fontSize: 21,
        width: 10
    },

    IntervalTimeInput: {
        top: '200%',
        left: '9%',
        borderBottomWidth: 1,
        borderBottomColor: "black",
        width: '85%'

    },

    BufferTimeInput: {
        top: '490%',
        left: '9%',
        borderBottomWidth: 1,
        borderBottomColor: "black",
        width: '85%'

    },

    Error: {
        borderColor: 'red',
    },

    FeeSettings: {
        paddingTop: 10,
        paddingRight: 20

    },

    RoleSettings: {
        paddingTop: 10
    },

    TrafficSettings: {
        paddingTop: 10
    },


    HideShowBtn: {
        width: 250,
        height: 50,
        right: '30%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
        backgroundColor: '#694BBE',
        borderColor: 'white'

    },

    HideShowBtn2: {
        width: 250,
        height: 50,
        right: '30%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
        backgroundColor: '#694BBE',
        borderColor: 'white'

    },

    HideShowBtn3: {
        width: 250,
        height: 50,
        right: '30%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
        backgroundColor: '#694BBE',
        borderColor: 'white'

    },

    IntervalTimePicker: {
        width: 150,
        height: 40,
        top: '70%',
        left: '10%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#694BBE',
        borderColor: 'white'


    },

    BufferTimePicker: {
        width: 150,
        height: 40,
        top: '210%',
        left: '10%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#694BBE',
        borderColor: 'white'


    },

    HideShowBtnText: {
        color: "white",
    },

    SaveBtn: {
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: '#694BBE',
        position: 'absolute',
        top: '75%',
        left: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'white'


    },

    EditBtn: {
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: '#694BBE',
        position: 'absolute',
        top: '85%',
        left: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'white'

    }


});