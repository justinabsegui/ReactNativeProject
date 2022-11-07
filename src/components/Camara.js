import { Camera } from 'expo-camera'
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

class Camara extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: '',
            showCamera: false,
            permission: false
        }
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
            .catch(() => (
                this.setState({ permission: false, showCamera: false }))
            )
    }

    // Para sacar la foto crearemos un método c/método interno takePicutreAsync() incluido en Camera.
    takePicture() {
        this.metodosDeCamara.takePictureAsync()
            .then(photo => {
                // Actualizamos estados para guardar la url temporal de la foto y ocultar la cámara para mostrar el preview de la foto.
                this.setState({
                    photo: photo.uri, //Es una uri interna temporal de la foto.
                    showCamera: false
                })
            })
    }
    //Para guardar la foto creamos un método savePhoto() dentro de nuestro componente
    savePhoto() {
        fetch(this.state.photo) // obtener la foto desde su ubicación temporal dentro del dispositivo
            .then(res => res.blob()) //obtengo info de foto
            .then(image => {// la guardo en Firebase
                const ref = storage.ref(`photos/${Date.now()}.jpg`) //creo archivo 
                ref.put(image) //con imagen
                    .then(() => {
                        ref.getDownloadURL()// obtengo url de acceso público
                            .then(url => { //mando la url pública al posteo para guardarla con los demás datos
                                this.props.onImageUpload(url);
                            })
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
                {/* estilos, cámara (frontal o trasera), referencia a  "cámara” para usar métodos internos.
        this.metodosDeCamara debe existir dentro del constructor */}
                {
                    this.state.showCamera &&
                    <View style={styles.camera}>
                        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={reference => this.camera = reference} />
                        <TouchableOpacity style={styles.shootButton} onPress={() => this.takePicture()}>
                            <Text>Shoot</Text>
                        </TouchableOpacity>
                    </View>
                }
                {/* botón que saca la foto con  método takePicture() */}
                {
                    this.state.photo !== "" &&
                    <Image style={styles.preview} source={{ uri: this.state.photo }} />
                }
                {/* botones aceptar o borrar foto */}
                <View style={styles.button}>

                    <TouchableOpacity onPress={() => this.savePhoto()}>
                        <Text>Aceptar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.clearPhoto()}>
                        <Text>Descartar imagen</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 800,
        height: 800,
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