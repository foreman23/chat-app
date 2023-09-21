import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Pressable, Modal, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useEffect, useState, useContext } from 'react'
import { doc, getDoc, getDocs, deleteDoc, collection, query, where } from 'firebase/firestore';
import { UserContext } from './Context/UserContext';

import ScreenHeader from '../components/ScreenHeader';
import { auth, firestore } from '../firebase';

export default function Messages({ navigation }) {

  // State variables for user context
  const { userInfo, setUserInfo } = useContext(UserContext);

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
      //console.log(userInfo)
      if (userInfo.private_chats.pairArr) {
        console.log(userInfo.private_chats.pairArr)
        const chatsRef = collection(firestore, "privateChats");
        try {
          const msgData = []
          const q = query(chatsRef, where("userUIDs", "array-contains", auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            console.log("Chat data:", doc.data())
            msgData.push(doc.data());
          });
          setMessageDataNames(msgData);

        }
        catch (error) {
          console.error("Error finding chats for user:", error);
        }
        
      }
    }
  }

  // Render message group
  const renderItem = ({ item }) => {

    console.log("RENDER ITEM:", item)

    theirUID = '';
    theirName = '';
    if (auth.currentUser.uid === item.userUIDs[0]) {
      theirUID = item.userUIDs[1];
      theirName = item.userNames[1]
    }
    else if (auth.currentUser.uid === item.userUIDs[1]) {
      theirUID = item.userUIDs[0];
      theirName = item.userNames[0]
    }

    // Convert timestamp to time since
    const currentDate = new Date();
    const timeStampDate = item.time_last_message.seconds * 1000;
    const timeDifference = currentDate - timeStampDate;
    console.log(Math.floor(timeDifference / (1000 * 60)))
    const minutesSince = Math.floor(timeDifference / (1000 * 60));
    const hoursSince = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysSince = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    // Select best option depending on time passed
    const timeSince = minutesSince;
    const timeUnit = "minutes";
    if (timeSince > 59) {
      timeSince = hoursSince;
      timeUnit = "hours";
      if (timeSince > 23) {
        timeSince = daysSince;
        timeUnit = "days";
      }
    }

    return (
      <TouchableOpacity onLongPress={() => setChatID(item)} onPress={() => handleClick(item.chatID)} style={styles.messageGroup}>
        <View style={{ flex: 1 }}>
          <Image style={styles.profileImage} source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${theirUID}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6`}}></Image>
        </View>

        {/* Message Content */}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0, flex: 3, marginLeft: 5 }}>
          <Text style={{ color: '#5A8F7B', fontSize: 14, fontWeight: '600' }}>{theirName}</Text>
          <Text style={{ color: '#323232', fontSize: 12, }} numberOfLines={2} ellipsizeMode='tail'>{item.text_last_message}</Text>
        </View>

        <View style={{ flexDirection: 'column', borderWidth: 0, flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          {/* <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingRight: 5 }}>{item.status}</Text> */}
          <Icon size={4} style={{ marginVertical: 5 }} name='ellipse-sharp' color='#5A8F7B'></Icon>
          {timeUnit === "minutes" && (
            <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingLeft: 5 }}>{timeSince} min</Text>
          )}
          {timeUnit === "hours" && (
            <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingLeft: 5 }}>{timeSince} hr</Text>
          )}
          {timeUnit === "days" && (
            <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingLeft: 5 }}>{timeSince} d</Text>
          )}
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
  const [isLoading, setIsLoading] = useState(false)
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
          data={messageDataNames}
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