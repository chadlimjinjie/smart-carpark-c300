import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as api from '../api/api';

export default function Checkout() {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("");

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        api.checkoutPass(data).then(result => {
            console.log(result);
            console.log(result.validity);
            setShowAlert(true);
            if (result.validity) {
                setMessage(result.message);
                setColor("limegreen");
            } else {
                setMessage(result.message);
                setColor("red");
            }
        });

    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                // title="AwesomeAlert"
                message={message}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Dismiss"
                confirmButtonColor={color}
                onConfirmPressed={() => {
                    setShowAlert(false);
                    setScanned(false);
                }}
                onDismiss={() => {
                    setShowAlert(false);
                    setScanned(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
