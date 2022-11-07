import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            send: false,
            nameError: '',
            passwordError: '',
            emailError: '',
            name:'',
            email: '',
            password: '',
            bio: '',
            edad: ''
        }
    }

    onSubmit() {
        if (this.state.send == true){
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
                db.collection('datosUsuario').add({
                    name:this.state.name,
                    owner: this.state.email,
                    bio: this.state.bio,
                    edad: this.state.edad,
                    createdAt: Date.now()
                })
                this.props.navigation.navigate('TabNavigation')
            })
            .catch(error => {
                console.log(error);
                this.setState({ emailError: error.message })
            })
        }

    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Registrar usuario</Text>
                <Text style={styles.field}>{this.state.nameError}</Text>
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
                <Text style={styles.field}>{this.state.emailError}</Text>
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Email'
                    onChangeText={text => {
                        if (text == '') {
                            this.setState({ emailError: "You need to register an email!", email: text, send: false })
                        } else {
                            this.setState({ emailError: '', email: text, send: true })
                        }
                    }}
                    value={this.state.email}
                />
                <Text style={styles.field}>{this.state.passwordError}</Text>
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
                        this.setState({ passwordError: '', password: text, send: true })}
                    }
                    }
                    value={this.state.password}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='numeric'
                    placeholder='Age'

                    onChangeText={text => this.setState({ edad: text })}
                    value={this.state.edad}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Bio'

                    onChangeText={text => this.setState({ bio: text })}
                    value={this.state.bio}
                />


                <TouchableOpacity onPress={() => this.onSubmit()}>
                    <Text>Registrarme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login')}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View >

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

export default Register;