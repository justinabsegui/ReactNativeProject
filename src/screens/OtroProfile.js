import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';

class OtroProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            bio: '',
            edad: '',
            profilePic: '',
            logout: true,
            posts: [],

        }
    }

    componentDidMount() {
        if (auth.currentUser.email) { // Chequear que existe auth.currentUser.email
            console.log(this.props.route.params.user);

            db.collection('datosUsuario').where('owner', '==', this.props.route.params.user).onSnapshot(   // No traer todos los datos de la colección, filtrarlos al mismo tiempo que los traemos
                docs => {//todos datos de la colección
                    let user = '';
                    // Corregir filter
                    docs.forEach(doc => {
                        //    Condicional: si las props están vacias, es tu perfil. Sino, es el de otro usuario (o es el tuyo y hay que comparar el mail con auth.currentUser.email)
                        user = doc.data();
                    });
                    console.log(user);
                    this.setState({
                        email: user.owner,
                        name: user.name,
                        bio: user.bio,
                        edad: user.edad,
                        profilePic: user.profilePic
                    })

                }
            );
            db.collection('Posts').where('owner', '==', this.props.route.params.user).onSnapshot(
                docs => {
                    let posteos = [];

                    docs.forEach(doc => {
                        posteos.push({
                            id: doc.id,
                            data: doc.data()
                        }
                        )
                    })

                    this.setState({
                        posts: posteos,
                    })

                }
            )

        }
    }

    render() {

        return (
            <View>
                <View style={styles.contenedor}>
                    <Image style={styles.profilePic}
                        source={{ uri: this.state.profilePic }}
                        resizeMode='contain'>
                    </Image>
                    <Text style={styles.usuario}>{this.state.name}</Text>
                    {/* <Text>Email:{this.state.email}</Text> */}
                </View >
                <View style={styles.contenedor2}>
                    <Text style={styles.infoTitle}>Bio</Text>
                    <Text style={styles.info}>{this.state.bio}</Text>
                </View>
                <View style={styles.contenedor2}>
                    <Text style={styles.infoTitle}>Edad</Text>
                    <Text style={styles.info}>{this.state.edad}</Text>
                </View>
                <Text style={styles.usuario}>Publicaciones</Text>
                <FlatList
                    data={this.state.posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Post postData={item.data} />}
                />
            </View>


        );
    }
}
const styles = StyleSheet.create({
    contenedor: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: "flex-start",
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        margin: 5,
    },
    contenedor2: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: "flex-start",
        justifyContent: 'center',
        justifySelf: 'left',
        margin: 5,
    },
    usuario: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 20,
        fontSize: 30,
        color: 'purple',
        margin: 40,
    },
    
    infoTitle: {
        color: 'purple',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5,
        marginLeft: 50,
        fontStyle: 'bold'
    },
    info: {
        color: 'black',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5,
        marginLeft: 10,
    },
    profilePic: {
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        width: 90,
        margin: 5,
    }
})
export default OtroProfile;