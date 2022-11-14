import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import TabNavigation from './src/components/TabNavigation';
import NewPost from './src/screens/NewPost';
import Search from './src/screens/Search';
import Camara from './src/components/Camara';
import Welcome from './src/screens/Welcome';

const Stack = createNativeStackNavigator();


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="TabNavigation" options={ { headerShown: false } }   component={TabNavigation} />  
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="NewPost" component={NewPost} />
      <Stack.Screen name="Camara" component={Camara} />
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
