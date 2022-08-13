import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { CreateTextInput } from './InputCollection';
import * as api from '../api/api';

var ip = "https://c300-final.azurewebsites.net"
export const ChargerRobotSettings = (props) => {

    var data = props.data;

    const [isLoading, setIsLoading] = useState(false);
    const [testData, setTestData] = useState({});


    // make an API call to get the data 
    const getData = async () => {

        //The data will retrieve from the URL
        //The URL retrieved all the data from the database
        const response = await fetch(ip + '/api/RobotFee');

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


    //Used var instead of const so that the value can be change   

    const [RobotFee, onChangeRobotFee] = useState("");
    const [RobotFeeValidate, onChangeRobotFeeValidate] = useState(true);
    const [editable, setEditable] = useState(false);


    function formEditable() {
        if (editable) {
            setEditable(false);

        }
        else {
            setEditable(true);

        }

    }


    function RFValidate(input) {

        const numeric = /^[+-]?\d+(\.\d+)?$/

        if (numeric.test(input)) {
            return true;
        }

        else {
            return false;
        }
    }

    function saveRobotFeeSettings() {

        if (editable) {

            // insert data only when the form become not editable
            api.saveRobotFeeSettings(RobotFee).then(data => {
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
        saveRobotFeeSettings();
    }



    // this function is similar to componentDidMount , it runs the function once after the components are ready
    // https://reactjs.org/docs/hooks-effect.html
    // so it will call the api once to get data that we use in the form
    useEffect(() => {
        var data = getData();
        data.then((d) => {
            ;

            console.log(d);
            console.log(d);
            // these functions is to update the variables
            setIsLoading(true);
            onChangeRobotFee(d['charging_fee_perHour']);
        })
    }, []);


    var loadedForm = null

    // this check is to check whether the data from the API call is ready, if it is, render the form, if not don't show anything yet
    if (isLoading === true) {
        loadedForm = (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Electric Charger Robot Fee Settings</Text>
                </View>

                <View style={styles.footer}>


                    <CreateTextInput
                        style={styles.Label}
                        value={RobotFee}
                        editable={editable}
                        nameOfInput={"Electric Charger Robot Fee Per Hour"}
                        iconType={"battery-charging-full"} toolTipText={"The charging fee for Electric Charger Robot per Hour"}
                        inputFunction={onChangeRobotFee}
                        confirmInputFunction={RFValidate}
                        validationFunction={RFValidate}
                    />


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
            </View>

        );
    }
    else if (isLoading === false) {
        loadedForm = (

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Electric Charger Robot Fee Settings</Text>
                </View>

                <View style={styles.footer}>


                    <CreateTextInput
                        style={styles.Label}
                        value={RobotFee}
                        editable={editable}
                        nameOfInput={"Electric Charger Robot Fee Per Hour"}
                        iconType={"battery-charging-full"} toolTipText={"The charging fee for Electric Charger Robot per Hour"}
                        inputFunction={onChangeRobotFee}
                        confirmInputFunction={RFValidate}
                        validationFunction={RFValidate}
                    />


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
            </View>




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

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingTop: 50

    },

    footer: {
        flex: 3,
        backgroundColor: '#fff',
        paddingBottom: 370,
        paddingRight: 105,
        paddingLeft: 105,
        marginBottom: 50,
        width: "150%"


    },

    textHeader: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25,
        paddingLeft: 30
    },

    textFooter: {
        color: '#05375a',
        fontSize: 18,
        margin: 30,

    },


    Label: {
        fontSize: 20,
        paddingTop: 40,
        paddingBottom: 20,
        paddingLeft: 25


    },


    Input: {
        height: 100,
        borderBottomWidth: 2,
        fontSize: 20,
        width: "100%",
        margin: 50


    },

    Error: {
        borderColor: 'red',
    },

    BtnText: {

        height: 50,
        width: 100,
        textAlign: 'center',
        marginTop: 28,
        paddingRight: 20,
        paddingBottom: 0
    },
    SaveBtn: {
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: '#694BBE',
        position: 'absolute',
        top: '65%',
        left: '110%',
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
        top: '98%',
        left: '110%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'white'

    }


});



