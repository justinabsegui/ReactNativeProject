import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';

class OtroProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            bio: '',
            edad: '',
            logout: true,
            posts: [],

        }
    }

    componentDidMount() {
        if (auth.currentUser.email) { // Chequear que existe auth.currentUser.email
            const email = auth.currentUser.email;
            console.log(this.props.route.params.usuario);

            db.collection('datosUsuario').where('owner', '===', this.props.route.params.usuario).onSnapshot(   // No traer todos los datos de la colección, filtrarlos al mismo tiempo que los traemos
                docs => {//todos datos de la colección
                    let user = '';
                    // Corregir filter
                    docs.forEach(doc => {
                        //    Condicional: si las props están vacias, es tu perfil. Sino, es el de otro usuario (o es el tuyo y hay que comparar el mail con auth.currentUser.email)
                        const data = doc.data();
                        user = data
                    });

                    this.setState({
                        email: user.owner,
                        name: user.name,
                        bio: user.bio,
                        edad: user.edad
                    })

                }
            );
            db.collection('Posts').where('owner', '==', this.props.route.params.usuario).onSnapshot(
                docs => {
                    let posteos = [];

                    docs.forEach(doc => {
                        posteos.push({
                            id: doc.id,
                            data: doc.data()
                        }
                        )
                    })

                    this.setState({
                        posts: posteos,
                    })

                }
            )

        }
    }

    logOut() {
        auth.signOut();
        this.props.navigation.navigate('Login')
    }

    render() {

        return (
            <View>
                <Text>Username:{this.state.name}</Text>
                <Text>Email:{this.state.email}</Text>
                <Text>Bio:{this.state.bio}</Text>
                <Text>Age:{this.state.edad}</Text>

                {/* <Text>User's Posts: {this.state.posts}</Text> */}

                <FlatList
                    data={this.state.posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Post postData={item} />}
                />

                <TouchableOpacity onPress={() => {
                    if (auth.currentUser.email == this.state.email) {
                        this.logOut()
                    } else {
                        this.setState({ logout: false })
                    }
                }}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    button: {
        color: 'blue',
        border: 'none',
        padding: 5
    }
})
export default OtroProfile;