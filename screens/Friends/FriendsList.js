import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useEffect, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { firestore, auth } from '../../firebase';
import { arrayRemove, arrayUnion, updateDoc, doc } from 'firebase/firestore';

const FriendsList = ({ navigation }) => {

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);
    console.log(userInfo)

    handleBack = () => {
        navigation.goBack();
    }

    // Delete friend handler
    const handleDeleteFriend = async (theirUID) => {
        try {
            const docRef1 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friends");
            const docRef2 = doc(firestore, "userInfo", theirUID, "pairing", "friends")
            // Remove friend from your list
            await updateDoc(docRef1, {
                friendArr: arrayRemove(theirUID),
            })
            // Remove friend from their list
            await updateDoc(docRef2, {
                friendArr: arrayRemove(auth.currentUser.uid),
            })
        }
        catch (error) {
            console.error("Failed to delete friend from firestore:", error);
        }
    }


    // Render the friend items
    const renderItem = ({ item }) => {
        console.log(item)
        return (
            <View>
                <TouchableOpacity onLongPress={() =>  console.log('debug')}>
                    <View style={{ borderWidth: 1, borderColor: '#D2D2D2', flexDirection: 'row', borderRadius: 24, margin: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${item}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6` }}>
                        </Image>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, }}>
                            <Text>{item}</Text>
                            {/* <Text>Level: {item.level}</Text>
                    <Text>{flagEmoji}</Text> */}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginRight: 10, marginTop: 2.5 }}>
                            <Pressable>
                                <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='chatbox-outline'></Icon>
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