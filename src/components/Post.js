import React, { Component, Syle } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList, Image } from 'react-native';
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
        }
    }
    componentDidMount() {
        if (this.props.postData.data.likes) {
            this.setState({
                likes: this.props.postData.data.likes.length,
                myLike: this.props.postData.data.likes.includes(auth.currentUser.email),
            })
        }
    }
    likear() {
        //Agregar mi email a un array
        db.collection('Posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
            .then(() => {
                console.log('likeado...');
                //Cambiar el estado de likes y de mylike.
                this.setState({
                    likes: this.props.postData.data.likes.length,
                    myLike: true
                })
            })
            .catch(e => console.log(e));
    }
    unlike() {
        //Quitar mi email a un array
        db.collection('Posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
            .then(() => {
                console.log('quitando like...');
                //Cambiar el estado de likes y de mylike.
                this.setState({
                    likes: this.props.postData.data.likes.length,
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
            db.collection('Posts').doc(this.props.postData.id).update({
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

    otroProfile(user) {
        this.props.navigation.navigate("OtroProfile", { usuario: user })
    }

    render() {
        return (
            <View style={styles.postContainer}>
                {this.props.postData.data.owner == auth.currentUser.email
                    ?
                    <Text style={styles.user} onPress={() => this.props.navigation.navigate("Profile", {id: this.props.id})} >
                        {this.props.postData.data.owner}
                    </Text>
                    :
                    <Text style={styles.user} onPress={() => this.otroProfile(this.props.postData.data.owner)} >
                        {this.props.postData.data.owner}
                    </Text>
                }

                <Text style={styles.pie}> {this.props.postData.data.description}</Text>

                <Image
                    style={styles.photo}
                    source={{ uri: this.props.postData.data.photo }}
                    resizeMode='cover'
                />
                <Text style={styles.datos}>Cantidad de likes: {this.state.likes}</Text>

                {/* poner el corazonnn */}
                {
                    this.state.myLike ?
                        <TouchableOpacity onPress={() => this.unlike()}>
                            <Text style={styles.unlike}> Ya no me gusta</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.likear()}>
                            <Text style={styles.like}>Me gusta</Text>
                        </TouchableOpacity>
                }
                {/* Listar los comentarios  */}
                {
                    this.props.postData.data.comments ? //si comentarios es true
                        <View>
                            {
                                this.state.vercomentarios ? //apreto ver comentarios (es true)

                                    <View>
                                        <Text style={styles.datos}> Comentarios:</Text>
                                        <FlatList
                                            data={this.state.vertodos ? // apreto ver todos (es true)
                                                this.props.postData.data.comments //me devuelve todos los comments
                                                :
                                                this.props.postData.data.comments.slice(-4)  // me devuelve 4 y tengo boton ver todos
                                            }
                                            keyExtractor={post => post.createdAt.toString()}
                                            renderItem={({ item }) => <Text style={styles.comments}> {item.author}: {item.commentText}</Text>}

                                        />

                                        {this.state.vertodos ? //si apreto boton ver TODOS (es true)
                                            //mostrar boton ver menos
                                            <TouchableOpacity onPress={() => this.vermenos()}>
                                                <Text style={styles.datos}>Ver menos comentarios</Text>
                                            </TouchableOpacity>

                                            : //si no apreto boton ver TODOS (es false)
                                            //mostrar boton ver todos
                                            <TouchableOpacity onPress={() => this.vertodos()}>
                                                <Text style={styles.datos}>Ver todos los comentarios</Text>
                                            </TouchableOpacity>
                                        }

                                        {/* always opcion de ocultarcomentarios */}
                                        <TouchableOpacity onPress={() => this.ocultarcomentarios()}>
                                            <Text style={styles.datos}>Ocultar los comentarios</Text>
                                        </TouchableOpacity>

                                    </View>

                                    : // si no apreto ver comentarios me muestra el boton
                                    <TouchableOpacity onPress={() => this.vercomentarios()}>
                                        <Text style={styles.datos}>Ver los comentarios</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                        :
                        <Text> No hay comentarios</Text>
                }
                {/* Form para nuevo comentario */}
                <View>
                    <TextInput style={styles.comentar}
                        keyboardType='default'
                        placeholder='Escribí tu comentario'
                        onChangeText={(text) => { this.setState({ comment: text }) }}
                        value={this.state.comment}
                    />
                    <TouchableOpacity onPress={() => this.publicarComentario()}>
                        <Text style={styles.comentarr}>Comentar</Text>
                    </TouchableOpacity>
                </View>


            </View>
        )
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

export default Post;

