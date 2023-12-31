import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useEffect, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { firestore, auth } from '../../firebase';
import { arrayUnion, doc, getDoc, setDoc, updateDoc, collection, query, getDocs, where, arrayRemove } from 'firebase/firestore';


export default function Requests({ navigation }) {

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);
    console.log(userInfo)

    handleBack = () => {
        navigation.goBack();
    }

    // Accept friend request
    const acceptRequest = async (item) => {

        // splitIDs[0] == UID, splitIDs[1] == name
        let splitIDs = item.split("_");
        console.log(splitIDs[0])
        console.log(splitIDs[1])

        try {
            docRef1 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friend_requests")
            docRef2 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friends")
            docRef3 = doc(firestore, "userInfo", splitIDs[0], "pairing", "friend_requests")
            docRef4 = doc(firestore, "userInfo", splitIDs[0], "pairing", "friends")
            await updateDoc(docRef1, {
                incomingArr: arrayRemove(item),
            })
            await updateDoc(docRef2, {
                friendArr: arrayUnion(item),
            })
            await updateDoc(docRef3, {
                outgoingArr: arrayRemove(`${auth.currentUser.uid}_${userInfo.name}`),
            })
            await updateDoc(docRef4, {
                friendArr: arrayUnion(`${auth.currentUser.uid}_${userInfo.name}`),
            })
            // Retrieve updated friends list from firestore
            // const friendsSnap = await getDoc(docRef2);
            // if (friendsSnap.exists()) {
            //     await setUserInfo((prevUser) => ({ ...prevUser, friends: friendsSnap.data()}))
            //     // Remove index of request from incomingArr
            //     const updatedIncomingArr = userInfo.friend_requests.incomingArr.filter(uid => uid !== theirUID);
            //     await setUserInfo((prevUser) => ({ ...prevUser, friend_requests: {...prevUser.friend_requests, incomingArr: updatedIncomingArr} }))
            // }
        }
        catch (error) {
            console.error("Error accepting friend request:", error);
        }
    }

    // Deny friend request
    const denyRequest = async (theirUID) => {
        console.log(theirUID[0])
        try {
            docRef1 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friend_requests")
            docRef2 = doc(firestore, "userInfo", theirUID, "pairing", "friend_requests")
            await updateDoc(docRef1, {
                incomingArr: arrayRemove(theirUID[0]),
            })
            await updateDoc(docRef2, {
                outgoingArr: arrayRemove(auth.currentUser.uid),
            })
        }
        catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    }

    // Render the request items
    const renderItem = ({ item }) => {

        // splitIDs[0] == UID, splitIDs[1] == name
        let splitIDs = item.split("_");
        console.log(splitIDs[0])
        console.log(splitIDs[1])



        console.log(item)
        return (
            <View style={{ borderWidth: 1, borderColor: '#D2D2D2', flexDirection: 'row', borderRadius: 24, margin: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${splitIDs[0]}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6` }}>
                </Image>
                <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, }}>
                    <Text>{splitIDs[1]}</Text>
                    {/* <Text>Level: {item.level}</Text>
                        <Text>{flagEmoji}</Text> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginRight: 10, marginTop: 2.5 }}>
                    <Pressable onPress={() => acceptRequest(item)} style={{ marginRight: 8 }}>
                        <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='checkmark-outline'></Icon>
                    </Pressable>
                    <Pressable onPress={() => denyRequest(item)}>
                        <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='close-outline'></Icon>
                    </Pressable>
                </View>
            </View>
        )
    }

return (
    <View style={styles.container}>
        <View style={styles.headerBar}>
            <StatusBar style="auto" />
            <TouchableOpacity onPress={handleBack}>
                <Icon size={30} name='chevron-back'></Icon>
            </TouchableOpacity>
        </View>
        <View>
            <FlatList
                data={userInfo.friend_requests.incomingArr}
                renderItem={renderItem}
                key={'+'}
                keyExtractor={(item) => "+" + item}
            >
            </FlatList>
        </View>
    </View>
)
}

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
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 75,
        marginRight: 15,
    },
    icon: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 8,
    },
})