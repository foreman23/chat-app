import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';

export default function FindMatch({ navigation }) {

  const [matchArr, setMatchArr] = useState(["Person1", "Person2", "Person3", "Person4", "Person5", "Person6", "Person6"]);

  const [femaleSelected, setFemaleSelected] = useState(false);
  const [maleSelected, setMaleSelected] = useState(false);
  const [localSelected, setLocalSelected] = useState(false);
  const [globalSelected, setGlobalSelected] = useState(false);

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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScreenHeader navigation={navigation} title='App Name'></ScreenHeader>

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

      <TouchableOpacity style={styles.matchButtonContainer}>
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
    color: '#439A97',
  },
  inactiveText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#439A97',
  },
  selectorBoxInActive: {
    borderWidth: 1,
    borderColor: '#439A97',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  selectorBoxActive: {
    borderWidth: 1,
    borderColor: '#439A97',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#439A97',
  },
  matchButtonContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    borderRadius: 32.5,
    backgroundColor: '#439A97',
  },
  matchButton: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    padding: 20,
  },
});
