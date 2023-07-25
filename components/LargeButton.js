import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const LargeButton = (props) => {
    return (
        <TouchableOpacity onPress={props.function} style={styles.matchButtonContainer}>
            <Text style={styles.matchButton}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default LargeButton

const styles = StyleSheet.create({
    matchButtonContainer: {
        marginHorizontal: 20,
        marginTop: 5,
        borderRadius: 32.5,
        backgroundColor: '#5A8F7B',
    },
    matchButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        padding: 20,
    },
})