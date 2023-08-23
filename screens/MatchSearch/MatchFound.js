import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native'
import React, { useEffect, useContext } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../../components/BackButton'
import { PairContext } from '../Context/PairContext';
import { auth } from '../../firebase';

const MatchFound = ({ navigation }) => {

  // Grab pair context
  const {resetPair, pairInfo, setPairInfo} = useContext(PairContext);

  const handleDeny = () => {

  }

  const handleAccept = () => {

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

  // Call once on screen render
  useEffect(() => {
    parseChatID();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TouchableOpacity onPress={handleDebug}>
          <Icon size={30} name='chevron-back'></Icon>
      </TouchableOpacity>
      <Text>MatchFound!!!</Text>
      <Text>{pairInfo.chatID}</Text>
    </View>
  )
}

export default MatchFound

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
})