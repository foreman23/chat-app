import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { React, useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import ProgressBar from 'react-native-progress/Bar';
import { UserContext } from '../Context/UserContext';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

const Register = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const auth = getAuth();

    // Grab UserContext
    const {userInfo, setUserInfo} = useContext(UserContext);
    console.log(userInfo)

    // Grab firestore
    const firestore = getFirestore();

    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    const handleSignUp = () => {
        setIsLoading(true);
        // Check passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match, please try again');
            setIsLoading(false);
        }
        // Check password length
        else if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false);
        }
        // Check for symbols and numbers
        else {
            setError('');
            const hasNumbers = /\d/.test(confirmPassword);
            const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword);
            if (hasNumbers === false || hasSymbol === false) {
                setError('Must contain at least 1 number and 1 symbol')
                setIsLoading(false);
            }
            // Create a new firebase user with credentials
            else {
                createUserWithEmailAndPassword(auth, email, confirmPassword)
                    .then(userCredentials => {
                        const user = userCredentials.user;
                        // Push userInfo to firestore
                        writeUserInfo(auth.currentUser.uid);
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'ChoosePfp'}],
                        })
                        //navigation.replace('Profile')
                    })
                    .catch(error => alert(error.message)).then((result) => {
                        setIsLoading(false);
                    })
            }
        }
    }

    // Helper for write userInfo to firestore
    async function writeUserInfo(uid) {
        try {

            // Init empty pairArr for subcollection
            const subData = {
                pairArr: [],
            };

            const friendData = {
                friendArr: [],
            };

            const friendRequestData = {
                incomingArr: [],
                outgoingArr: [],
            }

            const docRef = doc(firestore, 'userInfo', uid);
            const docRef2 = doc(firestore, 'userInfo', uid, 'pairing', 'private_chats');
            const docRef3 = doc(firestore, 'userInfo', uid, 'pairing', 'friends');
            const docRef4 = doc(firestore, 'userInfo', uid, 'pairing', 'friend_requests');

            // Set the user document data
            await setDoc(docRef, userInfo);
            await setDoc(docRef2, subData);
            await setDoc(docRef3, friendData);
            await setDoc(docRef4, friendRequestData);

            console.log('User info written to firestore');
        } catch (error) {
            console.error('Error writing info to firestore', error);
        }
    }

    // Navigate to last page
    handleBack = () => {
        navigation.goBack();
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <ProgressBar style={styles.progressStyle} progress={.95} color='#5A8F7B'></ProgressBar>
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={handleBack}>
                            <Icon size={30} name='chevron-back'></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.headerText}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor='#A9A9A9'
                            onChangeText={text => setEmail(text)}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        >
                        </TextInput>
                        <Text style={styles.headerText}>Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder='Password'
                            placeholderTextColor='#A9A9A9'
                            onChangeText={text => setPassword(text)}
                        >
                        </TextInput>
                        <Text style={styles.headerText}>Confirm password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder='Confirm password'
                            placeholderTextColor='#A9A9A9'
                            onChangeText={text => setConfirmPassword(text)}
                        >
                        </TextInput>
                        {error && (
                            <Text style={styles.notMatch}>{error}</Text>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerBar: {
        top: 0,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    notMatch: {
        marginLeft: 5,
        color: 'red',
    },
    progressStyle: {
        marginVertical: 10,
        alignSelf: 'center',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 40,
        fontWeight: 600,
        color: '#323232',
    },
    signUp: {
        textAlign: 'center',
        position: 'absolute',
        bottom: 35,
        alignSelf: 'center',
        fontWeight: 400,
        color: '#5c5b5b',
    },
    headerText: {
        marginLeft: 10,
    },
    highlight: {
        color: '#5A8F7B',
        fontWeight: 800,
    },
    buttonContainer: {
        marginHorizontal: 25,
        marginTop: 20,
        borderRadius: 12.5,
        backgroundColor: '#5A8F7B',
    },
    button: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        padding: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 600,
        fontSize: 18,
        textAlign: 'center',
    },
    inputContainer: {
        textAlign: 'center',
        marginHorizontal: 25,
        marginTop: 115,
    },
    input: {
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        marginVertical: 10,
        borderRadius: 12.5,
        fontSize: 16,
        padding: 15,
        paddingLeft: 12.5,
    },
    forgot: {
        textAlign: 'right',
        marginRight: 30,
        marginTop: 8,
        marginBottom: 20,
        color: '#5A8F7B',
        fontWeight: 800,
    },
})