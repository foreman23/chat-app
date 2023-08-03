import { KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View, Keyboard, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { React, useState, useContext, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { auth, storage } from '../../firebase'
import { UserContext } from '../Context/UserContext';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';


const ChoosePfp = ({ navigation }) => {

    // Grab UserContext
    const { userInfo, setUserInfo } = useContext(UserContext);

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

    // Submit Image upload
    const [isLoading, setIsLoading] = useState(false);
    const handleNext = async () => {
        setIsLoading(true);
        const uri = await compressUri()
        console.log(uri)
        const blob = await getBlobFroUri(uri);
        const success = await uploadBlob(blob);
        //console.log(success)
        if (success === true) {
            // Update firestore db to not use default pfp
            const docRef = doc(firestore, 'userInfo', auth.currentUser?.email.toLowerCase());
            await updateDoc(docRef, {
                defaultPfp: false
            })
            await setUserInfo((prevUser) => ({ ...prevUser, defaultPfp: false, }));
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            })
        }
        else {
            console.error('Error: failed to update profile image');
            setIsLoading(false);
        }
    }

    // Handle skip
    const handleSkip = async () => {
        setIsLoading(true);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        })
    }

    // pickImage Helper 0:
    // Check image size (must be less than 30mb or 30,000,000 bytes)
    const checkImageSize = async (uri) => {
        const fileInfo = await FileSystem.getInfoAsync(uri)
        return fileInfo.size
    }

    // pickImage Helper 1:
    // Compress image uri
    const compressUri = async () => {
        try {
            const result = await manipulateAsync(
                imageChosen,
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
        console.log(218391273893127)
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

    // Re-render on imageChosen
    useEffect(() => {
        //console.log(imageChosen)
    }, [imageChosen]);

    // -----------------------------------------------------------------------
    
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#5A8F7B'></ActivityIndicator>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                    <StatusBar style="auto" />
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>Last step!</Text>
                        <Text style={styles.subHeaderText}>Choose your profile picture</Text>
                    </View>
                    <View style={styles.profileImageContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            {imageChosen && (
                                <Image style={styles.profileImage} source={{ uri: imageChosen }}></Image>
                            )}
                            {!imageChosen && (
                                <Image style={styles.profileImage} source={require('./../.././assets/placeholderPFP.png')}></Image>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleNext} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainerOutline}>
                        <TouchableOpacity onPress={handleSkip} style={styles.button}>
                            <Text style={styles.buttonTextOutline}>Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default ChoosePfp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    textContainer: {
        marginTop: '50%',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 20,
        marginBottom: 5,
    },
    subHeaderText: {
        fontSize: 14,
    },
    profileImageContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginTop: 30,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 75,
    },
    buttonContainer: {
        marginHorizontal: 25,
        marginTop: 32.5,
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

})