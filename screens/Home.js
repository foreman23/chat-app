import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { firestore } from '../firebase';
import { arrayUnion, doc, getDoc, setDoc, updateDoc, collection, query, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { UserContext } from './Context/UserContext';

export default function FindMatch({ navigation }) {

  const [matchArr, setMatchArr] = useState(["Person1", "Person2", "Person3", "Person4", "Person5", "Person6", "Person6"]);


  // State variables for user context
  const { userInfo, setUserInfo } = useContext(UserContext);


  // Get firestore user info from authenticated email
  const [isLoading, setIsLoading] = useState(true);
  const readUserData = async () => {
    if (auth.currentUser) {
      try {
        // Grab basic profile info
        const docRef = doc(firestore, "userInfo", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        // Grab friends list and friend requests
        const friendsSnap = await getDoc(doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friends"));
        const requestSnap = await getDoc(doc(firestore, "userInfo", auth.currentUser.uid, "pairing", "friend_requests"))
        console.log(friendsSnap.data())


        if (docSnap.exists() && friendsSnap.exists()) {
          // Update the userInfo state with docSnap.data()
          setUserInfo(docSnap.data());
          const currentDate = new Date();
          const userBirthdate = new Date(docSnap.data().birthdate.seconds * 1000);
          age = currentDate.getUTCFullYear() - userBirthdate.getUTCFullYear();
          // Check if the birthday has occurred this year or not
          if (
            currentDate.getUTCMonth() < userBirthdate.getUTCMonth() ||
            (currentDate.getUTCMonth() === userBirthdate.getUTCMonth() &&
              currentDate.getUTCDate() < userBirthdate.getUTCDate())
          ) {
            // If the birthday hasn't occurred yet, subtract 1 from the age
            age--;
          }
          await setUserInfo((prevUser) => ({ ...prevUser, age: age }));
          await setUserInfo((prevUser) => ({ ...prevUser, friends: friendsSnap.data()}))
          await setUserInfo((prevUser) => ({ ...prevUser, friend_requests: requestSnap.data()}))
          setIsLoading(false);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    }

  };

  // Render the category items
  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    )
  }

  const [categoryNames, setCategoryNames] = useState();
  // Get the categories from firestore collection
  const getCategories = async() => {
    if (auth.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(firestore, "categories"));
        const categoryNamesArr = []
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, " => ", doc.data())
          categoryNamesArr.push(doc.id);
        })
        setCategoryNames(categoryNamesArr);
      }
      catch(error) {
        console.error("Error fetching category documents from firestore: ", error);
      }
    }
  }


  useEffect(() => {
    // Call the readUserData function when the component mounts or whenever the auth.currentUser.email changes
    if (userInfo.location.country_code === "DEFAULT_VALUE") {
      console.log("READING user state from firestore:")
      console.log(userInfo)
      readUserData();
      getCategories();
    }

    else {
      setIsLoading(false)
    }

  }, [auth.currentUser?.email]);


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
      <ScreenHeader navigation={navigation} title='Forum'></ScreenHeader>

      <View style={styles.matchContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {matchArr.map((match, index) => {
            return (
              <View style={styles.matchStory} key={index}>
                <Icon style={{ textAlign: 'center' }} color={'grey'} size={70} name='person-circle-outline'></Icon>
                <Text style={{ fontSize: 12, textAlign: 'center' }}>{match}</Text>
              </View>
            )
          })}
        </ScrollView>
      </View>

      <View style={styles.categoryHeader}>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>Categories</Text>
      </View>

      <View>
        <FlatList
          data={categoryNames}
          renderItem={renderItem}
          key={'+'}
          keyExtractor={(item) => "+" + item}
        >
        </FlatList>
      </View>


    </View>
  );
}

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
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  matchStory: {
    marginHorizontal: 3,
  },
  categoryHeader: {
    marginLeft: 20,
    marginBottom: 20,
  },
  preferencesContainer: {
    marginHorizontal: 0,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 32.5,
    paddingBottom: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  preferencesGender: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  activeIcon: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
  },
  activeText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
  },
  inactiveIcon: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    color: '#5A8F7B',
  },
  inactiveText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#5A8F7B',
  },
  selectorBoxInActive: {
    borderWidth: 1,
    borderColor: '#5A8F7B',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  selectorBoxActive: {
    borderWidth: 1,
    borderColor: '#5A8F7B',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#5A8F7B',
  },
  matchButtonContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    borderRadius: 32.5,
    backgroundColor: '#5A8F7B',
  },
  matchButton: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    padding: 20,
  },
});
