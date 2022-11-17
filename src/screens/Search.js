import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { db, auth } from '../firebase/config';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            filteredUsers: [],
            filteredMail: [],
            search: false,
            postSearchText: '',
            userErr: false,
            mailErr: false, 
        }
    }

    componentDidMount() {
        db.collection('datosUsuario').onSnapshot(
            docs => {

                let info = [];

                docs.forEach(doc => {
                    info.push({ id: doc.id, data: doc.data() })
                });

                this.setState({ users: info });
            }
        )
    }

    preventSubmit(event) {
        event.preventDefault();
        
        let textToFilter = this.state.postSearchText.toLowerCase();

        const filteredUsers = this.state.users.filter(user => user.data.name?.toLowerCase().includes(textToFilter));

        const filteredMail = this.state.users.filter(user => user.data.owner?.toLowerCase().includes(textToFilter));

        if (filteredUsers == ''){
            this.setState({userErr: true})
        } else {this.setState({userErr: false})}
        
        if (filteredMail == ''){
            this.setState({mailErr: true})
        } else {this.setState({userErr: false})}

        this.setState({
            filteredUsers: filteredUsers
        });

        this.setState({
            filteredMail: filteredMail
        });
    };


    controlChanges(event) {
        this.setState({ postSearchText: event.target.value });
    };

    clear() {
        this.setState({
            result: [],
            search: false,
            postSearchText: '',
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder='Search'
                    keyboardType='default'
                    onChangeText={text => this.setState({ postSearchText: text })}
                    value={this.state.postSearchText}
                    onChange={(event) => this.controlChanges(event)}
                    style={styles.input}
                />
                {this.state.postSearchText == '' ?
                    <Text>El campo no puede estar vacio</Text>
                    :
                    <TouchableOpacity onPress={(event) => this.preventSubmit(event)} style={styles.button}>
                        <Text style={styles.textButton}>Enviar</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.clear()}>
                    <Text>Clear search</Text>
                </TouchableOpacity>
                {this.state.userErr ?
                    <Text>El usuario {this.state.postSearchText} no existe</Text>
                    :
                    <FlatList
                        style={styles.list}
                        data={this.state.filteredUsers}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Text>{item.data.name}</Text>}
                    />
                }  
                {this.state.mailErr ?
                    <Text>El mail {this.state.postSearchText} no existe</Text>
                    :
                    <FlatList
                        style={styles.list}
                        data={this.state.filteredMail}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Text>{item.data.owner}</Text>}
                    />
                }  
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