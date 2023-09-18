import { StyleSheet, Text, View, Pressable, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, StatusBar, FlatList, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useRef, useState, useContext } from 'react';
import BackButton from '../../components/BackButton'
import { firestore, auth } from '../../firebase';
import { UserContext } from '../Context/UserContext';
import { arrayUnion, doc, getDoc, setDoc, updateDoc, collection, query, getDocs, where } from 'firebase/firestore';



export default function AddFriend({ navigation }) {

  // Grab UserContext
  const { userInfo, setUserInfo } = useContext(UserContext);

  // Open keyboard for search
  const textInputRef = useRef(null);
  const handleSearchPress = () => {
    textInputRef.current.focus();
  };

  // Navigate to FriendsList
  const handleFriendsList = () => {
    navigation.push('FriendsList');
  }

  // Navigate to Requests
  const handleRequests = () => {
    navigation.push('Requests');
  }

  // State variable for holding current search input
  const [searchText, setSearchText] = useState('');
  const [resultList, setResultList] = useState(null);
  // Handles search when triggered
  const handleExecuteSearch = async () => {
    console.log("READING FROM FIRESTORE");
    resultData = [];

    const q = query(collection(firestore, "userInfo"), where("name", "==", searchText));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      console.log('No accounts found')
    }

    else {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        if (doc.id !== auth.currentUser.uid) {
          data['uid'] = doc.id
          resultData.push(data)
        }
      });
      setResultList(resultData)
    }

  }

  // Get Flag Emoji from country code
  function getFlagEmoji(country_code) {
    const codePoints = country_code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  const sendFriendRequest = async (theirUID) => {
    setPressedStates((prevState) => ({
      ...prevState,
      [theirUID]: true,
    }))
    try {
      const docRef1 = doc(firestore, "userInfo", theirUID, "pairing", "friend_requests");
      const docRef2 = doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friend_requests");
      // Update other user's incoming requests with currentUser.uid
      await updateDoc(docRef1, {
        incomingArr: arrayUnion(auth.currentUser.uid),
      })
      // Update active user's outgoing requests with theirUID
      await updateDoc(docRef2, {
        outgoingArr: arrayUnion(theirUID),
      })
      console.log("WRITTEN to firestore")
    }
    catch (error) {
      console.error("Error sending friend request:", error);
    }
  }

  // State for holding pressed user buttons
  const [pressedStates, setPressedStates] = useState({});

  // Render the user items
  const renderItem = ({ item }) => {
    //console.log(item)
    const flagEmoji = getFlagEmoji(item.location.country_code);

    // Check if already friends with this user
    let alreadyFriends = false;
    if (userInfo.friends.friendArr.includes(item.uid)) {
      alreadyFriends = true;
    }

    return (
      <View style={{ borderWidth: 1, borderColor: '#D2D2D2', flexDirection: 'row', borderRadius: 24, margin: 10, paddingHorizontal: 5, paddingVertical: 10, marginBottom: 2 }}>
        {item.defaultPfp ? (
          <Image
            style={styles.profileImage}
            source={require('../../assets/placeholderPFP.png')}>
          </Image>
        ) : (
          <Image
            style={styles.profileImage}
            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${item.uid}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6` }}>
          </Image>
        )}
        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, }}>
          <Text>@{item.name}</Text>
          <Text>Level: {item.level}</Text>
          <Text>{flagEmoji}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 30, marginTop: 2.5 }}>
          {pressedStates[item.uid] || userInfo.friend_requests.incomingArr.includes(item.uid) || userInfo.friend_requests.outgoingArr.includes(item.uid) || alreadyFriends ? (
            <Pressable disabled>
              {alreadyFriends ? (
                <Icon style={styles.icon} size={20} color={'#D2D2D2'} name='chatbox-outline'></Icon>
              ) : (
                <Icon style={styles.icon} size={20} color={'#D2D2D2'} name='checkmark-outline'></Icon>
              )}
            </Pressable>
          ) : (
            <Pressable onPress={() => sendFriendRequest(item.uid)}>
              {alreadyFriends ? (
                <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='chatbox-outline'></Icon>
              ) : (
                <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='add'></Icon>
              )}
            </Pressable>
          )}
        </View>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <StatusBar style="auto" />
          <BackButton navigation={navigation}></BackButton>
          <Pressable style={styles.searchContainer} onPress={handleSearchPress}>
            <View>
              <TextInput
                onChangeText={text => setSearchText(text)}
                style={styles.searchBox}
                placeholder='Search for @username'
                keyboardType='web-search'
                autoCapitalize='none'
                ref={textInputRef}
              />
            </View>
            <TouchableOpacity onPress={handleExecuteSearch} style={{ alignItems: 'center', justifyContent: 'center' }} underlayColor='transparent'>
              <View>
                <Icon name="search" size={20} color="#5A8F7B" />
              </View>
            </TouchableOpacity>
          </Pressable>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
            <TouchableOpacity onPress={handleRequests} style={{ backgroundColor: '#5A8F7B', color: 'white', borderRadius: 32.5, padding: 20, flex: 2, textAlign: 'center', marginRight: 5, }}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{(userInfo.friend_requests.incomingArr).length}</Text>
              </View>
              <Text style={{ color: 'white', textAlign: 'center' }}>Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFriendsList} style={{ backgroundColor: '#5A8F7B', color: 'white', borderRadius: 32.5, padding: 20, flex: 2, textAlign: 'center', marginRight: 5, }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Friends</Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              data={resultList}
              renderItem={renderItem}
              key={'+'}
              keyExtractor={(item) => "+" + item.uid}
            >
            </FlatList>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -5, // Adjust the position as needed
    right: 0, // Adjust the position as needed
    backgroundColor: 'red', // Badge background color
    borderRadius: 10, // Make it a circle
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white', // Badge text color
    fontSize: 12,
    fontWeight: 'bold',
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
    textAlign: 'left',
    color: '#323232',
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
    marginHorizontal: 5,
    padding: 8,
  },
})