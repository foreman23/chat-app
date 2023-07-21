import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'
import { auth } from '../firebase';

export default function Settings({ navigation }) {

    handleBack = () => {
        navigation.goBack();
    }

    // Sign out current firebase user
    const handleSignOut = () => {
        auth.signOut()
        .then(() => {
            navigation.replace('Login');
        })
        .catch(error => alert(error.message));
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={handleBack}>
                    <Icon size={30} name='chevron-back'></Icon>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 25, marginLeft: 10 }}>
                <Text style={styles.headerText}>Account</Text>
                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='key-outline'></Icon><Text style={styles.textText}>Privacy</Text></View>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-heart-dislike-outline'></Icon><Text style={styles.textText}>Blocked Users</Text></View>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-card-outline'></Icon><Text style={styles.textText}>Payment</Text></View>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='lock-closed-outline'></Icon><Text style={styles.textText}>Change Password</Text></View>
                </View>
                <Text style={styles.headerText}>General</Text>
                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-people-outline'></Icon><Text style={styles.textText}>Support</Text></View>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-notifications-outline'></Icon><Text style={styles.textText}>Notifications</Text></View>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-globe-outline'></Icon><Text style={styles.textText}>Language</Text></View>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='paper-plane-outline'></Icon><Text style={styles.textText}>Terms of Service</Text></View>
                </View>
                <Text style={styles.headerText}>Login</Text>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleSignOut} style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-remove-outline'></Icon><Text style={styles.textText}>Logout</Text></TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}><Icon size={30} style={styles.iconStyle} name='ios-close-outline'></Icon><Text style={styles.textText}>Delete Account</Text></View>
                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 20,
    },
    headerText: {
        marginBottom: 15,
        fontWeight: 'bold',
        color: 'grey',
        marginLeft: 20,
        fontSize: 24,
    },
    textText: {
        marginVertical: 15,
        marginLeft: 0,
        fontSize: 20,
        color: 'grey',
    },
    headerContainer: {
        marginLeft: 20,
        marginBottom: 25,
    },
    iconStyle: {
        marginRight: 12.5,
        marginTop: 12,
    },
})