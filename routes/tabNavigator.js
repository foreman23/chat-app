import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FindMatch from "../screens/FindMatch";
import Cards from "../screens/Cards";
import Messages from "../screens/Messages";
import Profile from "../screens/Profile";
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="FindMatch"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarLabel: () => null,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Cards') {
                        iconName = focused ? 'copy' : 'copy-outline';
                    } else if (route.name === 'Messages') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else if (route.name === 'FindMatch') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'ios-person' : 'ios-person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#439A97',
                tabBarInactiveTintColor: '#ACACAC',
                tabBarStyle: {
                    height: 85,
                    backgroundColor: '#FFFFFF',
                }
            })}
        >
            <Tab.Screen name="Cards" component={Cards} />
            <Tab.Screen name="Messages" component={Messages} />
            <Tab.Screen name="FindMatch" component={FindMatch} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default TabNavigator;