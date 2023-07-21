import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native'
import { React, useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { renderNode } from 'react-native-elements/dist/helpers';
import ScreenHeader from '../components/ScreenHeader';
import { auth } from '../firebase';
import { firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Profile({ navigation }) {

    const [userInfo, setUserInfo] = useState(null);

    const [userDisplayAge, setUserDisplayAge] = useState(null);

    // List of interests
    const interests = ['Movies', 'Hiking', 'Reading', 'Gym', 'Writing', 'Fishing', 'Games']
    const renderItem = ({ item }) => {
        return (
            <View>
                <Text style={styles.interestItem}>{item}</Text>
            </View>
        );
    };

    // Get firestore user info from authenticated email
    const readUserData = async () => {
        try {
            const docRef = doc(firestore, "userInfo", auth.currentUser?.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Update the userInfo state with docSnap.data()
                setUserInfo(docSnap.data());
            } else {
                console.log("Document does not exist!");
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        }
    };

    useEffect(() => {
        // Call the readUserData function when the component mounts or whenever the auth.currentUser.email changes
        readUserData();
        console.log(userInfo)
    }, [auth.currentUser?.email]);

    if (userInfo === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScreenHeader navigation={navigation} title='Profile'></ScreenHeader>
            <View style={styles.profileImageContainer}>
                <Image style={styles.profileImage} source={require('../assets/placeholderPFP.png')}></Image>
            </View>
            <View style={styles.profileNameContainer}>
                <Text style={{ fontSize: 18, color: '#323232' }}>{userInfo.name}</Text>
            </View>

            <View style={styles.bioBar}>
                <Text>Age</Text>
                <Text style={styles.greenText}>{userInfo.birthdate.toLocaleString()}</Text>
            </View>

            <View style={styles.bioBar}>
                <Text>Gender</Text>
                <Text style={styles.greenText}>{userInfo.gender}</Text>
            </View>

            <View style={styles.bioBar}>
                <Text>Location</Text>
                <Text style={styles.greenText}>{userInfo.country}</Text>
            </View>

            <View style={styles.interestsContainer}>
                <View style={styles.interestBar}>
                    <Text>Interests</Text>
                    <Text style={{ color: '#5A8F7B', fontSize: 12, fontWeight: '600' }}>See All</Text>
                </View>
                <View style={styles.interests}>
                    <FlatList data={interests}
                        renderItem={renderItem}
                        key={'+'}
                        keyExtractor={(item) => "+" + item.id}
                        numColumns={4}
                        contentContainerStyle={styles.listContainer}>
                    </FlatList>
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
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
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
        backgroundColor: '#5A8F7B',
        color: '#FFFFFF',
        marginHorizontal: 5,
        marginVertical: 2,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 32.5,
        fontSize: 12,
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
        color: '#5A8F7B',
        fontWeight: 'bold',
    },
    listContainer: {
        flexDirection: 'column',
        marginBottom: 15,
    },
})