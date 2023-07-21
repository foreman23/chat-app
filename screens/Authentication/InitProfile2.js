import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback, Button, useColorScheme } from 'react-native'
import { React, useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase';
import ProgressBar from 'react-native-progress/Bar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { UserContext } from '../Context/UserContext';

const InitProfile2 = ({ navigation }) => {

    // this is pure data to be passed as context and stored in userInfo
    const [birthdate, setBirthdate] = useState(null);
    const [selectedGender, setSelectedGender] = useState('Male');
    // this is for display purposes
    const [displayDate, setDisplayDate] = useState('Select birthday')

    // Grab UserContext
    const {userInfo, setUserInfo} = useContext(UserContext);
    // Update birthdate and gender property of context
    async function updateUser() {
        // Calculate persons age (must be 18+)
        const currentDate = new Date();
        const ageInMilliseconds = currentDate - birthdate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const age = Math.floor(ageInYears);
        if (birthdate === null) {
            console.warn('Please select a birthdate')
        }
        else if (age < 18) {
            console.warn('You must be over 18 to use this app')
        }
        else {
            await setUserInfo((prevUser) => ({ ...prevUser, gender: selectedGender }));
            await setUserInfo((prevUser) => ({ ...prevUser, birthdate: birthdate }));
            handleNext();
        }
    }

    // Navigaste to last page
    handleBack = () => {
        navigation.goBack();
    }

    // Navigate to next page
    handleNext = () => {
        console.log("InitProfile2: ", userInfo);
        navigation.push('InitProfile3');
    }

    // Date picker modal controllers
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const dateString = date.toLocaleDateString();
        // Pass this on
        setBirthdate(date);
        // Use this for display only
        setDisplayDate(dateString);
        console.log(date)
        hideDatePicker();
    };


    const [maleSelected, setMaleSelected] = useState(true);
    const [femaleSelected, setFemaleSelected] = useState(false);
    const [nonBinarySelected, setNonBinarySelected] = useState(false);

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
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <ProgressBar style={styles.progressStyle} progress={0.5} color='#5A8F7B'></ProgressBar>
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={handleBack}>
                            <Icon size={30} name='chevron-back'></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.headerText}>Gender</Text>
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
                        <Text style={styles.headerText}>Your birthdate</Text>
                        <View style={styles.buttonContainerOutline}>
                            <TouchableOpacity onPress={showDatePicker} style={styles.button}>
                                <Text style={styles.buttonTextOutline}>{displayDate}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={updateUser} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
}

export default InitProfile2

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
        marginTop: 10,
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
        marginTop: 10,
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
    buttonContainerOutline: {
        marginHorizontal: 0,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
    },
    buttonTextOutline: {
        color: '#5A8F7B',
        fontWeight: 600,
        fontSize: 18,
        textAlign: 'center',
    },
    inputContainer: {
        textAlign: 'center',
        marginHorizontal: 25,
        marginTop: 125,
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
    preferencesContainer: {
        marginHorizontal: 0,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        paddingBottom: 20,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    preferencesGender: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 10,
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