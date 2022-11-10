import { Camera } from 'expo-camera'
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { storage } from '../firebase/config';

class Camara extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: '', //url temporal
            showCamera: false,
            permission: false
        }
        this.metodosDeCamara = ''
    }

    //solicitar permisos a la cámara del dispositivo 
    componentDidMount() {
        Camera.requestCameraPermissionsAsync() // el método requestCameraPermissionsAsync() del componente Camera
            .then(() => {
                this.setState({
                    showCamera: true,
                    permission: true,//modificamos estado booleano.
                })
            })
            .catch(e => console.log(e)) // this.setState({ permission: false, showCamera: false }))
    }

    // Para sacar la foto crearemos un método c/método interno takePicutreAsync() incluido en Camera.
    takePicture() {
        console.log(this.metodosDeCamara);
        this.metodosDeCamara.takePictureAsync()
            .then(photo => {
                // Actualizamos estados para guardar la url temporal de la foto y ocultar la cámara para mostrar el preview de la foto.
                this.setState({
                    photo: photo.uri, //Es una uri interna temporal de la foto.
                    showCamera: false
                })
            })
            .catch(e => console.log(e))
    }

    //Para guardar la foto creamos un método savePhoto() dentro de nuestro componente
    savePhoto() {
        fetch(this.state.photo) // obtener la foto desde su ubicación temporal dentro del dispositivo
            .then(res => res.blob()) //obtengo info de foto
            .then(image => {// la guardo en Firebase
                //Crear el destino y nombre con el que se guarda la foto en Storage
                const ref = storage.ref(`photos/${Date.now()}.jpg`) //creo archivo 
                ref.put(image) //con imagen
                    .then(() => {
                        ref.getDownloadURL()// obtengo url de acceso público
                            .then(url =>  //mando la url pública al posteo para guardarla con los demás datos
                                this.props.onImageUpload(url))
                    })
            })
            .catch(e => console.log(e))
    }

    clearPhoto() {
        this.setState({ photo: '' });
    }

    render() {
        return (
            <View>
                {
                    this.state.permission ?
                        this.state.showCamera ?
                            <View style={styles.camera}>
                                <Camera
                                    //estilos, cámara (frontal o trasera), referencia a  "cámara” para usar métodos internos.
                                    // this.metodosDeCamara debe existir dentro del constructor 
                                    style={styles.camera}
                                    type={Camera.Constants.Type.back}
                                    ref={(metodos) => this.metodosDeCamara = metodos}
                                />
                                <View style={styles.button}>
                                    {/*   botón que saca la foto con  método takePicture() */}
                                    <TouchableOpacity style={styles.shootButton} onPress={() => this.takePicture()}>
                                        <Text>Shoot</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                                :
                                <View style={styles.button}>
                                    <Image
                                        style={styles.preview}
                                        source={{ uri: this.state.photo }}
                                        resizeMode='cover'
                                    />
                                    {/* botones aceptar o borrar foto  */}
                                    <TouchableOpacity onPress={() => this.savePhoto()}>
                                        <Text>Aceptar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.clearPhoto()}>
                                        <Text>Descartar imagen</Text>
                                    </TouchableOpacity>
                                </View>
                         
                    :
                    <Text>No tengo permisos</Text>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    preview: {
        width: '100vw',
        height: 300,
    },
    camera: {
        width: '100%',
        height: 300,
    },
    shootButton: {
        flex: 0,
        borderRadius: 5,
        alignSelf: 'center',
        margin: 20
    },
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
})

export default Camara;