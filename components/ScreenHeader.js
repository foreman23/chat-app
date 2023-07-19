import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react'

const ScreenHeader = (props) => {

    // Go to settings screen
    const handleSettings = () => {
        props.navigation.push('Settings');
    }

    return (
        <View style={styles.headerBar}>
            <Text style={{ fontSize: 18, fontWeight: 500 }}>{props.title}</Text>
            <Pressable hitSlop={10} onPress={handleSettings}>
                <Icon style={styles.icon} name='settings-outline' size={25} color={'#5A8F7B'}></Icon>
            </Pressable>
        </View>
    )
}

export default ScreenHeader

const styles = StyleSheet.create({
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 12,
        marginTop: 12,
        alignItems: 'center',
    },
    icon: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        padding: 4,
    },
})