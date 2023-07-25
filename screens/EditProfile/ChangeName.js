import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'
import BackButton from '../../components/BackButton';
import LargeButton from '../../components/LargeButton';

const ChangeName = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <BackButton navigation={navigation}></BackButton>
            <View style={styles.inputContainer}>
                <TextInput placeholder='Name'></TextInput>
            </View>
            <LargeButton title='Submit Changes'></LargeButton>
        </View>
    )
}

export default ChangeName

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 10,
        paddingLeft: 20,
    },
})