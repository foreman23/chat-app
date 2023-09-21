import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase';
import { doc, getDoc, getDocs, collection, setDoc, addDoc, query, orderBy, limit, onSnapshot, updateDoc } from 'firebase/firestore';


export default function Messenger({ navigation, route }) {

    const prop = route.params?.prop;
    // console.log("PROP HERE:", prop);
    // console.log(prop.length)

    const handleBack = () => {
        navigation.goBack();
    }

    // Grab chat message data
    const [chatData, setChatData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const grabChatData = async () => {
        if (matchedUserUid !== null && matchedUserName !== null) {
            let msgArray = [];

            if (auth.currentUser) {
                try {
                    console.log('READING FROM FIRESTORE')
    
                    // Get all messages from chat room subcollection
                    const messageRef = collection(firestore, "privateChats", prop, "messages")
                    const querySnapshot = await getDocs(query(messageRef, orderBy("time")));
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        // console.log(doc.id, " => ", doc.data());
                        msgArray.push(doc.data());
                    });
                    setChatData(msgArray);
                    setIsLoading(false);
                }
                
                catch(error) {
                    console.error("Error fetching document: ", error);
                }
            }
        }
        
    }

    // Send message
    const [messageToSend, setMessageToSend] = useState(null);
    const sendMessage = async () => {
        if (messageToSend !== null && messageToSend.length > 0) {
            console.log(messageToSend)
            const currentDate = new Date();
            try {
                const messageData = {
                    from: auth.currentUser.uid,
                    msg: messageToSend,
                    time: currentDate,
                }
                const chatDocRef = doc(firestore, "privateChats", prop);
                const colRef = collection(chatDocRef, "messages");
                await addDoc(colRef, messageData);
                // Update chat header info
                const docRef = doc(firestore, "privateChats", prop);
                await updateDoc(docRef, {
                    text_last_message: messageToSend,
                    time_last_message: currentDate,
                })
            }
            catch(error) {
                console.error("Error sending message:", error);
            }
        }
    }

    // Parse chat name for username and uid
    const [matchedUserName, setMatchedUserName] = useState(null);
    const [matchedUserUid, setMatchedUserUid] = useState(null);
    const parseChatID = () => {
        let splitIDs = prop.split("_");
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

    // Responds to changes in chat collection
    const getNewMessage = async (change) => {
        if (auth.currentUser) {
            try {
                const doc = change.doc;
                console.log("New document data:", doc.data());
                setChatData((prevChatData) => [...prevChatData, doc.data()]);
            } catch (error) {
                console.error("Error fetching new message: ", error);
            }
        }
    }

    // // Setup listener for new chat messages
    // useEffect(() => {
    //     if (auth.currentUser) {
    //         const unsubChat = onSnapshot(
    //             collection(firestore, "privateChats", prop, "messages"),
    //             (snapshot) => {
    //                 snapshot.docChanges().forEach((change) => {
    //                     if (change.type === "added") {
    //                         console.log('NEW CHAT DOCUMENT DETECTED')
    //                         getNewMessage(change);
    //                     }
    //                 })
    //             }
    //         )
    //         return () => {
    //             unsubChat();
    //         }
    //     }
    // }, [prop])


    // Open keyboard for search
    const textInputRef = useRef(null);
    const handleSearchPress = () => {
        textInputRef.current.focus();
    };

    // Render the message item
    const renderItem = ({ item }) => {

        // !== null must be included to avoid dummy message
        if (item.from !== auth.currentUser.uid && item.from !== null) {
            return (
                <View style={styles.receivedMessagesContainer}>
                    <Text style={styles.receivedMessages}>{item.msg}</Text>
                </View>
            )
        }

        else if (item.from !== null) {
            return (
                <View style={styles.sentMessagesContainer}>
                    <Text style={styles.sentMessages}>{item.msg}</Text>
                </View>
            )
        }
    }

    // On page load
    useEffect(() => {
        //grabChatData();
        parseChatID();
        console.log("THIS IS THE PROP:", prop)
    }, [])

    // Once state variables are populated
    useEffect(() => {
        grabChatData();
    }, [matchedUserUid])

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
          </View>
        )
      }

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

            <View style={{ flex: 1 }}>
                <FlatList
                    data = {chatData}
                    renderItem={renderItem}
                    key={'+'}
                    keyExtractor={(item) => "+" + item.msg + item.time}
                >
                </FlatList>
            </View>

            {/* Keyboard input */}
            <Pressable style={styles.searchContainer} onPress={handleSearchPress}>
                <View>
                    <TextInput
                        onChangeText={text => setMessageToSend(text)}
                        style={styles.searchBox}
                        placeholder='Type Here'
                        keyboardType='web-search'
                        ref={textInputRef}
                    />
                </View>
                <TouchableOpacity onPress={sendMessage} style={{ alignItems: 'center', justifyContent: 'center' }} underlayColor='transparent'>
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
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
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