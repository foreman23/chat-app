import { StyleSheet, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect } from 'react'
import { useContext } from 'react';
import BadgeIcon from './BadgeIcon';
import { UserContext } from '../screens/Context/UserContext';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { useState } from 'react';



const ScreenHeader = (props) => {

    // State variables for user context
    const { userInfo, setUserInfo } = useContext(UserContext);

    // Go to settings screen
    const handleSettings = () => {
        props.navigation.push('Settings');
    }

    // Go to friends screen
    const handleFriends = () => {
        props.navigation.push('AddFriend');
    }

    const getFriendRequests = async () => {
        if (auth.currentUser) {
            try {
                const requestSnap = await getDoc(doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friend_requests"))
                console.log(requestSnap.data())
                await setUserInfo((prevUser) => ({ ...prevUser, friend_requests: requestSnap.data() }))
            }
            catch (error) {
                console.error("Error fetching document: ", error);
            }
        }
    }

    const getFriends = async () => {
        if (auth.currentUser) {
            try {
                const friendSnap = await getDoc(doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friends"))
                console.log(friendSnap.data())
                await setUserInfo((prevUser) => ({ ...prevUser, friends: friendSnap.data() }))
            }
            catch (error) {
                console.error("Error fetching document: ", error);
            }
        }

    }

    // Setup the listeners
    useEffect(() => {
        if (auth.currentUser) {
            const unsubRequests = onSnapshot(
                doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friend_requests"),
                (doc) => {
                    console.log('CHANGES DETECTED TO FRIEND REQUESTS DOC')
                    // Get updated friend_requests from firestore
                    getFriendRequests();
                }
            )
            const unsubFriends = onSnapshot(
                doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friends"),
                (doc) => {
                    console.log('CHANGES DETECTED TO FRIENDS DOC')
                    // Get updated friend_requests from firestore
                    getFriends();
                }
            )
            return () => {
                unsubRequests();
                unsubFriends();
            }
        }

    }, [auth.currentUser])

    // Populate badge count
    const [badgeCount, setBadgeCount] = useState(0);
    useEffect(() => {
        if (userInfo.friend_requests && userInfo.friend_requests.incomingArr) {
          setBadgeCount(userInfo.friend_requests.incomingArr.length);
        } else {
          setBadgeCount(0);
        }
      }, [userInfo]);

    return (
        <View style={styles.headerBar}>
            <Text style={{ fontSize: 18, fontWeight: 500 }}>{props.title}</Text>
            <View style={{ flexDirection: 'row' }}>
                {/* <Pressable hitSlop={10} onPress={handleMatchSearch}>
                    <ActivityIndicator style={styles.icon} color={'#5A8F7B'}></ActivityIndicator>
                </Pressable> */}
                <Pressable hitSlop={10} onPress={handleFriends}>
                    <BadgeIcon style={styles.icon} name='people-outline' size={25} color={'#5A8F7B'} badgeCount={badgeCount}></BadgeIcon>
                </Pressable>
                <Pressable hitSlop={10} onPress={handleSettings}>
                    <Icon style={styles.icon} name='settings-outline' size={25} color={'#5A8F7B'}></Icon>
                </Pressable>
            </View>
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
        marginHorizontal: 5,
        padding: 4,
    },
})