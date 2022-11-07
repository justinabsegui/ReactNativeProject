import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name:'',
            email: '',
            password: '',
            dni: '',
            edad: ''
        }
    }

    onSubmit() {
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
                db.collection('datosUsuario').add({
                    name:this.state.name,
                    owner: this.state.email,
                    dni: this.state.dni,
                    edad: this.state.edad,
                    createdAt: Date.now()
                })
                this.props.navigation.navigate('TabNavigation')
            })
            .catch(error => console.log(error))

    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Registro</Text>
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='username'
                    onChangeText={text => this.setState({ name: text })}
                    value={this.state.name}
                />
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
                <TextInput
                    style={styles.field}
                    keyboardType='numeric'
                    placeholder='dni'

                    onChangeText={text => this.setState({ dni: text })}
                    value={this.state.dni}
                />
                <TextInput
                    style={styles.field}
                    keyboardType='numeric'
                    placeholder='edad'

                    onChangeText={text => this.setState({ edad: text })}
                    value={this.state.edad}
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