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
            searchText: '',
            userErr: false,
            mailErr: false, 
            emptySearch: '', 
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

    preventSubmit() {
        
        let textToFilter = this.state.searchText.toLowerCase()

        const filteredUsers = this.state.users.filter(user => user.data.name?.toLowerCase().includes(textToFilter));

        const filteredMail = this.state.users.filter(user => user.data.owner?.toLowerCase().includes(textToFilter));

        if (filteredUsers == ''){
            this.setState({userErr: true})
        } else {this.setState({userErr: false})}
        
        if (filteredMail == ''){
            this.setState({mailErr: true})
        } else {this.setState({mailErr: false})}

        this.setState({
            filteredUsers: filteredUsers,
            filteredMail: filteredMail
        });
    };

    controlChanges(event) {
        this.setState({ searchText: event.target.value });
    };

    clear() {
        this.setState({
            result: [],
            searchText: '',
            userErr: false,
            mailErr: false,

        })
    };

    render() {
        return (
            <View >
                 {this.state.emptySearch !== '' ?
                    <Text style={styles.error}>{this.state.emptySearch}</Text>
                    :
                    <></>}
                <TextInput style={styles.container}
                    placeholder='Search'
                    keyboardType='default'
                    onChangeText={text => {
                        
                        if (text == '') {
                        this.setState({ emptySearch: "Ingrese datos de búsqueda", 
                        searchText: text, userErr: false, mailErr: false});
                    } else {
                        this.setState({ emptySearch: '', searchText: text});
                        this.preventSubmit();
                    }
               }}
                    value={this.state.searchText}
                    onChange={(event) => this.controlChanges(event)}
                />
                
                <TouchableOpacity onPress={() => this.clear()}>
                    <Text style={styles.textButton}>Clear search</Text>
                </TouchableOpacity>
                {this.state.userErr ?
                    <Text>El usuario {this.state.searchText} no existe</Text>
                    :
                    this.state.searchText != ''?
                    <View>
                    <Text>Nombres de usuario</Text>
                    <FlatList
                        style={styles.list}
                        data={this.state.filteredUsers}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Text>{item.data.name}</Text>}
                    />
                    </View>
                    :
                    <></>
                    
                }  
                {this.state.mailErr ?
                    <Text>El mail {this.state.searchText} no existe</Text>
                    :
                    this.state.searchText != ''?
                    <View>
                    <Text>Mails de usuario</Text>
                    <FlatList
                        style={styles.list}
                        data={this.state.filteredMail}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Text>{item.data.owner}</Text>}
                    />
                    </View>
                    :
                    <></>
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