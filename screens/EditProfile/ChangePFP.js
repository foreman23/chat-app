import { StyleSheet, View, StatusBar, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { React, useContext, useState } from 'react'
import BackButton from '../../components/BackButton';
import LargeButton from '../../components/LargeButton';
import { UserContext } from '../Context/UserContext';
import { auth, firestore } from '../../firebase';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

const ChangePFP = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback>
        <View>
            <StatusBar style="auto"></StatusBar>
            <BackButton navigation={navigation}></BackButton>
            <View>
                <TextInput></TextInput>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default ChangePFP

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
})