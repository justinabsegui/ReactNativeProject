import React, { Component } from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, View } from 'react-native';
import { db, auth } from '../firebase/config';
import Login from '../screens/Login';
import Register from '../screens/Register';




class Welcome extends Component {

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Register')}>
                    <Text>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text>Log in</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: '#067dc7',
        borderWidth: 1,
        borderRadius: 20,
        padding: 3,
        width: '10vw',
        marginBottom: 3,
        color: '#140101',
        backgroundColor: '#0994eb',
    }
})

export default Welcome;