import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nombre: '',
            dni: '',
            edad: '',
        }
    }
    
    componentDidMount() {
        const email = auth.currentUser.email;
        
        db.collection('datosUsuario').onSnapshot(
            docs => {//todos datos de la colección
                let user;
                
                docs.forEach(doc => { //por cada documento, quiero un doc y la función que ejecutaré por cada doc
                    const data = doc.data();
                    
                    if (data.owner === email) {
                        user = data
                    }
                });

                this.setState({
                    nombre: user.owner,
                    dni: user.dni,
                    edad: user.edad
                });
            }
        )
    }
    
    logOut() {
        auth.signOut();
        this.props.navigation.navigate('TabNavigation')
    }
    render() {

        return (
            <View>
                <Text>Nombre del usuario:{this.state.nombre}</Text>
                <Text>DNI:{this.state.dni}</Text>
                <Text>Edad del usuario:{this.state.edad}</Text>
                
                <TouchableOpacity onPress={() => this.logOut()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View >
        );
    }
}

export default Profile;