import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            bio: '',
            edad: '',
            id: '',
            profilePic: '', 
            logout: true,
            posts: [],
            passwordError: '',
        }
    }

    componentDidMount() {
        if (auth.currentUser.email) { // Chequear que existe auth.currentUser.email
            const email = auth.currentUser.email;
                db.collection('datosUsuario').where('owner', '==', email).onSnapshot(   // No traer todos los datos de la colección, filtrarlos al mismo tiempo que los traemos
                    docs => {//todos datos de la colección
                        let info = '';
                        let id = ''
                        docs.forEach(doc => {
                            info = doc.data() ;
                            id = doc.id     })
                        ;
                        console.log(info);
                        console.log(id);
                        this.setState({
                            email: info.owner,
                            id: id,
                            name: info.name,
                            bio: info.bio,
                            edad: info.edad,
                            profilePic: info.profilePic
                        });
                    }
                );

                db.collection('Posts').where('owner', '==', email).onSnapshot(
                    docs => {
                        let posteos = [];

                        docs.forEach(doc => {
                            posteos.push({
                                id: doc.id,
                                data: doc.data()
                            })
                        })
                        this.setState({
                            posts: posteos,
                        })
                    })
            }
        }
  

    logOut() {
        auth.signOut();
        this.props.navigation.navigate('Login')
    }


    render() {

        return (
            <ScrollView>


                <View style={styles.contenedor}>


                    <Image style={styles.profilePic}
                        source={{ uri: this.state.profilePic }}
                        resizeMode='cover'
                    ></Image>
                   
                        <Text style={styles.usuario}>{this.state.name}</Text>

                </View>

                <Text style={styles.info}>Email:   {this.state.email}</Text>
                <Text style={styles.info}>Edad:   {this.state.edad}</Text>
                 <Text style={styles.info}>Bio:   {this.state.bio}</Text>
                



                {/* logout */}
                    
                    <TouchableOpacity style={styles.botones} onPress={() => {
                        if (auth.currentUser.email == this.state.email) {
                            this.logOut()
                        } else {
                            this.setState({ logout: false })
                        }
                    }}>
                        <MaterialIcons name="logout" size={24} color="black" />
                    </TouchableOpacity>

                {/* mis posteos */}
                <Text style={styles.usuario}>Mis {this.state.posts.length} publicaciones</Text>

                <FlatList
                    data={this.state.posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Post postData={item.data} id={item.id} />}
                />
            </ScrollView >
        );
    }
}
const styles = StyleSheet.create({
    field: {
        display: 'flex',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 5,
        width: 300,
    },
    contenedor: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent: "flex-start",
        justifyContent: 'space-around',
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
    info: {
        color: 'purple',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        padding: 6,
    },
    profilePic: {
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 200,
        width: 90,
        margin: 5,
    },
    cambios: {
        color: 'white',
        display: 'flex',
        flexWrap: 'wrap',
        opacity: 10,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 20,
        padding: 6,
        width: 80,
        backgroundColor: 'purple',
    },
    comentarr: {
        color: 'white',
        opacity: 10,
        borderRadius: 20,
        padding: 6,
        width: 140,
        backgroundColor: 'purple',
        margin: 5,
    },
    botones: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',

    }

})
export default Profile;