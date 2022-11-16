import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Post from '../components/Post';
import { db, auth } from '../firebase/config';

class Profile extends Component {
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
        const email = auth.currentUser.email;

        db.collection('datosUsuario').onSnapshot(
            docs => {//todos datos de la colección
                let user;

                docs.forEach(doc => { //por cadb a documento, quiero un doc y la función que ejecutaré por cada doc
                    const data = doc.data();
                    if (data.owner === this.props.postData.data.owner){
                        user = data
                    } else if (data.owner === email) {
                        user = data
                    }
                });

                console.log(user);
                this.setState({
                    email: user.owner,
                    name: user.name,
                    bio: user.dni,
                    edad: user.edad
                });
            }
        )
        db.collection('Posts').onSnapshot(
            docs => {
                let posteos = [];

                docs.forEach(doc => {
                    posteos.push({
                        id: doc.id,
                        data: doc.data()
                    }
                    )
                })
                const userPosts = posteos.filter(post => (post.data.owner === email));
                this.setState({ posts: userPosts })
            }
        )
    }

    logOut() {
        auth.signOut();
        this.props.navigation.navigate('Welcome')
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
export default Profile;