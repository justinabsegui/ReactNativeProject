import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import NewPost from '../screens/NewPost';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';


export default function TabNavigation() {
    const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home}   
        options={{tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />}}/>
        <Tab.Screen name="NewPost" component={NewPost} 
        options={{tabBarIcon: () => <MaterialCommunityIcons name="file-image-plus" size={24} color="black" />}}/>
        <Tab.Screen name="Search" component={Search} 
        options={{tabBarIcon: () => <MaterialIcons name="search" size={24} color="black" />}}/>
        <Tab.Screen name="Profile" component={Profile} 
         options={{tabBarIcon: () => <FontAwesome5 name="user-alt" size={24} color="black" />}}/>
      </Tab.Navigator>
  );
}

