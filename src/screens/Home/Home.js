import { TabActions } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { db, auth } from '../../firebase/config';
import Post from "../../components/Post";

class Home extends Component {

    constructor() {
        super();
        this.state = {
            datosdelusuario: {},
            posts: [],
        }
        
        };

    componentDidMount() {
        //Traer datos de la db
        db.collection('Posts').orderBy('createdAt', 'desc').limit(10).onSnapshot(
            docs => {
                let posteos = [];
                docs.forEach(doc => {
                        const id = doc.id;
                        const data = doc.data();
                        posteos.push({ data, id });
                });
                this.setState({ posts: posteos })
            }
        )
    }

    render() {
        return (
            <View style={estilosCss().container}>
           <TouchableOpacity onPress={() => this.props.navigation.navigate('PostForm')}>
                <Text style={estilosCss().touchable}> Añadir post </Text>
            </TouchableOpacity>
            {/* <Text> DNI: {this.state.datosdelusuario?.DNI} </Text>
            <Text> Edad del usuario: {this.state.datosdelusuario?.edad} </Text> */}
            <FlatList
                data={this.state.posts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <Post postData={item} />}
            />
        </View>
        )
    }
}
const estilosCss = () => StyleSheet.create({
    container: {
        textAlign: 'center',
        padding: 10,
    },
    touchable: {
        padding: 4,
        backgroundColor: '#ccc',
        marginBottom: 10,
        borderRadius: 4,
    },
    text: {
        fontWeight: 'bold'
    },
    contadorContainer: {
        marginVertical: 4
    },
    
    textContador: {
        fontWeight: 'bold'
    }
})
export default Home;
