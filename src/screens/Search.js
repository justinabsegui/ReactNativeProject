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
            <View >
                <TextInput style={styles.container}
                    placeholder='Search'
                    keyboardType='default'
                    onChangeText={text => this.setState({ postSearchText: text })}
                    value={this.state.postSearchText}
                    onChange={(event) => this.controlChanges(event)}
                    
                />
                {this.state.postSearchText == '' ?
                    <Text>El campo no puede estar vacio</Text>
                    :
                    <TouchableOpacity onPress={(event) => this.preventSubmit(event)} >
                        <Text style={styles.textButton}>Enviar</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.clear()}>
                    <Text style={styles.textButton}>Clear search</Text>
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
        color: 'black',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        width: 300,
        height: 44,
        padding: 10,
    },
   
    list: {
        width: '100%',
        height: '100%',
    },
    button: {
        color:'white',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: 40,
        margin: 5,
        backgroundColor: 'purple',
    },
    textButton: {
        color: 'black',
        display: 'flex',
        opacity: 10,
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap',
        borderColor: 'purple',
        backgroundColor: 'purple',
        borderWidth: 1,
        borderRadius: 20,
        padding: 6,
        width: 100,
        margin: 5,
        padding: 6,
    },

})
export default Search;