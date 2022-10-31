import { TabActions } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebase/config';

class Home extends Component {

    constructor() {
        super();
        this.state = {
            usuarios:null
        };
    }
    // clickear() {
    //     console.log("me clickearon");
    // }

    componentDidMount() {
        db.collection('posts').onSnapshot(
            docs => {//todos datos de la colección
                let datosUsuario = [];
                docs.forEach(doc => { //por cada documento, quiero un doc y la función que ejecutaré por cada doc
                    datosUsuario.push({
                        id: doc.id,//data, dni, pero solo quiero la que corresponde al usuario actual
                        data: doc.data(),
                    })
                    this.setState({
                        usuarios: datosUsuario,
                        loading: false
                    })
                })
            }
        )
    }

    render() {

        return (
            <View>
             {/* <Image style={styles.image} source={{uri: this.props.image}}/>Upload post</Image> */}


                {/* <Text>Hola mundo</Text>
                <TouchableOpacity onPress={() => this.clickear()}>
                    <Text>Clickeame</Text>
                </TouchableOpacity> */}
                {/* <Text>Nombre del usuario:{this.state.usuarios}</Text>
                <Text>DNI:{this.state.usuarios}</Text>
                <Text>Edad del usuario:{this.state.usuarios}</Text>
                 */}
            </View >
        );
    }
}

export default Home;
