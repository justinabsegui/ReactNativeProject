import { WhiteBalance } from 'expo-camera';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
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

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('TabNavigation')
            }
        })
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
                        this.setState({ emailError: "El mail es inválido." })
                    } else if (error.code == 'auth/user-not-found') {
                        this.setState({ emailError: "El usuario no fue encontrado." })
                    }
                    else if (error.code == 'auth/wrong-password') {
                        this.setState({ passwordError: "La contraseña ingresada es incorrecta." })
                    } else {
                        this.setState({ emailError: error.message })
                    }
                }
                )
        } else {
            this.setState({ emailError: 'Complete todos los campos antes de iniciar sesión.' })
        }
    }

    render() {
        return (

            <View style={styles.container}>
                <Image
                    style={styles.photo}
                    source={require('../../assets/postit.png')}
                    resizeMode='cover'
                />
                <Text style={styles.title}>Iniciar sesión</Text>

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
                            this.setState({ passwordError: "Ingrese su contraseña.", password: text, send: false })
                        } else if (text.length < 6) {
                            this.setState({ passwordError: "Las contraseñas son mayores a 6 caracteres.", password: text, send: false })
                        } else {
                            this.setState({ passwordError: '', password: text, send: true })
                        }
                    }}
                    value={this.state.password}
                />

                <View style={styles.cont}>
                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <Text style={styles.button}>Ingresar</Text>
                    </TouchableOpacity>
                    <Text style={styles.info}>¿Aún no tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={styles.button2}> Registrarme</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    photo: {
        height: 400
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        margin: 10
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 20,
        fontSize: 30,
        color: 'purple',
        margin: 40,
    },
    info: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontSize: 20,
    },
    field: {
        display: 'flex',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 5,
        width: 300,
    },

    button: {
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: 80,
        margin: 5,
        backgroundColor: 'purple',
    },

    button2: {
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 7.9,
        width: 100,
        margin: 5,
        backgroundColor: 'purple',
    },
    cont: {
        alignItems: 'center',

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