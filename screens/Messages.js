import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Pressable, Modal, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useEffect, useState } from 'react'
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

import ScreenHeader from '../components/ScreenHeader';
import { auth, firestore } from '../firebase';

export default function Messages({ navigation }) {

  // Open keyboard for search
  const textInputRef = useRef(null);
  const handleSearchPress = () => {
    textInputRef.current.focus();
  };

  // Go to messenger from message click
  const handleClick = (item) => {
    navigation.push('Messenger', { prop: item });
  }

  const [messageDataNames, setMessageDataNames] = useState();
  // Grab messageData from firestore
  const grabMessageData = async () => {
    if (auth.currentUser) {
      try {
        console.log('READING FROM FIRESTORE')

        const docRef = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "matches")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          convertToNames(docSnap.data().pairArr);
        }

      }
      catch (error) {
        console.error("Error fetching document: ", error);
      }
    }
  }

  // Convert user emails to user names
  const convertToNames = async (chatID) => {

    // uidArr index 0 = matched users uids, index 1 = joint chat ids
    const uidArr = parseChatID(chatID);

    //console.log(uidArr[1])

    console.log("CONVERTING EMAILS TO NAMES")
    for (let i = 0; i < uidArr[0].length; i++) {
      if (auth.currentUser) {
        try {
          console.log('READING FROM FIRESTORE')

          const docRef = doc(firestore, "userInfo", uidArr[0][i])
          const docSnap = await getDoc(docRef)


          if (docSnap.exists()) {
            // Stores username as index 0, stores UID as index 1, stores CHATID as index 2 of subarray
            uidArr[0][i] = [ docSnap.data().name, uidArr[0][i], uidArr[1][i].pairID ]
          }
        }
        catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    }
    setMessageDataNames(uidArr);

  }


  // Parse the chatID from context to separate the user's ID and the matched user's ID
  const parseChatID = (chatIDArr) => {

    // Create unbound copy of chatIDArr
    let chatIDArrCopy = [...chatIDArr]

    for (let i = 0; i < chatIDArr.length; i++){
      let splitIDs = chatIDArr[i].pairID.split("_");
      //console.log(splitIDs[0]) 
      //console.log(splitIDs[1])
      // Find matched user ID
      theirUID = '';
      if (auth.currentUser.uid === splitIDs[0]) {
        theirUID = splitIDs[1];
      }
      else if (auth.currentUser.uid === splitIDs[1]) {
        theirUID = splitIDs[0];
      }
      chatIDArr[i] = theirUID;
    }
    let payload = [chatIDArr, chatIDArrCopy]

    return payload;
  }

  // Set chatID state variable for modal manipulation
  const [currentChatID, setCurrentChatID] = useState(null);
  const setChatID = (theirUID) => {
    if (messageDataNames[1].includes(`${theirUID}_${auth.currentUser.uid}`)) {
      const index = messageDataNames[1].indexOf(`${theirUID}_${auth.currentUser.uid}`);
      setCurrentChatID(messageDataNames[1][index])
      setModalVisible(true);
    }
    else if (messageDataNames[1].includes(`${auth.currentUser.uid}_${theirUID}`)) {
      const index = messageDataNames[1].indexOf(`${auth.currentUser.uid}_${theirUID}`);
      setCurrentChatID(messageDataNames[1][index])
      //console.log(messageDataNames[1][index])
      setModalVisible(true);
    }
  }


  // Render message group
  const renderItem = ({ item }) => {

    return (
      <TouchableOpacity onLongPress={() => setChatID(item[1])} onPress={() => handleClick(item)} style={styles.messageGroup}>
        <View style={{ flex: 1 }}>
          <Image style={styles.profileImage} source={{ uri: `https://firebasestorage.googleapis.com/v0/b/tangoh-2b4f6.appspot.com/o/pfps%2F${item[1]}.jpg?alt=media&token=e912bcd5-1111-4249-b9d7-3c843492e4de`}}></Image>
        </View>

        {/* Message Content */}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0, flex: 3, marginLeft: 5 }}>
          <Text style={{ color: '#5A8F7B', fontSize: 14, fontWeight: '600' }}>{item[0]}</Text>
          <Text style={{ color: '#323232', fontSize: 12, }} numberOfLines={2} ellipsizeMode='tail'>{item.message}</Text>
        </View>

        <View style={{ flexDirection: 'column', borderWidth: 0, flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingRight: 5 }}>{item.status}</Text>
          <Icon size={4} style={{ marginVertical: 5 }} name='ellipse-sharp' color='#5A8F7B'></Icon>
          <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingLeft: 5 }}>{item.hoursSince} hr</Text>
        </View>

      </TouchableOpacity>
    );
  };

  // Modal visibility state variable
  const [modalVisible, setModalVisible] = useState(false);

  // Delete a conversation
  const deleteConvo = async () => {
    if (auth.currentUser) {
      try {
        const docRef = doc(firestore, "pairing_system", "pairs");
        await deleteDoc(docRef, currentChatID);
      }
      catch(error) {
        console.error("Could not delete conversation", error);
      }
    }
    
  }

  // Once messageDataNames[0] is populated set loading false
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (messageDataNames && messageDataNames[0] !== undefined) {
    setIsLoading(false)
    }
  }, [messageDataNames])

  // On page load
  useEffect(() => {
    grabMessageData();
  }, [])


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
      <ScreenHeader navigation={navigation} title='Messages'></ScreenHeader>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Text>Delete Conversation? {currentChatID}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={deleteConvo}>
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Pressable style={styles.searchContainer} onPress={handleSearchPress}>
        <View>
          <TextInput
            style={styles.searchBox}
            placeholder='Search'
            keyboardType='web-search'
            ref={textInputRef}
          />
        </View>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} underlayColor='transparent'>
          <View>
            <Icon name="search" size={20} color="#5A8F7B" />
          </View>
        </TouchableOpacity>

      </Pressable>

      <View style={styles.messageList}>
        <FlatList
          data={messageDataNames[0]}
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
  profileImage: {
    width: 55,
    height: 55,
    borderColor: '#5A8F7B',
    borderWidth: 1.5,
    borderRadius: 30,
  },
  messageGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginTop: '50%',
    marginHorizontal: 50,
    borderRadius: 12.5,
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
  searchBox: {
    textAlign: 'center',
    color: '#323232',
  },
  messageList: {
    flex: 1,
  },
})