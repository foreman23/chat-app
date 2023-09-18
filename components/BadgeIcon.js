import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const BadgeIcon = ({ name, size, color, badgeCount }) => {
    // Set max badge count to 99 for styling
    if (badgeCount > 99) {
        badgeCount = 99;
    }

    return (
        <View style={styles.container}>
            <Icon name={name} size={size} color={color} />
            {badgeCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                </View>
            )}
        </View>
    );
};

export default BadgeIcon

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        marginHorizontal: 5,
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: -5, // Adjust the position as needed
        right: -5, // Adjust the position as needed
        backgroundColor: 'red', // Badge background color
        borderRadius: 10, // Make it a circle
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white', // Badge text color
        fontSize: 12,
        fontWeight: 'bold',
    },
});