import React, { Component, Syle } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { auth, db } from "../firebase/config";
import firebase from "firebase";


//ver un posteo likear y comentar

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likes: 0,
            myLike: false,
            comment: '',
            vercomentarios: false,
            vertodos: false,
            borrar: false,
        }
    }
    componentDidMount() {
        if (this.props.postData.likes) {
            this.setState({
                likes: this.props.postData.likes.length,
                myLike: this.props.postData.likes.includes(auth.currentUser.email),
            })
        }
    }
    likear() {
        //Agregar mi email a un array
        db.collection('Posts').doc(this.props.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
            .then(() => {
                console.log('likeado...');
                //Cambiar el estado de likes y de mylike.
                this.setState({
                    likes: this.props.postData.likes.length,
                    myLike: true
                })
            })
            .catch(e => console.log(e));
    }
    unlike() {
        //Quitar mi email a un array
        db.collection('Posts').doc(this.props.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
            .then(() => {
                console.log('quitando like...');
                //Cambiar el estado de likes y de mylike.
                this.setState({
                    likes: this.props.postData.likes.length,
                    myLike: false
                })
            })
            .catch(e => console.log(e));
    }
    publicarComentario() {
        //Armar el comentario.
        console.log('Guardando comentario...');
        let oneComment = {
            author: auth.currentUser.email,
            createdAt: Date.now(),
            commentText: this.state.comment
        }
        if (oneComment.commentText !== '') {
            //Actualizar comentario en la base. Puntualmente en este documento.
            //Saber cual es el post que queremos actualizar
            db.collection('Posts').doc(this.props.id).update({
                comments: firebase.firestore.FieldValue.arrayUnion(oneComment)
            })
                .then(() => {
                    //Cambiar un estado para limpiar el form
                    console.log('Comentario guardado');
                    this.setState({
                        comment: ''
                    })
                })
                .catch(e => console.log(e))
        }
    }
    vercomentarios() {
        this.setState({
            vercomentarios: true,
        })
    }

    ocultarcomentarios() {
        this.setState({
            vercomentarios: false,
            vertodos: false,
        })
    }
    vertodos() {
        this.setState({
            vertodos: true,
        })
    }

    vermenos() {
        this.setState({
            vercomentarios: true,
            vertodos: false,
        })
    }

    otroProfile(usuario) {
        this.props.navigation.navigate("OtroProfile", { user: usuario })
    }

    alertaBorrarMensaje() {
        this.setState({ alertaBorrarMensaje: 'Estas seguro que queres borrar este comentario?', borrar: true })
    }

    borrarPosteos() {
        db.collection('Posts').doc(this.props.id).delete()
    }

    noBorrar() {
        this.setState({ alertaBorrarMensaje: '', borrar: false })
    }

    render() {
        return (
            <View style={styles.postContainer}>
                {this.props.user == auth.currentUser.email
                    ?
                    <Text style={styles.user} onPress={() => this.props.navigation.navigate("Profile")} >
                        {this.props.user}
                    </Text>
                    :
                    <Text style={styles.user} onPress={() => this.otroProfile(this.props.user)} >
                        {this.props.user}
                    </Text>
                }

                <Text style={styles.pie}> {this.props.postData.description}</Text>

                <Image
                    style={styles.photo}
                    source={{ uri: this.props.postData.photo }}
                    resizeMode='cover'
                />

                {/* poner el corazonnn */}
                <View style={styles.likes}>
                    {this.state.myLike ?
                        <TouchableOpacity style={styles.cora} onPress={() => this.unlike()}>
                            <FontAwesome name="heart" size={24} color="red" />

                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.cora} onPress={() => this.likear()}>
                            <Feather name="heart" size={24} color="black" />
                        </TouchableOpacity>
                    }
                    <Text style={styles.cora}>Cantidad de likes: {this.state.likes}</Text>
                </View>
                {/* Form para nuevo comentario */}
                <View style={styles.comentarios}>
                    <TextInput style={styles.comentar}
                        keyboardType='default'
                        placeholder='Escribí tu comentario'
                        onChangeText={(text) => { this.setState({ comment: text }) }}
                        value={this.state.comment}
                    />
                    <TouchableOpacity onPress={() => this.publicarComentario()}>
                        <Text style={styles.comentarr}>Comentar</Text>
                    </TouchableOpacity>
                </View>{

                /* Listar los comentarios  */}
                {
                    this.props.postData.comments ? //si comentarios es true
                        <View>
                            {
                                this.state.vercomentarios ? //apreto ver comentarios (es true)

                                    <View>
                                        <Text style={styles.botonverc}> Comentarios:</Text>
                                        <FlatList style={styles.botonverc}
                                            data={this.state.vertodos ? // apreto ver todos (es true)
                                                this.props.postData.comments //me devuelve todos los comments
                                                :
                                                this.props.postData.comments.slice(-4)  // me devuelve 4 y tengo boton ver todos
                                            }
                                            keyExtractor={post => post.createdAt.toString()}
                                            renderItem={({ item }) => <Text onPress={() => {
                                                item.author == auth.currentUser.email
                                                ?
                                                this.props.navigation.navigate("Profile")
                                                :
                                                this.otroProfile(item.author);
                                                {console.log(item.author)}

                                            }} 
                                            style={styles.comments}> {item.author}: {item.commentText}</Text>}

                                        />

                                        {this.state.vertodos ? //si apreto boton ver TODOS (es true)
                                            //mostrar boton ver menos
                                            <TouchableOpacity onPress={() => this.vermenos()}>
                                                <Text style={styles.botonverc}>Ver menos comentarios</Text>
                                            </TouchableOpacity>

                                            : //si no apreto boton ver TODOS (es false)
                                            //mostrar boton ver todos
                                            <TouchableOpacity onPress={() => this.vertodos()}>
                                                <Text style={styles.botonverc}>Ver todos los comentarios</Text>
                                            </TouchableOpacity>
                                        }

                                        {/* always opcion de ocultarcomentarios */}
                                        <TouchableOpacity onPress={() => this.ocultarcomentarios()}>
                                            <Text style={styles.botonverc}>Ocultar los comentarios</Text>
                                        </TouchableOpacity>

                                    </View>

                                    : // si no apreto ver comentarios me muestra el boton
                                    <TouchableOpacity onPress={() => this.vercomentarios()}>
                                        <Text style={styles.botonverc}>Ver los comentarios</Text>
                                    </TouchableOpacity>

                            }
                        </View>
                        :
                        <Text style={styles.botonverc}> No hay comentarios</Text>
                }

                { //form para borrar
                    this.props.postData.owner == auth.currentUser.email ?
                        <>
                            <TouchableOpacity onPress={() => this.alertaBorrarMensaje()}>
                                <Text style={styles.comentar}>Borrar posteo</Text>
                            </TouchableOpacity>

                            <Text>{this.state.alertaBorrarMensaje}</Text>
                            {this.state.borrar ?
                                <View>
                                    <TouchableOpacity onPress={() => this.borrarPosteos()}>
                                        <Text style={styles.comentar}>Si</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.noBorrar()}>
                                        <Text style={styles.comentar}>No</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <></>
                            }
                        </>
                        :
                        <></>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    photo: {
        height: 250,
        width: '100%'
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
    pie: {
        color: 'purple',
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexWrap: 'wrap',
        marginBottom: 5,
    },

    likes: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent: "flex-start",
        margin: 10,
    },
    cora: {
        margin: 10,
    },
    comentarios: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent: "flex-start",
        margin: 10,
    },
    comentar: {
        color: 'black',
        opacity: 10,
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 6,
        width: 200,
    },
    comentarr: {
        color: 'white',
        opacity: 10,
        borderRadius: 20,
        padding: 6,
        width: 80,
        backgroundColor: 'purple',
        margin: 5,
    },
    botonverc: {
        color: 'purple',
        opacity: 50,
        borderRadius: 20,
        padding: 6,
        width: 200,
        marginLeft: 15,
    }


})

export default Post;

