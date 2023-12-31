import { StyleSheet, Text, View, StatusBar, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import BackButton from '../../components/BackButton'
import { auth, storage } from '../../firebase'
import { deleteUser } from 'firebase/auth'
import { deleteDoc, getFirestore, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { UserContext } from '../Context/UserContext'

const DeleteProfile = ({ navigation }) => {

    const [enteredEmail, setEnteredEmail] = useState('');

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);


    // Navigaste to last page
    handleBack = () => {
        navigation.goBack();
    }

    // Grab firestore
    const firestore = getFirestore();

    // Sign out current firebase user
    const handleSignOut = () => {
        auth.signOut()
        .then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        })
        .catch(error => alert(error.message));
    }

    // Delete user firestore information
    async function deleteFirestoreInfo() {
        const docRef = doc(firestore, 'userInfo', auth.currentUser.uid);
        await deleteDoc(docRef);
    }

    // Delete asscociated pfp from cloud storage
    async function deletePfp() {
        if (userInfo.defaultPfp === false) {
            const pfpRef = ref(storage, `pfps/${auth.currentUser.uid}.jpg`);
            deleteObject(pfpRef).then(() => {
                // File deleted successfully
            }).catch((error) => {
                console.error('Failed to delete user profile image', error);
            });
        }
    }

    // Delete user from authentication base
    async function deleteCurrentUser() {
        await deleteUser(auth.currentUser);
    }

    // Delete user account if entered string matches user email
    const [isLoading, setIsLoading] = useState(false);
    async function deleteUserAccount() {
        //console.log(enteredEmail);
        //console.log(auth.currentUser?.email)
        if (enteredEmail === auth.currentUser?.email) {
            setIsLoading(true);
            console.log('Email matches!')
            deleteFirestoreInfo().then(() => {
                deletePfp().then(() => {
                    deleteCurrentUser();
                    console.log('User deleted');
                    handleSignOut();
                })
            }).catch((error) => {
                console.error('Failed to delete user', error);
                setIsLoading(false);
            })
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <BackButton navigation={navigation}></BackButton>
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>Are you sure you want to delete your account?</Text>
                        <Text style={styles.text}>*There is no reversing this action!</Text>
                        <Text style={styles.text2}>Enter your email address to confirm delete:</Text>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{auth.currentUser?.email}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            placeholder='Email'
                            placeholderTextColor='#A9A9A9'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            onChangeText={text => setEnteredEmail(text)}>
                        </TextInput>
                    </View>
                    <TouchableOpacity onPress={deleteUserAccount} style={styles.buttonContainer}>
                        <Text style={styles.button}>Delete Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleBack} style={styles.secondaryButtonContainer}>
                        <Text style={styles.secondaryButton}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default DeleteProfile

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
    buttonContainer: {
        marginHorizontal: 20,
        marginTop: 5,
        borderRadius: 32.5,
        backgroundColor: '#FE0000',
    },
    button: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        padding: 20,
    },
    secondaryButtonContainer: {
        marginHorizontal: 20,
        marginTop: 5,
        borderRadius: 32.5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#5A8F7B',
    },
    secondaryButton: {
        color: '#5A8F7B',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        padding: 20,
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
    text: {
        marginTop: 10,
        textAlign: 'center',
    },
    text2: {
        marginTop: 15,
        textAlign: 'center',
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
    textContainer: {
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