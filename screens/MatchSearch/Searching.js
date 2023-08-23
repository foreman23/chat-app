import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { doc, arrayRemove, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import BackButton from '../../components/BackButton';
import { PairContext } from '../Context/PairContext';

const Searching = ({ navigation }) => {

    // Grab pair context
    const {resetPair, pairInfo, setPairInfo} = useContext(PairContext);

    // Cancel a match request and remove user from match pool
    const handleCancel = async () => {
        if (auth.currentUser) {
            try {
                const docRef = doc(firestore, 'pairing_system', 'waiting');
                await updateDoc(docRef, {
                    uidArr: arrayRemove(auth.currentUser.uid),
                });
                console.log('DELETED from firestore')
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main'}],
                })
            } catch (error) {
                console.error('Error removing UID from match pool', error);
            }
        }
    }

    let initialCallback = true;
    const onMatchFound = onSnapshot(doc(firestore, 'userInfo', auth.currentUser.email, 'pairing', 'matches'), (doc) => {
        if (initialCallback) {
            initialCallback = false;
            return;
        }
        else {
            console.log(doc.data())
            setPairInfo({
                chatID: doc.data().pairArr[doc.data().pairArr.length - 1],
            });
            console.log(`pair info: ${pairInfo}`)
            navigation.replace('MatchFound');
        } 
    });

    // On page load run these functions
    // useEffect(() => {
    //     getMatchPool();
    // })

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {/* <BackButton navigation={navigation}></BackButton> */}
            <View style={{ paddingTop: '50%' }}>
                <ActivityIndicator color={'#5A8F7B'} size={'large'}></ActivityIndicator>
                <Text style={styles.textText}>Finding match...</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleCancel} style={styles.button}>
                        <Text style={styles.buttonText}>Cancel Search</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Notify on match</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Searching

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    buttonContainer: {
        marginHorizontal: 25,
        marginTop: 10,
        borderRadius: 12.5,
        backgroundColor: '#5A8F7B',
    },
    textText: {
        marginVertical: 15,
        marginLeft: 0,
        fontSize: 20,
        textAlign: 'center',
    },
})