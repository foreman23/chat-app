import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { renderNode } from 'react-native-elements/dist/helpers';

export default function Profile({ navigation }) {

    // Go to settings screen
    const handleSettings = () => {
        navigation.push('Settings');
    }

    // List of interests
    const interests = ['Movies', 'Hiking', 'Reading', 'Gym', 'Writing', 'Fishing', 'Games']
    const renderItem = ({ item }) => {
        return (
          <View>
            <Text style={styles.interestItem}>{item}</Text>
          </View>
        );
      };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.headerBar}>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>Profile</Text>
                <TouchableOpacity onPress={handleSettings}>
                    <Icon name='settings-outline' size={35} color={'#439A97'}></Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.profileImageContainer}>
                <Image style={styles.profileImage} source={require('../assets/placeholderPFP.png')}></Image>
            </View>
            <View style={styles.profileNameContainer}>
                <Text style={{ fontSize: 18, color: '#323232' }}>William Joe</Text>
            </View>

            <View style={styles.bioBar}>
                <Text>Age</Text>
                <Text style={styles.greenText}>22</Text>
            </View>

            <View style={styles.bioBar}>
                <Text>Gender</Text>
                <Text style={styles.greenText}>Male</Text>
            </View>

            <View style={styles.bioBar}>
                <Text>Location</Text>
                <Text style={styles.greenText}>Los Angeles, CA</Text>
            </View>

            <View style={styles.interestsContainer}>
                <View style={styles.interestBar}>
                    <Text>Interests</Text>
                    <Text style={{ color: '#439A97', fontSize: 12, fontWeight: '600' }}>See All</Text>
                </View>
                <View style={styles.interests}>
                    <FlatList data={interests} renderItem={renderItem} key={'+'} keyExtractor={(item) => "+" + item.id} numColumns={4}></FlatList>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    bioBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginVertical: 7,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 20,
        marginHorizontal: 15,
    },
    interestBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 7,
        paddingVertical: 15,
    },
    interestsContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        marginVertical: 7,
        marginHorizontal: 15,
        paddingHorizontal: 30,
    },
    interests: {
        flexDirection: 'row',
    },
    interestItem: {
        backgroundColor: '#439A97',
        color: '#FFFFFF',
        marginHorizontal: 5,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 32.5, 
        fontSize: 12,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
    },
    profileNameContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 15,
    },
    profileImageContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    profileImage: {
        width: 140,
        height: 140,
    },
    greenText: {
        color: '#439A97',
        fontWeight: 'bold',
    },


})