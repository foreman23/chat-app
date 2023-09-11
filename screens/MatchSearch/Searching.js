import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
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

    const [initialCallback, setInitialCallback] = useState(true);
    useEffect(() => {
        // Set dt to the number of seconds since January 1, 1970 UTC
        dt = Math.floor(Date.now() / 1000);
        const unsubscribe = onSnapshot(
            doc(firestore, 'userInfo', auth.currentUser.uid, 'pairing', 'matches'),
            (doc) => {
                console.log(`${auth.currentUser.uid} TRIGGERED SNAPSHOT`);
                if (doc.data().pairArr.length > 0) {
                    console.log(dt);
                    let matchDt = doc.data().pairArr[doc.data().pairArr.length - 1].timestamp // convert to seconds
                    // Compare timestamp of match found to current time (must be matched in last 20 seconds)
                    console.log(matchDt.seconds - dt);
                    if (matchDt.seconds - dt < 20 && matchDt.seconds - dt >= 0) {
                        console.log(`New pair added:`);
                        setPairInfo({
                            chatID: doc.data().pairArr[doc.data().pairArr.length - 1].pairID,
                        });
                        navigation.replace('MatchFound')
                    }
                }
            }
        );

        return () => {
            // Unsubscribe from the listener when the component unmounts
            unsubscribe();
        };
    }, []);

    // Trigger 'matching' function from API
    const triggerMatch = () => {
        try {
            fetch(
                //   'https://foreman23.pythonanywhere.com/match',
                'http://10.0.2.2:5000/match'
            );
            return;
        } catch (error) {
            console.error(error);
        }
    }

    // Function to trigger match and then schedule it to run again after 10 seconds
    const triggerMatchWithDelay = () => {
        console.log('TRIGGERING MATCH (CALLING API!!)')
        setTimeout(triggerMatch, 5000);
        setTimeout(triggerMatch, 5000);
        setTimeout(triggerMatch, 15000);
        setTimeout(() => {
            console.log('MATCH NOT FOUND! EXIT');
          }, 30000);
    };


    // On page load run these functions
    useEffect(() => {
        triggerMatchWithDelay();
    }, [])

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