import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import FindMatch from '../screens/FindMatch';
import Settings from '../screens/Settings';


const screens = {
    FindMatch: {
        screen: FindMatch,
        navigationOptions: {
            headerShown: false,
        },
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            headerShown: false,
        },
    },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);