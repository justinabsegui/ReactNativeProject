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
                    showCamera: true,
                })
                this.props.navigation.navigate('Home')
            })
            .catch(e => console.log(e))
    }
    // onSubmit(){
    //     // console.log('Posteando...');
    //     db.collection('Posts').add({
    //         owner: auth.currentUser.email,
    //         // description: this.state.description,
    //         photo: this.state.url,// estoy en undefined tengo q traer url de la foto
    //         createdAt: Date.now(),
    //         description: this.state.description,

    //     })
    //     .then(()=>{
    //         // console.log('posteado funciona')
    //         this.setState({
    //             description: ''
    //         })
    //         this.props.navigation.pop();
    //     })
    //     .catch( e => console.log(e))
    //     //this.props.navigation.navigate('Profile')
    // }
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
                        <ScrollView>
                            <Text>Nuevo Post</Text>
                            <TextInput style={styles.input}
                                placeholder='Descripción'
                                keyboardType='text'
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                            />
                            {/* <Camara onImageUpload={(url) => this.onImageUpload(url)} /> */}
                            <TouchableOpacity style={styles.button}
                                onPress={() => this.createPost(this.state.description, this.state.photo)}>
                                <Text style={styles.textButton}>Postear</Text>
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
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#28A745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#28A745'
    },
    textButton: {
        color: '#fff'
    }
})
export default NewPost;