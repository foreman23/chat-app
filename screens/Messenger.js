import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';


export default function Messenger({ navigation, route }) {

    const prop = route.params?.prop;
    // console.log("PROP HERE:", prop);
    // console.log(prop.length)


    // Handles navigate to previous page depending on whether new match or not
    // const handleBack = () => {
    //     if (prop.length > 3) {
    //         navigation.reset({
    //             index: 0,
    //             routes: [
    //               {
    //                 name: 'Main',
    //                 state: {
    //                   routes: [
    //                     {
    //                       name: 'Messages',
    //                     },
    //                   ],
    //                 },
    //               },
    //             ],
    //           });
    //     }
    //     else {
    //         navigation.goBack();        // Saves resources by not resetting call to DB
    //     }
    // }
    const handleBack = () => {
        navigation.goBack();
    }

    // Grab chat message data
    // const grabChatData = async () => {
    //     if (auth.currentUser) {
    //         try {
    //             console.log('READING FROM FIRESTORE')

    //             // Get all messages from chat room subcollection
    //             const querySnapshot = await getDocs(collection(firestore, "private_chats", prop[2], "messages"));
    //             querySnapshot.forEach((doc) => {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 console.log(doc.id, " => ", doc.data());
    //             });

    //             // if (docSnap.exists()) {
    //             //     console.log(docSnap.data())
    //             // }
    //         }
    //         catch(error) {
    //             console.error("Error fetching document: ", error);
    //         }
    //     }
    // }

    // Parse chat name for username and uid
    const [matchedUserName, setMatchedUserName] = useState(null);
    const [matchedUserUid, setMatchedUserUid] = useState(null);
    const parseChatID = () => {
        // splitIDs[0] == UID 1, splitIDs[1] == Name 1
        // splitIDs[2] == UID 2, splitIDs[3] == Name 2
        let splitIDs = prop.split("_");
        // console.log(splitIDs[0])
        // console.log(splitIDs[1])
        // console.log(splitIDs[2])
        // console.log(splitIDs[3])
        theirUID = '';
        theirName = '';
        if (auth.currentUser.uid === splitIDs[0]) {
            theirUID = splitIDs[2];
            theirName = splitIDs[3]
        }
        else if (auth.currentUser.uid === splitIDs[2]) {
            theirUID = splitIDs[0];
            theirName = splitIDs[1]
        }
        setMatchedUserName(theirName);
        setMatchedUserUid(theirUID);
    }

    // Open keyboard for search
    const textInputRef = useRef(null);
    const handleSearchPress = () => {
        textInputRef.current.focus();
    };

    // On page load
    useEffect(() => {
        //grabChatData();
        parseChatID();
        console.log("THIS IS THE PROP:", prop)
    }, [])

    return (
        
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.headerBar}>
                <View style={{ borderWidth: 0, flex: 1, justifyContent: 'center', marginRight: 10 }}>
                    <TouchableOpacity onPress={handleBack}>
                        <Icon size={30} color={'#323232'} name='chevron-back'></Icon>
                    </TouchableOpacity>
                </View>

                <View style={{ borderWidth: 0, flex: 1 }}>
                    <Image style={styles.profileImage} source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${matchedUserUid}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6`}}></Image>
                </View>

                <View style={{ borderWidth: 0, flex: 4, justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={{ color: '#5A8F7B', fontWeight: '600' }}>{matchedUserName}</Text>
                </View>
                <View style={{ borderWidth: 0, flex: 1, justifyContent: 'center', marginTop: 3 }}>
                    <Icon size={20} color={'#323232'} name='ellipsis-vertical-sharp'></Icon>
                </View>
            </View>

            {/* PLACEHOLDER DUMMY MESSAGES */}
            <ScrollView>
                <View style={styles.receivedMessagesContainer}><Text style={styles.receivedMessages}>Hey there! I couldn't help but notice your profile, and I must say, you seem quite interesting. Mind if we chat?</Text></View>
                <View style={styles.sentMessagesContainer}><Text style={styles.sentMessages}>Hi! Thanks for reaching out. I'm glad you found my profile intriguing. I'd love to chat and get to know you better. So, tell me, what caught your attention?</Text></View>
                <View style={styles.receivedMessagesContainer}><Text style={styles.receivedMessages}>Well, besides your beautiful smile, I noticed we share a love for adventure. Your hiking and travel pictures really caught my eye. Have you been on any exciting trips lately?</Text></View>
                <View style={styles.sentMessagesContainer}><Text style={styles.sentMessages}>Thank you for the kind words! I'm thrilled you share my passion for adventure. As for recent trips, I actually just returned from a hiking expedition in the Swiss Alps. The breathtaking landscapes and fresh mountain air were absolutely incredible. How about you? Any exciting journeys or outdoor experiences you'd like to share?</Text></View>
                <View style={styles.receivedMessagesContainer}><Text style={styles.receivedMessages}>Hey there! I couldn't help but notice your profile, and I must say, you seem quite interesting. Mind if we chat?</Text></View>
                <View style={styles.receivedMessagesContainer}><Text style={styles.receivedMessages}>Hey there! I couldn't help but notice your profile, and I must say, you seem quite interesting. Mind if we chat?</Text></View>
                <View style={styles.sentMessagesContainer}><Text style={styles.sentMessages}>Thank you for the kind words! I'm thrilled you share my passion for adventure. As for recent trips, I actually just returned from a hiking expedition in the Swiss Alps. The breathtaking landscapes and fresh mountain air were absolutely incredible. How about you? Any exciting journeys or outdoor experiences you'd like to share?</Text></View>
            </ScrollView>

            {/* Keyboard input */}
            <Pressable style={styles.searchContainer} onPress={handleSearchPress}>
                <View>
                    <TextInput
                        style={styles.searchBox}
                        placeholder='Type Here'
                        keyboardType='web-search'
                        ref={textInputRef}
                    />
                </View>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} underlayColor='transparent'>
                    <View>
                        <Icon name="paper-plane" size={20} color="#5A8F7B" />
                    </View>
                </TouchableOpacity>

            </Pressable>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    sentMessagesContainer: {
        backgroundColor: '#5A8F7B',
        padding: 10,
        paddingHorizontal: 15,
        margin: 10,
        width: 300,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        alignSelf: 'flex-end',
    },
    sentMessages: {
        color: '#FFFFFF',
        fontWeight: 300,
        fontSize: 14,
        lineHeight: 20,
    },
    receivedMessagesContainer: {
        borderColor: '#D2D2D2',
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 15,
        margin: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        width: 300,
        alignSelf: 'flex-start',
    },
    receivedMessages: {
        color: '#252525',
        fontWeight: 300,
        fontSize: 14,
        lineHeight: 20,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderColor: '#e0dede'
    },
    profileImage: {
        width: 55,
        height: 55,
        borderColor: '#5A8F7B',
        borderWidth: 1.5,
        borderRadius: 30,
    },
    searchContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 32.5,
        marginTop: 10,
        marginBottom: 25,
        justifyContent: 'space-between',
    },
})