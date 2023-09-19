import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useEffect, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { firestore, auth } from '../../firebase';
import { arrayRemove, arrayUnion, updateDoc, doc, collection, addDoc, setDoc } from 'firebase/firestore';

const FriendsList = ({ navigation }) => {

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);
    console.log(userInfo)

    handleBack = () => {
        navigation.goBack();
    }

    // Delete friend handler
    const handleDeleteFriend = async (item) => {

        // splitIDs[0] == UID, splitIDs[1] == name
        let splitIDs = item.split("_");
        console.log(splitIDs[0])
        console.log(splitIDs[1])

        try {
            const docRef1 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friends");
            const docRef2 = doc(firestore, "userInfo", splitIDs[0], "pairing", "friends")
            // Remove friend from your list
            await updateDoc(docRef1, {
                friendArr: arrayRemove(item),
            })
            // Remove friend from their list
            await updateDoc(docRef2, {
                friendArr: arrayRemove(`${auth.currentUser.uid}_${userInfo.name}`),
            })
        }
        catch (error) {
            console.error("Failed to delete friend from firestore:", error);
        }
    }

    // Message friend handler
    const handleMessageFriend = async (theirUID) => {
        const chatID = `${auth.currentUser.uid}_${theirUID}`
        // console.log(chatID)
        // console.log(userInfo)
        item = ["todd", theirUID, chatID]

        // Check if chat already exists
        if (userInfo.private_chats.pairArr.includes(chatID)) {
            navigation.push('Messenger', { prop: item });
            return
        }

        if (userInfo.private_chats.pairArr.includes(`${theirUID}_${auth.currentUser.uid}`)) {
            navigation.push('Messenger', { prop: item });
            return
        }

        // Otherwise create the chat
        else {
            try {
                console.log("WRITING NEW CHAT TO FIRESTORE");
                const docRef1 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "private_chats");
                const docRef2 = doc(firestore, "userInfo", theirUID, "pairing", "private_chats");

                await updateDoc(docRef1, {
                    pairArr: arrayUnion(chatID),
                })

                await updateDoc(docRef2, {
                    pairArr: arrayUnion(chatID),
                })

                // Create the chat document
                const chatDocRef = doc(firestore, "privateChats", chatID);
                await setDoc(chatDocRef, {});

                // Create the 'messages' subcollection
                const colRef = collection(chatDocRef, "messages");
                const messageData = {
                    from: null,
                    msg: null,
                }
                await addDoc(colRef, messageData);

                navigation.push('Messenger', { prop: item });
            }
            catch (error) {
                console.error("Error creating private message collection:", error);
            }
        }

    }


    // Render the friend items
    const renderItem = ({ item }) => {
        console.log(item)

        // splitIDs[0] == UID, splitIDs[1] == name
        let splitIDs = item.split("_");
        console.log(splitIDs[0])
        console.log(splitIDs[1])

        return (
            <View>
                <TouchableOpacity onLongPress={() =>  console.log('debug')}>
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
                            <Pressable>
                                <Icon onPress={() => handleMessageFriend(item)} style={styles.icon} size={20} color={'#5A8F7B'} name='chatbox-outline'></Icon>
                            </Pressable>
                            <Pressable onPress={() => handleDeleteFriend(item)}>
                                <Icon style={styles.icon} size={20} color={'#ff6666'} name='person-remove-outline'></Icon>
                            </Pressable>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={handleBack}>
                    <Icon size={30} name='chevron-back'></Icon>
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    data={userInfo.friends.friendArr}
                    renderItem={renderItem}
                    key={'+'}
                    keyExtractor={(item) => "+" + item}
                >
                </FlatList>
            </View>
        </View>
    )
}

export default FriendsList

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