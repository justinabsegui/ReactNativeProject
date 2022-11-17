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


    render() {
        return (
            <View style={styles.postContainer}>
                 <TouchableOpacity 
                    onPress={() => {
                        this.props.navigation.navigate('ProfileStack', {user: this.props.postData.data.owner})}}>
                         {/* Pasar props de datos de usuario a Profile */}
                    <Text> User: {this.props.postData.data.owner}</Text>
                </TouchableOpacity>
                <Image
                    style={styles.photo}
                    source={{ uri: this.props.postData.data.photo }}
                    resizeMode='cover'
                />
                <Text> Caption: {this.props.postData.data.description}</Text>
                <Text>Likes: {this.state.likes}</Text>
                {
                    this.state.myLike ?
                        <TouchableOpacity onPress={() => this.unlike()}>
                            <Text>Quitar like</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.likear()}>
                            <Text>Me gusta</Text>
                        </TouchableOpacity>
                }
                {/* Listar los comentarios  */}
                {
                    this.props.postData.data.comments ? //si comentarios es true
                        <View>
                            {
                                this.state.vercomentarios ? //si ver comentarios es true (apreto boton ver comentarios)
                                    <View>
                                        <FlatList
                                            data={
                                                this.state.vertodos ? // ver todos es true
                                                    this.props.postData.data.comments
                                                    : //me devuelve todos los comments
                                                    this.props.postData.data.comments.slice(-4)  // me devuelve 4 y tengo boton ver todos
                                            }
                                            keyExtractor={post => post.createdAt.toString()}
                                            renderItem={({ item }) => <Text> {item.author}: {item.commentText}</Text>}
                                        />
                                        {this.state.vertodos ? //si ver TODOS es true (apreto boton ver TODOS)
                                            //mostrar boton ver menos
                                            <TouchableOpacity onPress={() => this.vermenos()}>
                                                <Text style={styles.button}>Ver menos comentarios</Text>
                                            </TouchableOpacity>
                                            : // ver todos es false, mostrar boton ver todos
                                            <TouchableOpacity onPress={() => this.vertodos()}>
                                                <Text style={styles.button}>Ver todos los comentarios</Text>
                                            </TouchableOpacity>
                                        }
                                        {/* always opcion de ocultarcomentarios */}
                                        <TouchableOpacity onPress={() => this.ocultarcomentarios()}>
                                            <Text style={styles.button}>Ocultar los comentarios</Text>
                                        </TouchableOpacity>
                                    </View>

                                    : // si no apreto ver comentarios me muestra el boton
                                    <TouchableOpacity onPress={() => this.vercomentarios()}>
                                        <Text style={styles.button}>Ver los comentarios</Text>
                                    </TouchableOpacity>
                            }
                            <View>

                            </View>
                        </View>
                        :
                        <Text> No hay comentarios</Text>
                }

                {/* Form para nuevo comentario */}
                <View>
                    <TextInput keyboardType='default'
                        placeholder='Escribí tu comentario'
                        onChangeText={(text) => { this.setState({ comment: text }) }}
                        value={this.state.comment}
                    />
                    <TouchableOpacity onPress={() => this.publicarComentario()}>
                        <Text style={styles.button} >Comentar</Text>
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
        borderColor: '#ccc',
        borderWidth: 1,
        borderStyle: 'solid',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
        marginHorizontal: 10,
    },
    closeButton: {
        backgroundColor: '#DC3545',
        color: '#fff',
        padding: 5,
        borderRadius: 4,
        margin: 5,
        alignSelf: 'flex-end'
    }
})

export default Post;

