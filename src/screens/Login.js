import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
    }

    onSubmit() {
        //Colocar el método de registración de Firebase
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => console.log(response))
            .then(() => this.props.navigation.navigate('TabNavigation'))
            .catch(error => console.log(error))
    }
    componentDidMount() {
        if (auth.currentUser) {
            auth.onAuthStateChanged(user => {
                console.log(user)
            })
            this.props.navigation.navigate('TabNavigation')
        }
    }
    render() {
        return (

            <View style={styles.container}>
                <Text style={styles.title}>Logueo</Text>
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Email'
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='password'
                    secureTextEntry={true}
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                />
                <TouchableOpacity onPress={() => this.onSubmit()}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginTop: 10
    },
    title: {
        marginBottom: 20
    },
    field: {
        borderColor: '#dcdcdc',
        borderWidth: 1,
        borderRadius: 2,
        padding: 3,
        marginBottom: 8

    }
})

export default Login;