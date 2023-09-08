import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { firestore } from '../firebase';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { UserContext } from './Context/UserContext';

export default function FindMatch({ navigation }) {

  const [matchArr, setMatchArr] = useState(["Person1", "Person2", "Person3", "Person4", "Person5", "Person6", "Person6"]);

  const [femaleSelected, setFemaleSelected] = useState(false);
  const [maleSelected, setMaleSelected] = useState(false);
  const [localSelected, setLocalSelected] = useState(false);
  const [globalSelected, setGlobalSelected] = useState(false);

  // State variables for user context
  const { userInfo, setUserInfo } = useContext(UserContext);

  // THIS SHOULD BE CHANGED/DELETED LATER
  const handleFemale = () => {
    setFemaleSelected(!femaleSelected);
  }
  const handleMale = () => {
    setMaleSelected(!maleSelected);
  }
  const handleLocal = () => {
    setLocalSelected(!localSelected);
  }
  const handleGlobal = () => {
    setGlobalSelected(!globalSelected);
  }

  // Get firestore user info from authenticated email
  const [isLoading, setIsLoading] = useState(true);
  const readUserData = async () => {
    if (auth.currentUser) {
      try {
        const docRef = doc(firestore, "userInfo", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
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
          setIsLoading(false);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    }

  };

  // Handle button press for start find match
  const handleFindMatch = async () => {
    console.log('Finding match...')

    if (auth.currentUser) {
      try {
        const docRef = doc(firestore, 'pairing_system', 'waiting');
        await updateDoc(docRef, {
          uidArr: arrayUnion(auth.currentUser.uid),
        })
        console.log("WRITTEN to firestore")
        // UNCOMMENT LATER WHEN IMPLEMENT BACKGROUND SEARCH
        //navigation.push('Searching');

        navigation.replace('Searching');

      } catch (error) {
        console.error('Error adding user to match pool', error);
      }
    }
  }


  useEffect(() => {
    // Call the readUserData function when the component mounts or whenever the auth.currentUser.email changes
    if (userInfo.location.country_code === "DEFAULT_VALUE") {
      console.log("READING user state from firestore:")
      console.log(userInfo)
      readUserData();
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
      <ScreenHeader navigation={navigation} title='Tangoh'></ScreenHeader>

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

      <View style={styles.preferencesHeader}>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>Preferences</Text>
      </View>

      <View style={styles.preferencesContainer}>
        <Text style={{ textAlign: 'center', marginTop: 5, marginBottom: 15, fontSize: 16, fontWeight: 400 }}>Gender</Text>
        <View style={styles.preferencesGender}>
          <TouchableOpacity onPress={handleFemale} style={[styles.selectorBoxInActive, femaleSelected && styles.selectorBoxActive]}>
            <Icon style={[styles.inactiveIcon, femaleSelected && styles.activeIcon]} name='female' size={51}></Icon>
            <Text style={[styles.inactiveText, femaleSelected && styles.activeText]}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMale} style={[styles.selectorBoxInActive, maleSelected && styles.selectorBoxActive]}>
            <Icon style={[styles.inactiveIcon, maleSelected && styles.activeIcon]} name='male' size={51}></Icon>
            <Text style={[styles.inactiveText, maleSelected && styles.activeText]}>Male</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.preferencesContainer}>
        <Text style={{ textAlign: 'center', marginTop: 5, marginBottom: 15, fontSize: 16, fontWeight: 400 }}>Location</Text>
        <View style={styles.preferencesGender}>
          <TouchableOpacity onPress={handleLocal} style={[styles.selectorBoxInActive, localSelected && styles.selectorBoxActive]}>
            <Icon style={[styles.inactiveIcon, localSelected && styles.activeIcon]} name='map-outline' size={51}></Icon>
            <Text style={[styles.inactiveText, localSelected && styles.activeText]}>Local</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGlobal} style={[styles.selectorBoxInActive, globalSelected && styles.selectorBoxActive]}>
            <Icon style={[styles.inactiveIcon, globalSelected && styles.activeIcon]} name='earth-outline' size={51}></Icon>
            <Text style={[styles.inactiveText, globalSelected && styles.activeText]}>Global</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleFindMatch} style={styles.matchButtonContainer}>
        <Text style={styles.matchButton}>Find New Match</Text>
      </TouchableOpacity>
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
  preferencesHeader: {
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
