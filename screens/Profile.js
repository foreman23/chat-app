import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator, ImageBackground, ScrollView } from 'react-native'
import { React, useState, useEffect, useContext } from 'react'
import ScreenHeader from '../components/ScreenHeader';
import { auth, storage } from '../firebase';
import { firestore } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { UserContext } from './Context/UserContext';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import countryData from './DataSets/CountryData';

export default function Profile({ navigation }) {

    const { userInfo, setUserInfo } = useContext(UserContext);

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

    // List of interests
    const interests = ['Movies', 'Hiking', 'Reading', 'Gym', 'Writing', 'Fishing', 'Games']
    const renderItem = ({ item }) => {
        return (
            <View style={styles.interestItemContainer}>
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
                    const imageSize = await checkImageSize(result.assets[0].uri);
                    if (imageSize <= 30000000) {
                        setImageChosen(result.assets[0].uri);
                        const uri = await compressUri(result.assets[0].uri)
                        console.log(uri)
                        const blob = await getBlobFroUri(uri);
                        const success = await uploadBlob(blob);
                        //console.log(success)
                        if (success === true) {
                            // Update firestore db to not use default pfp
                            const docRef = doc(firestore, 'userInfo', auth.currentUser.uid);
                            await updateDoc(docRef, {
                                defaultPfp: false
                            })
                            setUserInfo((prevUser) => ({ ...prevUser, defaultPfp: false, }));
                        }
                    }
                    else {
                        console.error('Error picking image: Too large!');
                    }
                }
            } catch (error) {
                console.error("Error picking image:", error);
            }
        }
        else {
            setPermissionDenied(true);
        }

    };

    // pickImage Helper 0:
    // Check image size (must be less than 30mb or 30,000,000 bytes)
    const checkImageSize = async (uri) => {
        const fileInfo = await FileSystem.getInfoAsync(uri)
        return fileInfo.size
    }

    // pickImage Helper 1:
    // Compress image uri
    const compressUri = async (uri) => {
        try {
            const result = await manipulateAsync(
                uri,
                [{ resize: { width: 320 } }],
                { compress: 0.8, format: 'jpeg' }
            )

            return result.uri;
        } catch (error) {
            console.error('Error compressing and resizing image:', error);
            return null;
        }
    }

    // pickImage Helper 2:
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

    // pickImage Helper 3:
    // Upload BLOB to firebase storage
    const uploadBlob = async (blob) => {
        if (auth.currentUser) {
            try {
                const storageRef = ref(storage, `pfps/${auth.currentUser.uid}.jpg`);
                const metadata = {
                    contentType: 'image/jpeg',
                }
                const snapshot = await uploadBytes(storageRef, blob, metadata);
                setOnUpdateImage(Math.random())
                return true
            } catch (error) {
                console.error("Error uploading blob:", error);
                return false
            }
        }
    };

    // Function and use state for switching between level and exp view
    // const [levelView, setLevelView] = useState(true);

    // const handlePressLevel = () => {
    //     if (levelView === true) {
    //         setLevelView(false);
    //     }
    //     else {
    //         setLevelView(true);
    //     }
    // }

    // Get Flag Emoji from country code
    function getFlagEmoji() {
        const codePoints = userInfo.location.country_code
          .toUpperCase()
          .split('')
          .map(char =>  127397 + char.charCodeAt());
        setFlagEmoji(String.fromCodePoint(...codePoints));
    }


    // Use state and use effect for setting emoji after populating userInfo
    const [flagEmoji, setFlagEmoji] = useState(null);
    useEffect(() => {
        console.log('getting emoji')
        console.log(userInfo)
        getFlagEmoji();
    }, [userInfo])

    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScreenHeader navigation={navigation} title='Profile'></ScreenHeader>
            <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={pickImage}>
                    {auth.currentUser ? (
                        <View style={{ alignItems: 'center' }}>
                            {permissionDenied && (
                                <View style={{ marginBottom: 2 }}>
                                    <Text style={styles.permDenied}>* Enable media library permissions for Tangoh</Text>
                                </View>
                            )}
                            {userInfo.defaultPfp === true && (
                                <Image style={styles.profileImage} source={require('../assets/placeholderPFP.png')}></Image>
                            )}
                            {userInfo.defaultPfp === false && (
                                <Image
                                    onLoadStart={() => setIsLoading(true)}
                                    onLoadEnd={() => setIsLoading(false)}
                                    style={styles.profileImage}
                                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/chat-app-9e460.appspot.com/o/pfps%2F${auth.currentUser.uid}.jpg?alt=media&token=9aa7780c-39c4-4c0f-86ea-8a38756acaf6` + '?' + onUpdateImage }}></Image>
                            )}
                            {/* {isLoading && ( // This is where the loading indicator will be rendered
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size='small' color='#5A8F7B'></ActivityIndicator>
                                </View>
                            )} */}
                        </View>
                    ) : (
                        <Text>PFP Here</Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.profileNameContainer}>
                <TouchableOpacity onPress={navigateChangeName}>
                    <Text style={{ fontSize: 16, color: '#323232' }}>{userInfo.name}<Text style={styles.greenTextAge}>  {userInfo.level}</Text></Text>
                </TouchableOpacity>
            </View>

            {/* <TouchableOpacity onPress={handlePressLevel} style={[styles.bioBarContainer, !levelView && styles.bioBarExpContainer, levelView]}>
                <View style={[styles.bioBarLevel, !levelView && styles.bioBarExp, levelView, !levelView && userInfo.exp <= 15 ? { width: `14%` } : null, !levelView && userInfo.exp > 15 ? { width: `${userInfo.exp}%` } : null]}>
                    {levelView && (
                        <View style={styles.levelView}>
                            <Text>Level</Text>
                            <Text style={styles.greenText}>{userInfo.level}</Text>
                        </View>
                    )}
                    {!levelView && (
                        <View style={styles.levelViewExp}>
                            <Text style={{ marginRight: 7, color: '#FFFFFF' }}>{(userInfo.exp / 100) * 100}%</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.bioBar}>
                <Text>Friends</Text>
                <Text style={styles.greenText}>{(userInfo.friends.friendArr).length}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateChangeGender} style={styles.bioBar}>
                <Text>Gender</Text>
                <Text style={styles.greenText}>{userInfo.gender}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateChangeLocation} style={styles.bioBar}>
                <Text>Location</Text>
                <Text style={styles.greenText}>{flagEmoji} {userInfo.location.country_code}</Text>
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
        marginTop: 15,
    },
    permDenied: {
        textAlign: 'center',
        color: 'red',
    },
    bioBarContainer: {
        paddingHorizontal: 30,
        marginVertical: 7,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 20,
        marginHorizontal: 15,
    },
    bioBarExpContainer: {
        paddingHorizontal: 30,
        marginVertical: 7,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 32.5,
        padding: 20,
        marginHorizontal: 15,
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
    bioBarLevel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bioBarExp: {
        //width: '75%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 32.5,
        backgroundColor: '#5A8F7B',
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
    interestItemContainer: {
        backgroundColor: '#5A8F7B',
        borderRadius: 32.5,
        marginHorizontal: 4,
        marginVertical: 2,
        padding: 10,
        paddingHorizontal: 15,
    },
    interestItem: {
        color: '#FFFFFF',
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
    levelView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelViewExp: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
})