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
            profilePic: '',
            editProfile: false,
            newName: '',
            newBio: '',
            newPassword: '',
            newProfilePic: '',
            showCamera: false,
            logout: true,
            posts: [],
            passwordError: '',
            send: false,
        }
    }

    componentDidMount() {
        if (auth.currentUser.email) { // Chequear que existe auth.currentUser.email
            const email = auth.currentUser.email;
                db.collection('datosUsuario').where('owner', '==', email).onSnapshot(   // No traer todos los datos de la colección, filtrarlos al mismo tiempo que los traemos
                    docs => {//todos datos de la colección
                        let user = '';
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

    onImageUpload(url) {
        this.setState({
            showCamera: false,
            newProfilePic: url
        });
    }

    guardarCambios() {
        const user = auth.currentUser;
        if (this.state.newName !== '') {
            this.setState({ name: this.state.newName })
        } if (this.state.newBio !== '') {
            this.setState({ bio: this.state.newBio })
        } if (this.state.newPassword !== '' && this.state.send == true) {
            user.updatePassword(this.state.newPassword).then(() => {
            }).catch((error) => {
                this.setState({ passwordError: error })
            })
        } 
        db.collection('datosUsuario')
            .doc(user.getIdTokenResult)
            .update({
                name: this.state.name,
                bio: this.state.bio,
            })
            .then(() => {
                this.setState({ editProfile: false })
            })

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
                    {this.state.editProfile ?
                        <TextInput
                            style={styles.field}
                            keyboardType='default'
                            placeholder='Nuevo nombre de usuario'
                            onChangeText={text => this.setState({ newName: text })}
                            value={this.state.newName}
                        />
                        :

                        <Text style={styles.usuario}>{this.state.name}</Text>

                    }

                </View>
                {this.state.editProfile ?
                    <View>
                        {this.state.passwordError !== '' ?
                            <Text style={styles.error}>Error: {this.state.passwordError}</Text>
                            :
                            <></>}
                        <TextInput
                            style={styles.field}
                            keyboardType='default'
                            placeholder='Nueva contraseña'
                            secureTextEntry={true}
                            onChangeText={text => {
                                if (text.length < 6) {
                                    this.setState({ passwordError: "la nueva contraseña es muy corta.", newPassword: text, send: false })
                                } else {
                                    this.setState({ passwordError: '', newPassword: text, send: true })
                                }
                            }
                            }
                            value={this.state.newPassword}
                        />
                    </View>


                    :
                    <></>}

                <Text style={styles.info}>Email:   {this.state.email}</Text>
                <Text style={styles.info}>Edad:   {this.state.edad}</Text>

                {this.state.editProfile ?
                    <TextInput
                        style={styles.field}
                        keyboardType='default'
                        placeholder='Nueva Bio'
                        onChangeText={text => this.setState({ newBio: text })}
                        value={this.state.newBio}
                    />
                    :
                    <Text style={styles.info}>Bio:   {this.state.bio}</Text>
                }


                {this.state.editProfile ?
                    <TouchableOpacity onPress={() => this.guardarCambios()}>
                        <Text style={styles.cambios}>Guardar cambios</Text>
                    </TouchableOpacity>
                    :
                    <></>}

                {/* logout */}
                <View style={styles.botones}>
                    {this.state.editProfile == false ?
                        <TouchableOpacity onPress={() => this.setState({ editProfile: true })}>
                            <FontAwesome name="gear" size={24} color="black" />
                        </TouchableOpacity>
                        :
                        <></>}
                    <TouchableOpacity onPress={() => {
                        if (auth.currentUser.email == this.state.email) {
                            this.logOut()
                        } else {
                            this.setState({ logout: false })
                        }
                    }}>
                        <MaterialIcons name="logout" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* mis posteos */}
                <Text style={styles.usuario}>Publicaciones</Text>

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