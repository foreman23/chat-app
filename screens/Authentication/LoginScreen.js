import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { React, useState, useEffect } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Retrieve auth status
    const auth = getAuth();

    // Bypass login screen if user logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            // User initial sign in
            if (user) {
                //console.log("current user: ", user);
                navigation.replace('Main');
            }
            // If no current user
            else {
                setIsLoading(false);
                //console.log("current user ELSE: ", user);
            }
        })

        return unsubscribe
    }, [])

    const handleSignUp = () => {
        navigation.push('InitProfile');
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
            })
            .catch(error => alert(error.message));
    }

    if (isLoading) {
        // Loading screen JSX
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <View>
                        <Text style={styles.title}>Tangoh</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            keyboardType='email-address'
                            autoCapitalize='none'
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
                    </View>
                    <View>
                        <Text style={styles.forgot}>Forgot password?</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleLogin} style={styles.button}>
                            <Text style={styles.buttonText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <Text style={styles.signUp}>Don't have an account? <Text onPress={handleSignUp} style={styles.highlight}>Sign up</Text></Text>
        </KeyboardAvoidingView>

    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 40,
        fontWeight: 600,
        color: '#323232',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
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