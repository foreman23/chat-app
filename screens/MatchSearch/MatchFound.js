import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../../components/BackButton'
import { PairContext } from '../Context/PairContext';
import { auth, firestore } from '../../firebase';
import { getDoc, doc } from 'firebase/firestore';
import LargeButton from '../../components/LargeButton';

const MatchFound = ({ navigation }) => {

  // Grab pair context
  const { resetPair, pairInfo, setPairInfo } = useContext(PairContext);

  const handleAccept = () => {
    navigation.replace('Messenger')
  }

  const handleDebug = () => {
    navigation.replace('Main')
  }

  // Parse the chatID from context to separate the user's ID and the matched user's ID
  const parseChatID = () => {
    idArr = pairInfo.chatID;
    idArr = pairInfo.chatID.split("_");
    chatID1 = idArr[0];
    chatID2 = idArr[1];
    console.log(chatID1)
    console.log(chatID2)
    // Find respective IDs
    myUID = '';
    theirUID = '';
    if (auth.currentUser.uid === chatID1) {
      myUID = chatID1;
      theirUID = chatID2;
    }
    else {
      myUID = chatID2;
      theirUID = chatID1;
    }
    console.log(`Matched with user: ${theirUID}`)
  }

  const [matchedUserName, setMatchedUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const grabMatchUserInfo = async () => {
    if (auth.currentUser) {
      try {

        console.log("READING FROM FIRESTORE")

        const docRef = doc(firestore, "userInfo", theirUID)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setMatchedUserName(docSnap.data().name);
          setIsLoading(false);
        }

      }
      catch (error) {
        console.error("Error fetching document: ", error);
      }
    }
  }

  // Call once on screen render
  useEffect(() => {
    parseChatID();
    grabMatchUserInfo();
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
      <TouchableOpacity onPress={handleDebug}>
        <Icon size={30} name='chevron-back'></Icon>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.matchHeaderText}>{matchedUserName}</Text>
        <Image style={styles.profileImage} source={{ uri: `https://firebasestorage.googleapis.com/v0/b/tangoh-2b4f6.appspot.com/o/pfps%2F${theirUID}.jpg?alt=media&token=e912bcd5-1111-4249-b9d7-3c843492e4de` }}></Image>
        {/* <Image style={styles.profileImage} source={require('../../assets/placeholderPFP.png')}></Image> */}
        <LargeButton title='Start Messaging!' function={handleAccept}></LargeButton>
      </View>
    </View>
  )
}

export default MatchFound

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
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 75,
    marginBottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    marginTop: '50%',
  },
  matchHeaderText: {
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
  },
})