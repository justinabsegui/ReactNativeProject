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
            photo: '',
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
                        createdAt: Date.now()
                    })
                    this.props.navigation.navigate('TabNavigation')
                })
                .catch(error => {
                    if (error.code == 'auth/email-already-in-use') {
                        this.setState({ emailError: error.message })
                    }
                    else {
                        this.setState({ nameError: error.message })
                    }
                })
        }
    }

    checkFields() {
        if (this.state.name == '') {
            this.setState({ nameError: "You need to have a user name!" })
            if (this.state.password == '') {
                this.setState({ passwordError: "You need to have a password!" })
                if (this.state.email == '') {
                    this.setState({ emailError: "You need to register an email!" })

                }
            }
        } else {
            this.onSubmit()
        }
    }

    onImageUpload(url) {
        this.setState({
            showCamera: false,
            photo: url
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Registrar usuario</Text>
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
                            this.setState({ nameError: "You need to register a user name!", name: text, send: false })
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
                            this.setState({ emailError: "You need to register an email!", email: text, send: false })
                        } else {

                            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                            if (re.test(text)) {
                                this.setState({ emailError: '', email: text, send: true })
                            }
                            else {
                                this.setState({ emailError: 'You need to register a valid email!', email: text, send: false })
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
                            this.setState({ passwordError: "You need to have a password!", password: text, send: false })
                        } else if (text.length < 6) {
                            this.setState({ passwordError: "Password should be at least 6 characters", password: text, send: false })
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
                            this.setState({ ageError: "You need to use a number for your age!", edad: text, send: false })

                        } if (text == '') {
                            this.setState({ ageError: '', edad: text, send: true })
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
                <Text style={styles.field}>Profile picture</Text>
                {this.state.showCamera ?
                    <Camara onImageUpload={url => this.onImageUpload(url)
                    } />
                    : <Text style={styles.profilePic}>Profile picture succesfully updated</Text>
                }


                <TouchableOpacity onPress={() => this.checkFields()}>
                    <Text style={styles.button}>Registrarme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login')}>
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

export default Register;