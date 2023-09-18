import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback, Platform } from 'react-native'
import { React, useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, firestore } from '../../firebase';
import ProgressBar from 'react-native-progress/Bar';
import { UserContext } from '../Context/UserContext';
import { PairContext } from '../Context/PairContext';
import { collection, where, query, getDocs } from 'firebase/firestore';

const InitProfile = ({ navigation }) => {

    const [name, setName] = useState('');
    // Grab UserContext
    const {userInfo, setUserInfo, resetUser} = useContext(UserContext);
    const {resetPair} = useContext(PairContext);
    
    // Reset UserContext to default values for new user
    useEffect(() => {
        resetUser();
        resetPair();
    }, []);

    // Update name property of context
    async function updateName() {

        // Check if username is already taken
        const q = query(collection(firestore, "userInfo"), where("name", "==", name));
        const querySnapshot = await getDocs(q);
        const querySize = querySnapshot.size;
        if (querySnapshot.size === 0) {
            console.log('Name not taken')
        }

        if (name.length >= 3 && name.length <= 20 && querySize === 0) {
            await setUserInfo((prevUser) => ({ ...prevUser, name: name}));
            handleNext();
        }
        else if (querySize !== 0) {
            console.warn('Name already taken, please try again')
        }

        else {
            console.warn('Name must be between 3 and 20 characters');
        }
    }


    // Navigaste to last page
    handleBack = () => {
        navigation.goBack();
    }

    // Navigate to next page
    handleNext = () => {
        console.log(userInfo)
        navigation.push('InitProfile2');
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <ProgressBar style={styles.progressStyle} progress={0.25} color='#5A8F7B'></ProgressBar>
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={handleBack}>
                            <Icon size={30} name='chevron-back'></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.headerText}>Choose a username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='username'
                            placeholderTextColor='#A9A9A9'
                            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                            autoCapitalize='words'
                            onChangeText={text => setName(text)}
                        >
                        </TextInput>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={updateName} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
}

export default InitProfile

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
    progressStyle: {
        marginVertical: 10,
        alignSelf: 'center',
    },
    notMatch: {
        marginLeft: 5,
        color: 'red',
    },
    headerText: {
        marginLeft: 10,
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