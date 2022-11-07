import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import NewPost from '../screens/NewPost';


export default function TabNavigation() {
    const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="NewPost" component={NewPost} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
  );
}

