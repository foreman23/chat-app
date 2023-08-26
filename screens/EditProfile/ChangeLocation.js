import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { React, useContext, useEffect, useState } from 'react'
import BackButton from '../../components/BackButton';
import LargeButton from '../../components/LargeButton';
import { UserContext } from '../Context/UserContext';
import { auth, firestore } from '../../firebase';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list';
import countryData from '../DataSets/CountryData';

const ChangeLocation = ({ navigation }) => {

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);
    // Grab firestore
    const firestore = getFirestore();

    const [selectedLocation, setSelectedLocation] = useState(userInfo.location.country_name);
    const [selectedCountryCode, setSelectedCountryCode] = useState(userInfo.location.country_code);


    // Handle submit form
    const handleSubmit = () => {
        updateUserInfo();
    }

    // Update user information to firestore
    async function updateUserInfo() {
        try {
            // Update firestore db with new location
            const docRef = doc(firestore, 'userInfo', auth.currentUser.uid);
            await updateDoc(docRef, {
                location: {
                    country_name: selectedLocation[0],
                    country_code: selectedCountryCode[0],
                }
            })
            console.log("WRITTEN to firestore")
            // Update userContext
            await setUserInfo((prevUser) => ({
                ...prevUser, location: {
                    country_name: selectedLocation[0],
                    country_code: selectedCountryCode[0],
                }
            }));
            navigation.goBack();
        } catch (error) {
            console.error('Error updating location info to firestore', error);
        }
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

    // convert to list with values on page mount
    const countryObject = Object.entries(countryData);

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => showDropdown(true)}>
                <View>
                    <StatusBar style="auto" />
                    <BackButton navigation={navigation}></BackButton>

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
                    
                    <View style={{ marginTop: 20 }}><LargeButton function={handleSubmit} title='Submit Changes'></LargeButton></View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default ChangeLocation

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
    dropContainer: {
        marginHorizontal: 20,
        marginTop: 25,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 10,
        paddingLeft: 20,
        maxHeight: 350,
    },
    dropView: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        paddingLeft: 20,
    },
})