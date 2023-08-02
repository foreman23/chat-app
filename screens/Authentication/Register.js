import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback } from 'react-native'
import { React, useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import ProgressBar from 'react-native-progress/Bar';
import { UserContext } from '../Context/UserContext';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Register = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const auth = getAuth();

    // Grab UserContext
    const {userInfo, setUserInfo} = useContext(UserContext);

    // Grab firestore
    const firestore = getFirestore();

    const handleSignUp = () => {
        // Check passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match, please try again');
        }
        // Check password length
        else if (password.length < 8) {
            setError('Password must be at least 8 characters long')
        }
        // Check for symbols and numbers
        else {
            setError('');
            const hasNumbers = /\d/.test(confirmPassword);
            const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword);
            if (hasNumbers === false || hasSymbol === false) {
                setError('Must contain at least 1 number and 1 symbol')
            }
            // Create a new firebase user with credentials
            else {
                createUserWithEmailAndPassword(auth, email, confirmPassword)
                    .then(userCredentials => {
                        const user = userCredentials.user;
                        // Push userInfo to firestore
                        writeUserInfo(email);
                        //navigation.replace('Profile')
                    })
                    .catch(error => alert(error.message));
            }
        }
    }

    // Helper for write userInfo to firestore
    async function writeUserInfo(email) {
        try {
            const docRef = doc(firestore, 'userInfo', email.toLowerCase());
            await setDoc(docRef, userInfo);
            console.log('User info written to firestore');
        } catch (error) {
            console.error('Error writing info to firestore', error);
        }
    }

    // Navigate to last page
    handleBack = () => {
        navigation.goBack();
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
                            onChangeText={text => setPassword(text)}
                        >
                        </TextInput>
                        <Text style={styles.headerText}>Confirm password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder='Confirm password'
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
        paddingLeft: 25,
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