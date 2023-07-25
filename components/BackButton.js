import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'

const BackButton = ({ navigation }) => {

    // Navigaste to last page
    handleBack = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleBack}>
                <Icon size={30} name='chevron-back'></Icon>
            </TouchableOpacity>
        </View>
    )
}

export default BackButton

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
})