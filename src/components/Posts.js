import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
                    owner: this.state.email,
                    dni: this.state.dni,
                    edad: this.state.edad,
                    createdAt: Date.now(),
                    image:'',
                })
                this.props.navigation.navigate('TabNavigation')
            })
            .catch(error => console.log(error))

    }


    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Image'
                    onChangeText={text => this.setState({ image: text })}
                    value={this.state.image}
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

/* <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Username'
                    onChangeText={text => this.setState({ user: text })}
                /> */