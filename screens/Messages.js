import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore';

import ScreenHeader from '../components/ScreenHeader';
import { auth, firestore } from '../firebase';

export default function Messages({ navigation }) {

  // PLACEHOLDER MESSAGE DATA (DELETE LATER)
  // const messageData = [
  //   { id: '1', name: 'Becky Joe', message: 'Hi, when can we meet?', status: 'Delivered', hoursSince: 2, hoursLeft: null },
  //   { id: '2', name: 'John Doe', message: 'Sure, let\'s meet tomorrow!', status: 'Sent', hoursSince: 0, hoursLeft: 24 },
  // ];

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
  const [messageDataChatIDs, setMessageDataChatIDs] = useState();
  // Grab messageData from firestore
  const grabMessageData = async () => {
    if (auth.currentUser) {
      try {
        console.log('READING FROM FIRESTORE')

        const docRef = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "matches")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log("gewhjrghwejgrhjewgrhew", docSnap.data())
          setMessageDataChatIDs(docSnap.data().pairArr)

          // convertToNames(docSnap.data().pairArr);
        }

      }
      catch (error) {
        console.error("Error fetching document: ", error);
      }
    }
  }

  // Parse the chatID from context to separate the user's ID and the matched user's ID
  // const parseChatID = (chatID) => {
  //   console.log(chatID)
  //   idArr = pairInfo.chatID;
  //   idArr = pairInfo.chatID.split("_");
  //   chatID1 = idArr[0];
  //   chatID2 = idArr[1];
  //   console.log(chatID1)
  //   console.log(chatID2)
  //   // Find respective IDs
  //   myUID = '';
  //   theirUID = '';
  //   if (auth.currentUser.uid === chatID1) {
  //     myUID = chatID1;
  //     theirUID = chatID2;
  //   }
  //   else {
  //     myUID = chatID2;
  //     theirUID = chatID1;
  //   }
  //   console.log(`Matched with user: ${theirUID}`)
  // }

  // Convert user emails to user names
  const convertToNames = async (chatID) => {

    // const theirUID = parseChatID(chatID);
    // console.log(theirUID)

    console.log("CONVERTING EMAILS TO NAMES")
    const length = messageDataEmails.length
    for (let i = 0; i < length; i++) {
      console.log(messageDataEmails[i])
      if (auth.currentUser) {
        try {
          console.log('READING FROM FIRESTORE')

          const docRef = doc(firestore, "userInfo", messageDataEmails[i])
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            messageDataEmails[i] = docSnap.data().name
          }
        }
        catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    }
    console.log(messageDataEmails)
    setMessageDataNames(messageDataEmails);

  }

  // Render message group
  const renderItem = ({ item }) => {

    return (
      <TouchableOpacity onPress={() => handleClick(item)} style={styles.messageGroup}>
        <View style={{ flex: 1 }}>
          <Image style={styles.profileImage} source={require('../assets/placeholderPFP.png')}></Image>
        </View>

        {/* Message Content */}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0, flex: 3, marginLeft: 5 }}>
          <Text style={{ color: '#5A8F7B', fontSize: 14, fontWeight: '600' }}>{item}</Text>
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

  useEffect(() => {
    grabMessageData();
  }, [])

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
          data={messageDataChatIDs}
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