import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import NewPost from '../screens/NewPost';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';


export default function TabNavigation() {
    const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor: 'purple'}}}>
        <Tab.Screen name="Home" component={Home}
        options={{ headerTitle: "WE POST IT", tabBarIcon: () => <FontAwesome name="home" size={24} color="white" /> } }/>
        <Tab.Screen name="NewPost" component={NewPost} 
        options={{headerTitle: 'POST IT TIME',tabBarIcon: () => <FontAwesome name="plus-square-o" size={24} color="white" />}}/>
        <Tab.Screen name="Search" component={Search} 
        options={{headerTitle: 'BUSCA PERFILES',tabBarIcon: () => <MaterialIcons name="search" size={24} color="white" />}}/>
        <Tab.Screen name="Profile" component={Profile} 
         options={{headerTitle: 'MI PERFIL',tabBarIcon: () => <FontAwesome5 name="user-alt" size={24} color="white" />}}/>
      </Tab.Navigator>
  );
}

