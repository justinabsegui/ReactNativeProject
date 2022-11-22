import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import TabNavigation from './src/components/TabNavigation';
import NewPost from './src/screens/NewPost';
// import Search from './src/screens/Search';
import Camara from './src/components/Camara';
import Post from './src/components/Post';
import Profile from './src/screens/Profile';
import OtroProfile from './src/screens/OtroProfile';
// import Comment from './src/screens/Comment';

const Stack = createNativeStackNavigator();


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer >
      <Stack.Navigator>
      <Stack.Screen name="Login" options={ {  headerTitle: "WE POST IT"} }  component={Login} />
      <Stack.Screen name="Register" options={ { headerTitle: "REGISTRATE EN WE POST IT" } } component={Register} />
      <Stack.Screen name="TabNavigation" options={ { headerShown: false } }   component={TabNavigation} />  
      {/* <Stack.Screen name="Search" component={Search} /> */}
      {/* <Stack.Screen name="NewPost" component={NewPost} /> */}
      <Stack.Screen name="Camara" options={ { headerTitle: 'MOMENTO DE FOTO' } }  component={Camara} />
      {/* <Stack.Screen name="Profile" component={Profile} /> */}
      <Stack.Screen name="OtroProfile" options={ { headerTitle: 'VISITANDO PERFILES' } } component={OtroProfile} />
      {/* <Stack.Screen name="Comment" component={Comment} /> */}
      <Stack.Screen name="Post" component={Post} 
      
         options={{tabBarIcon: () => <FontAwesome6 name="user-alt" size={24} color="black" />}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
