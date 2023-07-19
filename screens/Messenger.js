import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef } from 'react'

export default function Messenger({ navigation, route }) {

    const prop = route.params?.prop;

    handleBack = () => {
        navigation.goBack();
    }

    // Open keyboard for search
    const textInputRef = useRef(null);
    const handleSearchPress = () => {
        textInputRef.current.focus();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.headerBar}>
                <View style={{ borderWidth: 0, flex: 1, justifyContent: 'center', marginRight: 10 }}>
                    <TouchableOpacity onPress={handleBack}>
                        <Icon size={30} color={'#323232'} name='chevron-back'></Icon>
                    </TouchableOpacity>
                </View>

                <View style={{ borderWidth: 0, flex: 1 }}>
                    <Image style={styles.profileImage} source={require('../assets/placeholderPFP.png')}></Image>
                </View>

                <View style={{ borderWidth: 0, flex: 4, justifyContent: 'center', marginLeft: 20 }}>
                    <Text style={{ color: '#5A8F7B', fontWeight: '600' }}>{prop.name}</Text>
                </View>
                <View style={{ borderWidth: 0, flex: 1, justifyContent: 'center', marginTop: 3 }}>
                    <Icon size={20} color={'#323232'} name='ellipsis-vertical-sharp'></Icon>
                </View>
            </View>

            {/* PLACEHOLDER DUMMY MESSAGES */}
            <ScrollView>
                <Text style={styles.receivedMessages}>Hey there! I couldn't help but notice your profile, and I must say, you seem quite interesting. Mind if we chat?</Text>
                <Text style={styles.sentMessages}>Hi! Thanks for reaching out. I'm glad you found my profile intriguing. I'd love to chat and get to know you better. So, tell me, what caught your attention?</Text>
                <Text style={styles.receivedMessages}>Well, besides your beautiful smile, I noticed we share a love for adventure. Your hiking and travel pictures really caught my eye. Have you been on any exciting trips lately?</Text>
                <Text style={styles.sentMessages}>Thank you for the kind words! I'm thrilled you share my passion for adventure. As for recent trips, I actually just returned from a hiking expedition in the Swiss Alps. The breathtaking landscapes and fresh mountain air were absolutely incredible. How about you? Any exciting journeys or outdoor experiences you'd like to share?</Text>
                <Text style={styles.receivedMessages}>Hey there! I couldn't help but notice your profile, and I must say, you seem quite interesting. Mind if we chat?</Text>
                <Text style={styles.receivedMessages}>Hey there! I couldn't help but notice your profile, and I must say, you seem quite interesting. Mind if we chat?</Text>
                <Text style={styles.sentMessages}>Thank you for the kind words! I'm thrilled you share my passion for adventure. As for recent trips, I actually just returned from a hiking expedition in the Swiss Alps. The breathtaking landscapes and fresh mountain air were absolutely incredible. How about you? Any exciting journeys or outdoor experiences you'd like to share?</Text>

            </ScrollView>

            {/* Keyboard input */}
            <Pressable style={styles.searchContainer} onPress={handleSearchPress}>
                <View>
                    <TextInput
                        style={styles.searchBox}
                        placeholder='Type Here'
                        keyboardType='web-search'
                        ref={textInputRef}
                    />
                </View>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} underlayColor='transparent'>
                    <View>
                        <Icon name="paper-plane" size={20} color="#5A8F7B" />
                    </View>
                </TouchableOpacity>

            </Pressable>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    sentMessages: {
        backgroundColor: '#5A8F7B',
        color: '#FFFFFF',
        padding: 10,
        paddingHorizontal: 15,
        margin: 10,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        fontWeight: 300,
        width: 300,
        fontSize: 14,
        alignSelf: 'flex-end',
        lineHeight: 20,
    },
    receivedMessages: {
        borderColor: '#D2D2D2',
        borderWidth: 1,
        color: '#252525',
        padding: 10,
        paddingHorizontal: 15,
        margin: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        fontWeight: 300,
        width: 300,
        fontSize: 14,
        alignSelf: 'flex-start',
        lineHeight: 20,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderColor: '#e0dede'
    },
    profileImage: {
        width: 55,
        height: 55,
        borderColor: '#5A8F7B',
        borderWidth: 1.5,
        borderRadius: 30,
    },
    searchContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 32.5,
        marginTop: 10,
        marginBottom: 25,
        justifyContent: 'space-between',
    },
})