import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Camara from '../components/Camara';
import { db, auth } from '../firebase/config';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            send: false,
            nameError: '',
            passwordError: '',
            emailError: '',
            ageError: '',
            name: '',
            email: '',
            password: '',
            bio: '',
            edad: '',
            profilePic: '',
            showCamera: true,
        }
    }

    onSubmit() {
        if (this.state.send == true) {
            auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(response => {
                    db.collection('datosUsuario').add({
                        name: this.state.name,
                        owner: this.state.email,
                        bio: this.state.bio,
                        edad: this.state.edad,
                        profilePic: this.state.profilePic,
                        createdAt: Date.now()
                    })
                    this.props.navigation.navigate('TabNavigation');
                    this.setState({ showCamera: false })
                })
                .catch(error => {
                    if (error.code == 'auth/email-already-in-use') {
                        this.setState({ emailError: "este mail está asociado a otra cuenta." })
                    }
                    else {
                        this.setState({ nameError: error.message })
                    }
                })
        }
    }

    checkFields() {
        if (this.state.name == '') {
            this.setState({ nameError: "debe ingresar un nombre de usuario." })
            if (this.state.password == '') {
                this.setState({ passwordError: 'debe ingresar una contraseña.' })
                if (this.state.email == '') {
                    this.setState({ emailError: 'debe ingresar un mail.' })

                }
            }
        } else {
            this.onSubmit()
        }
    }

    onImageUpload(url) {
        this.setState({
            showCamera: false,
            profilePic: url
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Crear una cuenta</Text>
                {this.state.nameError !== '' ?
                    <Text style={styles.error}>Error: {this.state.nameError}</Text>
                    :
                    <View />}
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Username'
                    onChangeText={text => {
                        if (text == '') {
                            this.setState({ nameError: "debe ingresar un nombre de usuario.", name: text, send: false })
                        } else {
                            this.setState({ nameError: '', name: text, send: true })
                        }
                    }}
                    value={this.state.name}
                />
                {this.state.emailError !== '' ?
                    <Text style={styles.error}>Error: {this.state.emailError}</Text>
                    :
                    <View />}
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Email'
                    onChangeText={text => {

                        if (text == '') {
                            this.setState({ emailError: "debe ingresar un mail.", email: text, send: false })
                        } else {

                            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                            if (re.test(text)) { // Comprueba si el mail tiene formato válido de mail
                                this.setState({ emailError: '', email: text, send: true })
                            }
                            else { // Si no es un mail válido salta el error
                                this.setState({ emailError: 'debe ingresar un mail válido.', email: text, send: false })
                            }
                        }
                    }}
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
                            this.setState({ passwordError: "debe ingresar una contraseña.", password: text, send: false })
                        } else if (text.length < 6) {
                            this.setState({ passwordError: "la contraseña es muy corta.", password: text, send: false })
                        } else {
                            this.setState({ passwordError: '', password: text, send: true })
                        }
                    }
                    }
                    value={this.state.password}
                />
                {this.state.ageError !== '' ?
                    <Text style={styles.error}>Error: {this.state.ageError}</Text>
                    :
                    <View />}
                <TextInput
                    style={styles.field}
                    keyboardType='numeric'
                    placeholder='Age'
                    onChangeText={text => {
                        if (/^-?\d+$/.test(text)) {
                            this.setState({ ageError: '', edad: text, send: true })
                        } else {
                            this.setState({ ageError: "debe usar números para su edad.", edad: text, send: false })

                        } if (text == '') {
                            this.setState({ ageError: '', edad: text, send: true })
                        } if (text > 118) {
                            this.setState({ ageError: "introduzca una edad válida.", edad: text, send: false })
                        }
                    }

                    }
                    value={this.state.edad}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Bio'

                    onChangeText={text => this.setState({ bio: text })}
                    value={this.state.bio}
                />
                {this.state.showCamera ?
                    <Camara onImageUpload={url => this.onImageUpload(url)
                    } />
                    : <Text style={styles.profilePic}>Foto de perfil guardada exitosamente</Text>
                }


                <TouchableOpacity onPress={() => this.checkFields()}>
                    <Text style={styles.button}>Registrarme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('Login');
                        this.setState({ showCamera: false })
                    }}>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>
            </View >

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
    profilePic: {
        borderColor: '#069e10',
        borderWidth: 5,
        borderRadius: 20,
        padding: 5,
        width: 300,
        margin: 10,
        color: 'black',
        backgroundColor: '#069e10',
        fontStyle: 'bold',
        display: 'flex',
        justifyContent: 'center'
    }
    ,
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 20,
        fontSize: 30,
        color: 'purple',
        margin: 40,
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
        justifySelf: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: 90,
        margin: 5,
        backgroundColor: 'purple',
    },
    error: {
        borderColor: '#ba2929',
        borderWidth: 5,
        borderRadius: 20,
        padding: 5,
        width: 300,
        margin: 10,
        color: '#140101',
        backgroundColor: '#ba2929',
        fontStyle: 'bold',
        display: 'flex',
        justifyContent: 'center'
    }
})

export default Register;