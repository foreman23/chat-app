import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';
import FindMatch from '../screens/FindMatch';
import Settings from '../screens/Settings';
import TabNavigator from './tabNavigator';
import Messenger from '../screens/Messenger';
import LoginScreen from '../screens/Authentication/LoginScreen';
import Register from '../screens/Authentication/Register';
import InitProfile from '../screens/Authentication/InitProfile';
import InitProfile2 from '../screens/Authentication/InitProfile2';
import InitProfile3 from '../screens/Authentication/InitProfile3';
import FriendsList from '../screens/Friends/FriendsList';
import AddFriend from '../screens/Friends/AddFriend';
import ChangeName from '../screens/EditProfile/ChangeName';
import ChangeGender from '../screens/EditProfile/ChangeGender';
import ChangeLocation from '../screens/EditProfile/ChangeLocation';
import DeleteProfile from '../screens/EditProfile/DeleteProfile';
import ChoosePfp from '../screens/Authentication/ChoosePfp';
import Searching from '../screens/MatchSearch/Searching';
import MatchFound from '../screens/MatchSearch/MatchFound';

const Stack = createStackNavigator();

function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
            <Stack.Screen name="Register" component={Register}></Stack.Screen>
            <Stack.Screen name="InitProfile" component={InitProfile}></Stack.Screen>
            <Stack.Screen name="InitProfile2" component={InitProfile2}></Stack.Screen>
            <Stack.Screen name="InitProfile3" component={InitProfile3}></Stack.Screen>
            <Stack.Screen name="Main" component={TabNavigator}></Stack.Screen>
            <Stack.Screen name="Settings" component={Settings}></Stack.Screen>
            <Stack.Screen name="Messenger" component={Messenger}></Stack.Screen>
            <Stack.Screen name="FriendsList" component={FriendsList}></Stack.Screen>
            <Stack.Screen name="AddFriend" component={AddFriend}></Stack.Screen>
            <Stack.Screen name="ChangeName" component={ChangeName}></Stack.Screen>
            <Stack.Screen name="ChangeGender" component={ChangeGender}></Stack.Screen>
            <Stack.Screen name="ChangeLocation" component={ChangeLocation}></Stack.Screen>
            <Stack.Screen name="DeleteProfile" component={DeleteProfile}></Stack.Screen>
            <Stack.Screen name="ChoosePfp" component={ChoosePfp}></Stack.Screen>
            <Stack.Screen name="Searching" component={Searching}></Stack.Screen>
            <Stack.Screen name="MatchFound" component={MatchFound}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default AppStack;