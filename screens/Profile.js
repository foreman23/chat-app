import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator, ImageBackground, ScrollView } from 'react-native'
import { React, useState, useEffect, useContext } from 'react'
import ScreenHeader from '../components/ScreenHeader';
import { auth, storage } from '../firebase';
import { firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserContext } from './Context/UserContext';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ navigation }) {

    const { userInfo, setUserInfo } = useContext(UserContext);
    const [userDisplayAge, setUserDisplayAge] = useState(null);

    // Go to change name screen
    const navigateChangeName = () => {
        navigation.push('ChangeName');
    }

    // Go to change gender screen
    const navigateChangeGender = () => {
        navigation.push('ChangeGender');
    }

    // Go to change location screen
    const navigateChangeLocation = () => {
        navigation.push('ChangeLocation');
    }

    // Go to change profile picture screen
    const navigateChangePFP = () => {
        navigation.push('ChangePFP');
    }

    // Go to friends screen
    const navigateFriends = () => {
        navigation.push('FriendsList');
    }

    // List of interests
    const interests = ['Movies', 'Hiking', 'Reading', 'Gym', 'Writing', 'Fishing', 'Games']
    const renderItem = ({ item }) => {
        return (
            <View>
                <Text style={styles.interestItem}>{item}</Text>
            </View>
        );
    };

    // -----------------------------------------------------------------------

    // Function for changing profile picture
    const [imageChosen, setImageChosen] = useState(null);

    // Permissions flag
    const [permissionDenied, setPermissionDenied] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === true) {
            setPermissionDenied(false);
            try {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                });

                if (result.assets !== null) {
                    setImageChosen(result.assets[0].uri);
                    const blob = await getBlobFroUri(result.assets[0].uri);
                    uploadBlob(blob);
                }
            } catch (error) {
                console.error("Error picking image:", error);
            }
        }
        else {
            setPermissionDenied(true);
        }

    };


    // pickImage Helper 1:
    // Convert imageChosen URI to BLOB (binary large object)
    const getBlobFroUri = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        return blob;
    };

    // state to notify the updating image process
    const [onUpdateImage, setOnUpdateImage] = useState(Math.random())

    // pickImage Helper 2:
    // Upload BLOB to firebase storage
    const uploadBlob = async (blob) => {
        try {
            const storageRef = ref(storage, `pfps/RwUSQqgstKUzSVbQ7o2N4vSug5D2.png`);
            const snapshot = await uploadBytes(storageRef, blob);
            setOnUpdateImage(Math.random())
        } catch (error) {
            console.error("Error uploading blob:", error);
        }
    };

    // -----------------------------------------------------------------------

    // Grab profile picture from storage
    const [pfpURL, setPfpURL] = useState(null);
    useEffect(() => {
        const pfpRef = ref(storage, `pfps/RwUSQqgstKUzSVbQ7o2N4vSug5D2.png`)

        getDownloadURL(pfpRef).then((url) => {
            setPfpURL(url);
        })
            .catch((error) => {
                console.error('Error getting profile picture: ', error);
            })
    }, [auth.currentUser, storage]);

    // Get firestore user info from authenticated email
    const readUserData = async () => {
        try {
            const docRef = doc(firestore, "userInfo", auth.currentUser?.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Update the userInfo state with docSnap.data()
                setUserInfo(docSnap.data());
                const currentDate = new Date();
                const userBirthdate = new Date(docSnap.data().birthdate.seconds * 1000);
                age = currentDate.getUTCFullYear() - userBirthdate.getUTCFullYear();
                // Check if the birthday has occurred this year or not
                if (
                    currentDate.getUTCMonth() < userBirthdate.getUTCMonth() ||
                    (currentDate.getUTCMonth() === userBirthdate.getUTCMonth() &&
                        currentDate.getUTCDate() < userBirthdate.getUTCDate())
                ) {
                    // If the birthday hasn't occurred yet, subtract 1 from the age
                    age--;
                }
                setUserDisplayAge(age);
            } else {
                console.log("Document does not exist!");
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        }
    };

    useEffect(() => {
        // Call the readUserData function when the component mounts or whenever the auth.currentUser.email changes
        console.log("READING user state from firestore:")
        readUserData();
    }, [auth.currentUser?.email]);

    if (userInfo === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScreenHeader navigation={navigation} title='Profile'></ScreenHeader>
            <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {auth.currentUser.uid ? (
                        <View style={{ alignItems: 'center' }}>
                            {permissionDenied && (
                                <View style={{ marginBottom: 2 }}>
                                    <Text style={styles.permDenied}>* Enable media library permissions for Tangoh</Text>
                                </View>
                            )}
                            <Image style={styles.profileImage} source={{ uri: `https://firebasestorage.googleapis.com/v0/b/tangoh-2b4f6.appspot.com/o/pfps%2F${auth.currentUser.uid}.png?alt=media&token=e912bcd5-1111-4249-b9d7-3c843492e4de` + '?' + onUpdateImage }}></Image>
                        </View>
                    ) : (
                        <Text>PFP Here</Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.profileNameContainer}>
                <TouchableOpacity onPress={navigateChangeName}>
                    <Text style={{ fontSize: 18, color: '#323232' }}>{userInfo.name}<Text style={styles.greenTextAge}>  {userDisplayAge}</Text></Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={navigateFriends} style={styles.bioBar}>
                <Text>Friends</Text>
                <Text style={styles.greenText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateChangeGender} style={styles.bioBar}>
                <Text>Gender</Text>
                <Text style={styles.greenText}>{userInfo.gender}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateChangeLocation} style={styles.bioBar}>
                <Text>Location</Text>
                <Text style={styles.greenText}>{userInfo.country}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.interestsContainer}>
                <View style={styles.interestBar}>
                    <Text>Interests</Text>
                    <Text style={{ color: '#5A8F7B', fontSize: 12, fontWeight: '600' }}>See All</Text>
                </View>
                <View style={styles.interests}>
                    <FlatList data={interests}
                        renderItem={renderItem}
                        key={'+'}
                        keyExtractor={(item) => "+" + item.id}
                        numColumns={4}
                        contentContainerStyle={styles.listContainer}>
                    </FlatList>
                </View>
            </TouchableOpacity>

        </View>
    )
}

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
    permDenied: {
        textAlign: 'center',
        color: 'red',
    },
    bioBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginVertical: 7,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 20,
        marginHorizontal: 15,
    },
    interestBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 7,
        paddingVertical: 15,
    },
    interestsContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        marginVertical: 7,
        marginHorizontal: 15,
        paddingHorizontal: 30,
    },
    interests: {
        flexDirection: 'row',
    },
    interestItem: {
        backgroundColor: '#5A8F7B',
        color: '#FFFFFF',
        marginHorizontal: 5,
        marginVertical: 2,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 32.5,
        fontSize: 12,
    },
    profileNameContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 15,
    },
    profileImageContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 75,
    },
    greenText: {
        color: '#5A8F7B',
        fontWeight: 'bold',
    },
    greenTextAge: {
        color: '#5A8F7B',
        fontWeight: 'bold',
    },
    listContainer: {
        flexDirection: 'column',
        marginBottom: 15,
    },
})