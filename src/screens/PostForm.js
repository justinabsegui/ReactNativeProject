import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { auth, db } from "../firebase/config";

class PostForm extends Component{
    constructor(props){
        super(props)
        this.state={
            textoPost:'',
        }
    }
    onSubmit(){
        console.log('Posteando...');
        db.collection('Posts').add({
            owner: auth.currentUser.email,
            createdAt: Date.now(),
            textoPost: this.state.textoPost,
            photo: this.state.url,
        })
        .then(()=>{
            console.log('posteado funciona')
            this.setState({
                textoPost: ''
            })
            this.props.navigation.pop();
        })
        .catch( e => console.log(e))
    }
    render(){
        return(
            <View style={styles.formContainer}>
            <Text>Nuevo Post</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({textoPost: text})}
                    placeholder='Escriba aquí...'
                    keyboardType='default'
                    value={this.state.textoPost}
                    />
                <TouchableOpacity style={styles.button} onPress={()=>this.onSubmit()}>
                    <Text style={styles.textButton}>Postear</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    formContainer:{
        paddingHorizontal:10,
        marginTop: 20,
    },
    input:{
        height:100,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
    },
    button:{
        backgroundColor:'#28A745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4,
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#28A745'
    },
    textButton:{
        color: '#fff'
    }
})
export default PostForm;