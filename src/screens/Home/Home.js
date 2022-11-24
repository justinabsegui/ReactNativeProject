import { TabActions } from "@react-navigation/native";
import React, { Component } from "react";
import { StyleSheet, FlatList, ScrollView } from 'react-native';
import { db, auth } from '../../firebase/config';
import Post from "../../components/Post";

class Home extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
        }

    };

    componentDidMount() {
        //Trae la info de los posts
        db.collection('Posts')
        .orderBy('createdAt', 'desc') // Trae los más nuevos
        .limit(10) // Máximo 10 posteos 
        .onSnapshot( 
            docs => {
                let posteos = [];
                docs.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    posteos.push({ data, id });
                });
                this.setState({ posts: posteos })
            }
        )
    }


    render() {
        console.log(this.state.posts)
        return (
          
                <FlatList
                    data={this.state.posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Post postData={item.data} id={item.id} user={item.data.owner} navigation={this.props.navigation} />}
                />
         
        )
    }
}
const styles = () => StyleSheet.create({
    container: {
        textAlign: 'center',
        padding: 10,
    },
})
export default Home;
