import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';
import Camara from '../components/Camara';

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
            checkNewPassword: '',
            newProfilePic: '',
            showCamera: false,
            logout: true,
            posts: [],
            borrar: false,
            alertaBorrarMensaje: '',
            passwordError: '',
        }
    }

    componentDidMount() {
        if (auth.currentUser.email) { // Chequear que existe auth.currentUser.email
            const email = auth.currentUser.email;
            if (this.props.usuario !== undefined) {
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
    }

    onImageUpload(url) {
        this.setState({
            showCamera: false,
            newProfilePic: url
        });
    }

    guardarCambios(){
        const user = auth.currentUser;
        if (this.state.newName != ''){
            this.setState({name: newName})
        } if (this.state.newBio != ''){
            this.setState({bio: newBio})
        } if (this.state.newProfilePic != ''){
            this.setState({profilePic: newProfilePic})
        }  if (this.state.newPassword != '' && this.state.newPassword === this.state.checkNewPassword){
            user.updatePassword(this.state.newPassword).then(() => {
              }).catch((error) => {
               this.setState({passwordError: error})
              })} else {
                  this.setState({passwordError: 'ingrese su nueva contraseña dos veces'})
                }
              db.collection('datosUsuario')
              .doc(this.props.usuario.id)
              .update({
                         name: this.state.name,
                         profilePic: this.state.profilePic,
                         bio: this.state.bio,
                     })
                     .then(()=>{
                         this.setState({editProfile: false})
                     })
              
    }

    logOut() {
        auth.signOut();
        this.props.navigation.navigate('Login')
    }

    alertaBorrarMensaje() {
        this.setState({ alertaBorrarMensaje: 'Está seguro que desea eliminar su perfil?', borrar: true })
    }

    borrarPerfil() {
        db.collection('datosUsuario').doc(this.props.postData.id).delete()
    }

    noBorrar() {
        this.setState({ alertaBorrarMensaje: '', borrar: false })
    }

    guardarCambios() {
        const user = auth.currentUser;
        if (this.state.newName != '') {
            this.setState({ name: newName })
        } if (this.state.newBio != '') {
            this.setState({ bio: newBio })
        } if (this.state.newPassword != '' && this.state.newPassword === this.state.checkNewPassword) {
            user.updatePassword(this.state.newPassword).then(() => {
            }).catch((error) => {
                this.setState({ passwordError: error })
            })
        } else {
            this.setState({ passwordError: 'ingrese su nueva contraseña dos veces.' })
        }
        db.collection('datosUsuario')
            .doc(user.id)
            .update({
                name: this.state.name,
                bio: this.state.bio,
            })
            .then(() => {
                this.setState({ editProfile: false })
            })

    }

    render() {

        return (
            <ScrollView>
                    
                        <>
                            <TouchableOpacity onPress={() => this.alertaBorrarMensaje()}>
                                <Text style={styles.comentarr}>Eliminar perfil</Text>
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
   
                

               { this.state.editProfile = false ?
                <TouchableOpacity onPress={() => this.setState({ editProfile: true })}>
                    <Text style={styles.comentarr}>Editar perfil</Text>
                </TouchableOpacity>
                :
                <></>}        
                <View style={styles.contenedor}>
                
                
                    <Image style={styles.profilePic}
                    source={{uri: this.state.profilePic}}
                    resizeMode='contain'
                ></Image>
                    { this.state.editProfile  ?
                      <TextInput
                      style={styles.field}
                      keyboardType='default'
                      placeholder='Nuevo nombre de usuario'
                      value={this.state.newName}
                  />
            :
          
        <Text style={styles.usuario}>{this.state.name}</Text>
          
                }
                    
                </View>
                { this.state.editProfile ?
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
                    this.setState({ passwordError: "la nueva contraseña es muy corta.", newPassword: text })
                } else {
                    this.setState({ passwordError: '', newPassword: text})
                }
            }
            }
            value={this.state.newPassword}
        /> 
        <TextInput
            style={styles.field}
            keyboardType='default'
            placeholder='Comprobar nueva contraseña'
            secureTextEntry={true}
            onChangeText={text => {
                if (text !== this.state.newPassword) {
                    this.setState({ passwordError: "Las contraseñas no coinciden", checkNewPassword: text})
                } else {
                    this.setState({ passwordError: '', checkNewPassword: text})
                }
            }
            }
            value={this.state.checkNewPassword}
        /></View>
               
    
                :
                    <></>}
                
                    <Text style={styles.info}>Email:{this.state.email}</Text>
                   
                    { this.state.editProfile ?
                    <TextInput
                    style={styles.field}
                    keyboardType='default'
                    placeholder='Nueva Bio'
                    onChangeText={text => this.setState({ newBio: text })}
                    value={this.state.newBio}
                />
            :
            <Text style={styles.info}>Bio:{this.state.bio}</Text>
                }
                    <Text style={styles.info}>Age:{this.state.edad}</Text>
                    
                { this.state.editProfile ?
                <TouchableOpacity onPress={() => this.guardarCambios() }>
                    <Text style={styles.logout}>Guardar cambios</Text>
                </TouchableOpacity>
                :
                <></>}

                {/* logout */ }
        <TouchableOpacity onPress={() => {
            if (auth.currentUser.email == this.state.email) {
                this.logOut()
            } else {
                this.setState({ logout: false })
            }
        }}>
            <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>

        {/* mis posteos */ }
                    <Text style={styles.info}>Mis posteos: </Text>
                
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
        marginLeft: 50,
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
        marginLeft: 50,
        marginTop: 25,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 20,
        padding: 6,
        width: 80,
        backgroundColor: 'purple',
    },


})
export default Profile;