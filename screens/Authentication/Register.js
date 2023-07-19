import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback } from 'react-native'
import { React, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase';

const Register = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const handleSignUp = () => {
        console.log(password)
        console.log(confirmPassword)
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
                auth.createUserWithEmailAndPassword(email, confirmPassword)
                    .then(userCredentials => {
                        const user = userCredentials.user;
                    })
                    .catch(error => alert(error.message));
            }
        }
    }

    handleBack = () => {
        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={handleBack}>
                            <Icon size={30} name='chevron-back'></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            onChangeText={text => setEmail(text)}
                        >
                        </TextInput>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder='Password'
                            onChangeText={text => setPassword(text)}
                        >
                        </TextInput>
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
    highlight: {
        color: '#5A8F7B',
        fontWeight: 800,
    },
    buttonContainer: {
        marginHorizontal: 25,
        marginTop: 5,
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
        marginTop: 165,
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