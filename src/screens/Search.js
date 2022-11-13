import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            search: false,
            searchText: '',
        }
    }

    preventSubmit(event) {
        event.preventDefault()
        db.collection('users').onSnapshot(
            docs => {

                let info = [];

                docs.forEach(doc => {
                    info.push({ id: doc.id, data: doc.data() })
                })
                this.setState({ result: info, search: true })
            }
        )
    }

    controlChanges(event) {
        this.setState({ PostSearchText: event.target.value })
    }

    filterUser() {
        let textToFilter = this.state.PostSearchText.toLowerCase();

        let userName = this.state.result.data.username;
        this.setState({
            result: userName.filter((user) => user.toLowerCase().includes(textToFilter))
        })
    }

    clear() {
        this.setState({
            result: [],
            search: false,
            PostSearchText: '',
        })
    };



    render() {
        console.log(this.state.result);
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder='   Search '
                    keyboardType='default'
                    onChangeText={text => this.setState({ PostSearchText: text })}
                    value={this.state.PostSearchText}
                    onChange={(event) => this.controlChanges(event)}
                    style={styles.input}
                />
                {this.state.textSearch == '' ?
                    <Text>El campo no puede estar vacio</Text>
                    :
                    <TouchableOpacity onPress={(event) => this.preventSubmit(event)}style={styles.button}>
                        <Text style={styles.textButton}>Enviar</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.clear()}>
                    <Text>Clear search</Text>
                </TouchableOpacity>
                {/* {this.state.dataSearchResults.length === 0 ?
                    <FlatList
                        style={styles.list}
                        data={this.state.result}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Text>{item.data.username}</Text>}
                    />
                    :
                    <Text>Sorry, that user does not exist</Text>
                } */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
    },
    input: {
        width: 300,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: '#00ADB5',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    list: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#00ADB5',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    textButton: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },

})
export default Search;