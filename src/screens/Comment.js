import { Text, View, StyleSheet, FlatList } from 'react-native'
import React, { Component } from 'react'
import { auth, db } from '../../firebase/config';
import firebase from 'firebase'
import { TextInput, TouchableOpacity } from 'react-native-web';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comentarios: [],
      opinion: ""
    }
  }
  componentDidMount() {
    console.log(this.props)
    db.collection("Posts").doc(this.props.route.params.id).limit(10).onSnapshot(
      docs => {
        this.setState({
          id: docs.id,
          comentarios: docs.data().comentarios,

        }, () => console.log(this.state.comentario))
      }
    )
  }
  comentar(text) {
    db.collection("Posts").doc(this.props.route.params.id).update({
      comentarios: firebase.firestore.FieldValue.arrayUnion({
        owner: auth.currentUser.email,
        cretedAt: Date.now(),
        comentario: text
      })
    })
      .then(resp => {
        this.setState({
          comentario: ""
        }, () => console.log(this.state.opinion))
      })
      .catch(err => console.log(err))
  }

  render() {
    return (

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="Comentar"
          onChangeText={(text) => this.setState({ opinion: text })}

        />
        <TouchableOpacity style={styles.registro} onPress={() => this.comentar(this.state.opinion)}>
          <MaterialCommunityIcons name="send-circle" size={24} color="blue" />
        </TouchableOpacity>
        <FlatList
          data={this.state.comentarios}
          keyExtractor={(item) => item.createdAt}
          renderItem={({ item }) => <Text style={styles.subtitle}>{item.owner}: {item.comentario}</Text>}
        />

      </View>
    )
  }
}
const styles = StyleSheet.create({
  photo: {
    height: 250,
  },
  postContainer: {
    borderRadius: 20,
    borderColor: 'purple',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 15
  },
  user: {
    color: 'purple',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
    margin: 10,
  },
  datos: {
    display: 'flex',
    justifyContent: 'left',
    alignContent: 'left',
    flexWrap: 'wrap',
    marginBottom: 5
  },

  like: {
    color: 'red',
    display: 'flex',
    justifyContent: 'left',
    alignContent: 'left',
  },
  unlike: {
    color: 'black',
    display: 'flex',
    justifyContent: 'left',
    alignContent: 'left',

  },
  pie: {
    color: 'purple',
    display: 'flex',
    justifyContent: 'left',
    alignContent: 'left',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  comentar: {
    color: 'black',
    display: 'flex',
    opacity: 10,
    justifyContent: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
    borderColor: 'purple',
    borderWidth: 1,
    borderRadius: 20,
    padding: 6,
    width: 300,
    margin: 5,
    padding: 6,
  },
  comentarr: {
    color: 'white',
    display: 'flex',
    opacity: 10,
    justifyContent: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
    borderRadius: 20,
    padding: 6,
    width: 80,
    backgroundColor: 'purple',
  },
  comments: {
    display: 'flex',
    justifyContent: 'left',
    alignContent: 'left',
    flexWrap: 'wrap',
  },

})

export default Comment;