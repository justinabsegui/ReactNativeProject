import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
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
            profilePic: '',
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
                            user = doc.data();
                           
                        });

                        this.setState({
                            email: user.owner,
                            name: user.name,
                            bio: user.bio,
                            edad: user.edad, 
                            profilePic: user.profilePic
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
                            user =  doc.data();
        
                        });

                        this.setState({
                            email: user.owner,
                            name: user.name,
                            bio: user.bio,
                            edad: user.edad,
                            profilePic: user.profilePic
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
                <View style={styles.contenedor}>
                <Image style={styles.profilePic}
                    source={{uri: this.state.profilePic}}
                    resizeMode='contain'
                ></Image>
                    <Text style={styles.usuario}>{this.state.name}</Text>
                </View>
                    <Text style={styles.info}>Email:{this.state.email}</Text>
                    <Text style={styles.info}>Bio:{this.state.bio}</Text>
                    <Text style={styles.info}>Age:{this.state.edad}</Text>
                    
                {/* logout */}
                    <TouchableOpacity onPress={() => {
                    if (auth.currentUser.email == this.state.email) {
                        this.logOut()
                    } else {
                        this.setState({ logout: false })
                    }
                }}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>

                {/* mis posteos */}
                    <Text style={styles.info}>Mis posteos: </Text>
                
                <FlatList
                    data={this.state.posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Post postData={item.data} />}
                />
            </ScrollView >
        );
    }
}
const styles = StyleSheet.create({
    contenedor:{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent:"flex-start",
        justifyContent:'space-around',
        margin:5,
    },
    usuario:{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 20,
        fontSize: 30,
        color:'purple',
        margin: 40,
    },
    info: {
        color: 'purple',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5,
        marginLeft:50,
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
    },
    logout: {
        color: 'white',
        display: 'flex',
        flexWrap: 'wrap',
        opacity: 10,
        marginLeft:50,
        marginTop:25,
        marginBottom:25,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 20,
        padding: 6,
        width: 80,
        backgroundColor: 'purple',
    },


})
export default Profile;