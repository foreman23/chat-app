import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';

const FriendsList = ({ navigation }) => {

    handleBack = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={handleBack}>
                    <Icon size={30} name='chevron-back'></Icon>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Pressable hitSlop={10}>
                        <Icon style={styles.icon} name='add-outline' size={25} color={'#5A8F7B'}></Icon>
                    </Pressable>
                    <Pressable hitSlop={10}>
                        <Icon style={styles.icon} name='search-outline' size={25} color={'#5A8F7B'}></Icon>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default FriendsList

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
    icon: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        marginHorizontal: 5,
        padding: 4,
    },
})