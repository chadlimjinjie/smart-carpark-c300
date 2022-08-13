import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import DropDown3 from './DropDown3';


export default class Form2 extends Component {
    constructor() {
        super()
        this.state = {
            EntryFee: '',
            IntervalFee: '',
            Interval: '',
            BufferTime: '',

            EntryFeeValidate: true,
            IntervalFeeValidate: true,
            IntervalValidate: true,
            TextInputDisableStatus: true,

            handleChange: this.handleChange.bind(this),


        }
    }
    NotEditable = () => {
        this.setState({ TextInputDisableStatus: false })
    }

    Editable = () => {
        this.setState({ TextInputDisableStatus: true })
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }


    validate(text, type) {
        const numeric = /^[0-9]+$/

        if (type == 'EntryFee') {
            if (numeric.test(text)) {
                this.setState({
                    EntryFeeValidate: true,
                })
            }
            else {
                this.setState({
                    EntryFeeValidate: false,
                })
            }
        }

        else if (type == 'IntervalFee') {
            if (numeric.test(text)) {
                this.setState({
                    IntervalFeeValidate: true,
                })
            }
            else {
                this.setState({
                    IntervalFeeValidate: false,

                })
            }
        }

        else if (type == 'Interval') {
            if (numeric.test(text)) {
                this.setState({
                    IntervalValidate: true,
                })
            }
            else {
                this.setState({
                    IntervalValidate: false,

                })
            }
        }




    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Car Park Fee Form</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.Label}>Entry Fee:</Text>
                    <TextInput style={[styles.Input,
                    !this.state.EntryFeeValidate ? styles.Error : null]}
                        placeholder="Enter an Entry Fee"
                        onChangeText={(text) => this.validate(text, 'EntryFee')}
                        editable={this.state.TextInputDisableStatus}></TextInput>

                    <Text style={styles.Label}>Interval Fee:</Text>
                    <TextInput style={[styles.Input,
                    !this.state.IntervalFeeValidate ? styles.Error : null]}
                        placeholder="Enter an Interval Fee"
                        onChangeText={(text) => this.validate(text, 'IntervalFee')}
                        editable={this.state.TextInputDisableStatus}></TextInput>

                    <Text style={styles.Label}>Interval:</Text>
                    <TextInput style={[styles.Input,
                    !this.state.IntervalValidate ? styles.Error : null]}
                        placeholder="Enter an Interval"
                        onChangeText={(text) => this.validate(text, 'Interval')}
                        editable={this.state.TextInputDisableStatus}></TextInput>


                    <Text style={styles.Label}>Buffer Time:</Text>
                    <DropDown3 />


                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={styles.BtnText}>
                            <Button onPress={this.NotEditable} title="Submit" > </Button>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.BtnText}>
                            <Button onPress={this.Editable} title="Edit" > </Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );


    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: '#009387'
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 30

    },

    footer: {
        flex: 3,
        backgroundColor: '#fff',
        paddingHorizontal: 100,
        paddingVertical: 10,
        paddingBottom: 200

    },

    textHeader: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    },

    textFooter: {
        color: '#05375a',
        fontSize: 18,
        margin: 20
    },


    Label: {
        fontSize: 15,
        marginTop: 10,
        paddingTop: 10

    },

    Input: {
        height: 50,
        borderBottomWidth: 2,
        fontSize: 15,
        padding: 10,
        width: 300,


    },

    Error: {
        borderColor: 'red',
    },

    BtnText: {

        height: 40,
        width: 100,
        textAlign: 'center',
        marginTop: 50,
        paddingRight: 20
    }



});
