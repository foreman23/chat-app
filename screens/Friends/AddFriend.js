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
  console.log(userInfo)

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

    let resultData = [];
    const searchTextLower = searchText.toLowerCase();

    const q = query(collection(firestore, "userInfo"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const username = doc.data().name.toLowerCase();
      //console.log(doc.id, " => ", doc.data());
      if (username.includes(searchTextLower) && doc.id !== auth.currentUser.uid) {
        let data = doc.data();
        data['uid'] = doc.id
        resultData.push(data)
      }
    });
    console.log(resultData.length)
    setResultList(resultData)
    //console.log(searchText);
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

  // Render the user items
  const renderItem = ({ item }) => {
    console.log(item)
    const flagEmoji = getFlagEmoji(item.location.country_code);

    // Check if already friends with this user
    let alreadyFriends = false;
    if (userInfo.friends.friendArr.includes(item.uid)) {
      alreadyFriends = true;
    }

    return (
      <View style={{ borderWidth: 1, borderColor: '#D2D2D2', flexDirection: 'row', borderRadius: 24, margin: 10, paddingHorizontal: 5, paddingVertical: 10, marginBottom: 2}}>
        <Image
          style={styles.profileImage}
          source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${item.uid}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6` }}>
        </Image>
        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, }}>
          <Text>{item.name}</Text>
          <Text>Level: {item.level}</Text>
          <Text>{flagEmoji}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 30, marginTop: 2.5 }}>
          <Pressable onPress={() => sendFriendRequest(item.uid)}>
            {alreadyFriends ? (
              <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='chatbox-outline'></Icon>
            ) : (
              <Icon style={styles.icon} size={20} color={'#5A8F7B'} name='add'></Icon>
            )}
            
          </Pressable>
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
                placeholder='Search'
                keyboardType='web-search'
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