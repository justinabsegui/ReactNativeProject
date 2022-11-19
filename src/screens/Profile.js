import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            bio: '',
            edad: '',
            logout: true,
            posts: [],
            borrar: false,
            alertaBorrarMensaje: ''
        }
    }

    componentDidMount() {
        if (auth.currentUser.email) { // Chequear que existe auth.currentUser.email
            const email = auth.currentUser.email;
            console.log(this.props.usuario);
            if ( this.props.usuario !== undefined) {
                db.collection('datosUsuario').where('owner', '===', this.props.usuario).onSnapshot(   // No traer todos los datos de la colección, filtrarlos al mismo tiempo que los traemos
                    docs => {//todos datos de la colección
                        let user = '';
                        // Corregir filter
                        docs.forEach(doc => {
                            //    Condicional: si las props están vacias, es tu perfil. Sino, es el de otro usuario (o es el tuyo y hay que comparar el mail con auth.currentUser.email)
                            const data = doc.data();
                            user = data
                        });

                        this.setState({
                            email: user.owner,
                            name: user.name,
                            bio: user.bio,
                            edad: user.edad
                        })

                    }
                );
                db.collection('Posts').where('owner', '==', this.props.usuario).onSnapshot(
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
            } else {
                db.collection('datosUsuario').where('owner', '==', email).onSnapshot(   // No traer todos los datos de la colección, filtrarlos al mismo tiempo que los traemos
                    docs => {//todos datos de la colección
                        let user = '';
                        docs.forEach(doc => {
                            //    Condicional: si las props están vacias, es tu perfil. Sino, es el de otro usuario (o es el tuyo y hay que comparar el mail con auth.currentUser.email)
                            const data = doc.data();
                            user = data
                        });

                        this.setState({
                            email: user.owner,
                            name: user.name,
                            bio: user.bio,
                            edad: user.edad
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
    }

    logOut() {
        auth.signOut();
        this.props.navigation.navigate('Login')
    }

    alertaBorrarMensaje(){
        this.setState({alertaBorrarMensaje: 'Estas seguro que queres borrar este comentario?', borrar: true})
    }

    borrarPerfil(){
        db.collection('datosUsuario').doc(this.props.postData.id).delete()
    }

    noBorrar(){
        this.setState({alertaBorrarMensaje: '', borrar: false})
    }

    render() {

        return (
            <ScrollView>
                { //form para borrar                
                    this.props.usuario == auth.currentUser.email ?
                        <>
                            <TouchableOpacity onPress={() => this.alertaBorrarMensaje()}>
                                <Text style={styles.comentarr}>Borrar posteo</Text>
                            </TouchableOpacity>

                            <Text>{this.state.alertaBorrarMensaje}</Text>
                            {this.state.borrar ?
                                <View>
                                    <TouchableOpacity onPress={() => this.borrarPerfil()}>
                                        <Text style={styles.comentarr}>Si</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.noBorrar()}>
                                        <Text style={styles.comentarr}>No</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <></>
                            }
                        </>
                        :
                        <></>
                }
                <Text>Username:{this.state.name}</Text>
                <Text>Email:{this.state.email}</Text>
                <Text>Bio:{this.state.bio}</Text>
                <Text>Age:{this.state.edad}</Text>

                {/* <Text>User's Posts: {this.state.posts}</Text> */}

                <FlatList
                    data={this.state.posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Post postData={item} />}
                />

                <TouchableOpacity onPress={() => {
                    if (auth.currentUser.email == this.state.email) {
                        this.logOut()
                    } else {
                        this.setState({ logout: false })
                    }
                }}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </ScrollView >
        );
    }
}
const styles = StyleSheet.create({
    photo: {
        height: 250,
    },
    postContainer: {
        borderRadius: 20,
        borderColor: 'purple',
        borderWidth: 1,
        borderStyle: 'solid',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 15
    },
    user: {
        color: 'purple',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        margin: 10,
    },
    datos: {
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5
    },

    like: {
        color: 'red',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
    },
    unlike: {
        color: 'black',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',

    },
    pie: {
        color: 'purple',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    comentar: {
        color: 'black',
        display: 'flex',
        opacity: 10,
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 6,
        width: 300,
        margin: 5,
        padding: 6,
    },
    comentarr: {
        color: 'white',
        display: 'flex',
        opacity: 10,
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderRadius: 20,
        padding: 6,
        width: 80,
        backgroundColor: 'purple',
    },
    comments: {
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
    },

})
export default Profile;