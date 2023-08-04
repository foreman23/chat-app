import { KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, TouchableWithoutFeedback, FlatList } from 'react-native'
import { React, useState, useContext } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase';
import ProgressBar from 'react-native-progress/Bar';
import { UserContext } from '../Context/UserContext';
import countryData from '.././DataSets/CountryData';

const InitProfile3 = ({ navigation }) => {

    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('');

    // Navigate to last page
    handleBack = () => {
        navigation.goBack();
    }

    // Navigate to next page
    handleNext = () => {
        console.log(userInfo)
        navigation.push('Register');
    }

    // Grab UserContext
    const {userInfo, setUserInfo} = useContext(UserContext);

    // Update locatiuon properties for user context
    async function updateUser() {
        if (selectedLocation !== '') {
            await setUserInfo((prevUser) => ({
                ...prevUser, location: {
                    country_name: selectedLocation[0],
                    country_code: selectedCountryCode[0],
                }
            }));
            handleNext();
        }
        else {
            console.warn('You must pick a country')
        }
    }

    // Render item for the Flatlist
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ paddingVertical: 5 }}
                onPress={() => pressCountry(item)}
            >
                <Text style={{ fontSize: 18, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0', paddingBottom: 5, color: '#323232' }}>{item.slice(1)}</Text>
            </TouchableOpacity>
        )
    }

    // Show or hide dropdown menu
    const [dropdown, setDropdown] = useState(false);
    function showDropdown(dismiss) {
        if (!dropdown && dismiss !== true) {
            setDropdown(true);
        }
        else {
            setDropdown(false);
        }
    }

    // Handle press country
    const pressCountry = (item) => {
        setSelectedLocation(item.slice(1));
        setSelectedCountryCode(item.slice(0, 1));
        showDropdown();
    }

    // convert to list with values on page mount
    const countryObject = Object.entries(countryData);

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <TouchableWithoutFeedback onPress={() => showDropdown(true)}>
                <View>
                    <StatusBar style="auto" />
                    <ProgressBar style={styles.progressStyle} progress={0.75} color='#5A8F7B'></ProgressBar>
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={handleBack}>
                            <Icon size={30} name='chevron-back'></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainerContainer}>
                        <Text style={styles.headerText}>Country</Text>
                        <TouchableOpacity onPress={showDropdown} style={styles.inputContainer}>
                            <Text style={{ fontSize: 18, paddingVertical: 10 }}>{selectedLocation}</Text>
                        </TouchableOpacity>
                        {dropdown && (
                            <FlatList
                                style={styles.dropContainer}
                                data={countryObject}
                                renderItem={renderItem}
                                keyExtractor={(item) => item}
                            >
                            </FlatList>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={updateUser} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.buttonContainerOutline}>
                        <TouchableOpacity onPress={handleNext} style={styles.button}>
                            <Text style={styles.buttonTextOutline}>Skip</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    )
}

export default InitProfile3

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
    dropContainer: {
        marginHorizontal: 20,
        marginTop: 0,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 10,
        paddingLeft: 20,
        maxHeight: 350,
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
        marginLeft: 30,
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
        marginTop: 22.5,
        marginBottom: 7.5,
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
        marginHorizontal: 25,
        marginTop: 5,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: '#5A8F7B',
        backgroundColor: 'white',
    },
    buttonTextOutline: {
        color: '#5A8F7B',
        fontWeight: 600,
        fontSize: 18,
        textAlign: 'center',
    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12.5,
        padding: 10,
        paddingLeft: 20,
    },
    inputContainerContainer: {
        textAlign: 'center',
        marginHorizontal: 5,
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
        paddingLeft: 12.5,
    },
})