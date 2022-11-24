import React, { Component } from 'react';
import { ScrollView, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from "../firebase/config";
import Camara from '../components/Camara';

class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            description: '',
            createdAt: '',
            photo: '',// la url de la imagen la tengo en camara pero la necesito aca
            showCamera: true,
        }
    }
    createPost(texto, photo) {
        db.collection('Posts').add({
            owner: auth.currentUser.email,
            description: texto,
            photo: photo,
            likes: [],
            comments: [],
            createdAt: Date.now()
        })
            .then(() => {
                this.setState({
                    description: '',
                })
                this.props.navigation.navigate('Home')
            })
            .catch(e => console.log(e))
    }
    onImageUpload(url) {
        this.setState({
            showCamera: false,
            photo: url
        });
    }
    render() {
        return (
            <ScrollView style={styles.formContainer}>
                {
                    this.state.showCamera ?
                        <Camara onImageUpload={url => this.onImageUpload(url)} /> //metodo para guardar imagen
                        :
                        <ScrollView style={styles.borde}>
                            <TextInput style={styles.input}
                                placeholder='Descripción'
                                keyboardType='text'
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                            />
                            <TouchableOpacity onPress={() => this.createPost(this.state.description, this.state.photo)}>
                                <Text style={styles.button}>Postear</Text>
                            </TouchableOpacity>
                        </ScrollView>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 10,
        marginTop: 20,
    },
    input: {
        height: 100,
        padding: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        opacity: 10,
        borderRadius: 20,
        padding: 10,
        width: 80,
        backgroundColor: 'purple',
        margin: 5,
    },
    borde: {
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
    }

})
export default NewPost;