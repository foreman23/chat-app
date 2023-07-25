import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { React, useContext, useState } from 'react'
import BackButton from '../../components/BackButton';
import LargeButton from '../../components/LargeButton';
import { UserContext } from '../Context/UserContext';
import { auth, firestore } from '../../firebase';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

const ChangeName = ({ navigation }) => {

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);
    // Grab firestore
    const firestore = getFirestore();

    const [selectedName, setSelectedName] = useState(userInfo.name);

    // Handle submit form
    const handleSubmit = () => {
        updateUserInfo();
    }

    // Update user information to firestore
    async function updateUserInfo() {
        try {
            // Update firestore db with new name
            const docRef = doc(firestore, 'userInfo', auth.currentUser?.email.toLowerCase());
            await updateDoc(docRef, {
                name: selectedName
            })
            console.log("WRITTEN to firestore")
            // Update userContext
            await setUserInfo((prevUser) => ({ ...prevUser, name: selectedName }));
            navigation.goBack();
        } catch (error) {
            console.error('Error updating name info to firestore', error);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <BackButton navigation={navigation}></BackButton>
            <View style={styles.inputContainer}>
                <TextInput onChangeText={text => setSelectedName(text)} defaultValue={userInfo.name}></TextInput>
            </View>
            <LargeButton function={handleSubmit} title='Submit Changes'></LargeButton>
        </View>
    )
}

export default ChangeName

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 10,
        paddingLeft: 20,
    },
})