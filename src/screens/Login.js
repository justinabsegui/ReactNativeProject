import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emailError: '',
            passwordError: '',
            send: false,
            email: '',
            password: '',
        }
    }

    onSubmit() {
        if (this.state.send == true) {
            //Colocar el método de registración de Firebase
            this.setState({
                emailError: '',
                passwordError: '',
            })
            auth.signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(response => console.log(response))
                .then(() => this.props.navigation.navigate('TabNavigation'))
                .catch(error => {
                    console.log(error);
                    if (error.code == 'auth/invalid-email') {
                        this.setState({ emailError: error.message })
                    } else if (error.code == 'auth/user-not-found') {
                        this.setState({ emailError: error.message })
                    }
                    else if (error.code == 'auth/wrong-password') {
                        this.setState({ passwordError: error.message })
                    } else{
                        this.setState({ emailError: error.message })
                    }
                }
                )
        } else {
            this.setState({emailError: 'Fill in all fields before logging in'})
        }
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
                {this.state.emailError !== '' ?
                    <Text style={styles.error}>Error: {this.state.emailError}</Text>
                    :
                    <View />}
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Email'
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                />
                {this.state.passwordError !== '' ?
                    <Text style={styles.error}>Error: {this.state.passwordError}</Text>
                    :
                    <View />}
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={text => {
                        if (text == '') {
                            this.setState({ passwordError: "Password missing", password: text, send: false })
                        } else if (text.length < 6) {
                            this.setState({ passwordError: "Password are at least 6 characters", password: text, send: false })
                        } else {
                            this.setState({ passwordError: '', password: text, send: true })
                        }
                    }}
                    value={this.state.password}
                />
                <TouchableOpacity onPress={() => this.onSubmit()}>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                    <Text style={styles.button}>Register</Text>
                </TouchableOpacity>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        marginTop: 10
    },
    title: {
        marginBottom: 20,
        fontSize: 40,
    },
    field: {
        display: 'flex',
        borderColor: '#dcdcdc',
        borderWidth: 1,
        borderRadius: 2,
        padding: 3,
        marginBottom: 8,
        width: '20vw',
    },

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
    },
    error: {
        borderColor: '#e81515',
        borderWidth: 1,
        borderRadius: 2,
        padding: 3,
        width: '20vw',
        marginBottom: 3,
        color: '#140101',
        backgroundColor: '#ba2929',
        fontStyle: 'bold',
        display: 'flex',
        justifyContent: 'center'
    }
})

export default Login;