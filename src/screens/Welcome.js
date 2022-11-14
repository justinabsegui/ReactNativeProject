import React, { Component } from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, View } from 'react-native';
import { db, auth } from '../firebase/config';
import Login from '../screens/Login';
import Register from '../screens/Register';




class Welcome extends Component {

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                    <Text>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                    <Text>Log in</Text>
                </TouchableOpacity>
            </View>
        )
    }

}



export default Welcome;