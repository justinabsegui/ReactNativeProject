import React, { Component } from 'react';
import { View } from 'react-native';
import Camara from '../components/Camara';
import PostForm from './PostForm';

class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state={
            description:'',
            showCamera: true,
            url:''// la url de la imagen la tengo en camara pero la necesito aca
        }
    }

    onImageUpload(url) {
        this.setState({
            showCamera: false,
            url: url
        });
    }
    
    render(){
        return(
            <View>
                { this.state.showCamera ? 
                    <Camara onImageUpload={(url)=>this.onImageUpload(url)}/> //metodo para guardar imagen
                    :
                    <PostForm/>
                }
            </View>
        )
            

    }
}
export default NewPost;