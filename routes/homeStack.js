import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';
import FindMatch from '../screens/FindMatch';
import Settings from '../screens/Settings';
import TabNavigator from './tabNavigator';
import Messenger from '../screens/Messenger';
import LoginScreen from '../screens/Authentication/LoginScreen';
import Register from '../screens/Authentication/Register';

const Stack = createStackNavigator();

function AppStack() {
    // CHANGE COMPONENET TO PROPS LATER
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
            <Stack.Screen name="Register" component={Register}></Stack.Screen>
            <Stack.Screen name="Main" component={TabNavigator}></Stack.Screen>
            <Stack.Screen name="Settings" component={Settings}></Stack.Screen>
            <Stack.Screen name="Messenger" component={Messenger}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default AppStack;