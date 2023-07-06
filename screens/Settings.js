import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'

export default function Settings({ navigation }) {

    handleBack = () => {
        navigation.pop();
    }

    return (
        <View>
            <StatusBar style="auto" />
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={handleBack}>
                    <Icon size={40} name='chevron-back'></Icon>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 20,
      },
})