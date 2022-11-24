import React, { Component } from 'react';
import { Camera } from 'expo-camera';
import { storage } from '../firebase/config';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

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
        // console.log(this.metodosDeCamara);
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
                const refStorage = storage.ref(`photos/${Date.now()}.jpg`) //creo archivo 
                refStorage.put(image) //con imagen
                    .then(() => {
                        refStorage.getDownloadURL()// obtengo url de acceso público
                            .then(url =>  //mando la url pública al posteo para guardarla con los demás datos
                                this.props.onImageUpload(url))
                    })
            })
            .catch(e => console.log(e))
    }

    clearPhoto() {
        this.setState({
            photo: '',
            showCamera: true
        });
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
                                    type={Camera.Constants.Type.front}
                                    ref={(metodos) => this.metodosDeCamara = metodos}
                                />
                                {/*   botón que saca la foto con  método takePicture() */}
                                <TouchableOpacity onPress={() => this.takePicture()}>
                                    <Text style={styles.shootButton}>Sacar foto</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View styles={styles.botones}>
                                <Image
                                    style={styles.preview}
                                    source={{ uri: this.state.photo }}
                                    resizeMode='cover'
                                />
                                {/* botones aceptar o borrar foto  */}
                                <View styles={styles.comentar}>
                                    <TouchableOpacity onPress={() => this.savePhoto()}>
                                        <Text style={styles.button}>Aceptar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.clearPhoto()}>
                                        <Text style={styles.button}>Descartar imagen</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        :
                        <Text>No tengo permisos</Text>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    camera: {
        width: '100%',
        height: 710,
    },
    preview: {
        width: '100%',
        height: 710,
    },
    botones: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignContent: "flex-start",
        justifyContent: 'space-around',
        margin: 10,
    },
    button: {
        color: 'white',
        opacity: 10,
        borderRadius: 20,
        padding: 6,
        width: "40%",
        backgroundColor: 'purple',
        margin: 5,
    },
    shootButton: {
        display: 'flex',
        color: 'white',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 5,
        backgroundColor: 'purple',
    },

})

export default Camara;