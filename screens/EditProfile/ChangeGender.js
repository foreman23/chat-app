import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { React, useState, useContext } from 'react'
import BackButton from '../../components/BackButton';
import LargeButton from '../../components/LargeButton';
import { UserContext } from '../Context/UserContext';
import { auth, firestore } from '../../firebase';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

const ChangeGender = ({ navigation }) => {

    // Grab UserContext
    const {userInfo, setUserInfo} = useContext(UserContext);
    // Grab firestore
    const firestore = getFirestore();

    const [maleSelected, setMaleSelected] = useState(userInfo.gender === 'Male');
    const [femaleSelected, setFemaleSelected] = useState(userInfo.gender === 'Female');
    const [nonBinarySelected, setNonBinarySelected] = useState(userInfo.gender === 'Nonbinary');
    const [selectedGender, setSelectedGender] = useState(userInfo.gender);

    
    // Handle submit form
    const handleSubmit = () => {
        updateUserInfo();
    }
    
    // Update user information to firestore
    async function updateUserInfo() {
        try {
            // Update firestore db with new gender
            const docRef = doc(firestore, 'userInfo', auth.currentUser?.email.toLowerCase());
            await updateDoc(docRef, {
                gender: selectedGender
            })
            console.log("WRITTEN to firestore")
            // Update userContext
            await setUserInfo((prevUser) => ({ ...prevUser, gender: selectedGender }));
            navigation.goBack();
        } catch (error) {
            console.error('Error updating gender info to firestore', error);
        }
    }

    const handleFemale = () => {
        setFemaleSelected(true);
        setSelectedGender('Female');
        if (maleSelected === true) {
            setMaleSelected(false);
        }
        if (nonBinarySelected === true) {
            setNonBinarySelected(false);
        }
    }
    const handleMale = () => {
        setMaleSelected(true);
        setSelectedGender('Male');
        if (femaleSelected === true) {
            setFemaleSelected(false);
        }
        if (nonBinarySelected === true) {
            setNonBinarySelected(false);
        }
    }

    const handleNonBinary = () => {
        setNonBinarySelected(true)
        setSelectedGender('Nonbinary');
        if (maleSelected === true) {
            setMaleSelected(false);
        }
        if (femaleSelected === true) {
            setFemaleSelected(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <BackButton navigation={navigation}></BackButton>

            <View style={styles.preferencesGender}>
                <TouchableOpacity onPress={handleMale} style={[styles.selectorBoxInActive, maleSelected && styles.selectorBoxActive]}>
                    <Icon style={[styles.inactiveIcon, maleSelected && styles.activeIcon]} name='male' size={41}></Icon>
                    <Text style={[styles.inactiveText, maleSelected && styles.activeText]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFemale} style={[styles.selectorBoxInActive, femaleSelected && styles.selectorBoxActive]}>
                    <Icon style={[styles.inactiveIcon, femaleSelected && styles.activeIcon]} name='female' size={41}></Icon>
                    <Text style={[styles.inactiveText, femaleSelected && styles.activeText]}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNonBinary} style={[styles.selectorBoxInActive, nonBinarySelected && styles.selectorBoxActive]}>
                    <Icon style={[styles.inactiveIcon, nonBinarySelected && styles.activeIcon]} name='male-female' size={41}></Icon>
                    <Text style={[styles.inactiveText, nonBinarySelected && styles.activeText]}>Nonbinary</Text>
                </TouchableOpacity>
            </View>
            <LargeButton function={handleSubmit} title='Submit Changes'></LargeButton>
        </View>
    )
}

export default ChangeGender

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    preferencesGender: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 25,
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
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 25,
    },
    selectorBoxActive: {
        borderWidth: 1,
        borderColor: '#5A8F7B',
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 25,
        backgroundColor: '#5A8F7B',
    },
})