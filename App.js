import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, FlatList, Touchable, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FindMatch from './screens/FindMatch';
import Navigator from './routes/homeStack';

export default function App() {

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
      <Navigator></Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
});
