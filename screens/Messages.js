import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef } from 'react'

import ScreenHeader from '../components/ScreenHeader';

export default function Messages({ navigation }) {

  // PLACEHOLDER MESSAGE DATA (DELETE LATER)
  const messageData = [
    { id: '1', name: 'Becky Joe', message: 'Hi, when can we meet?', status: 'Delivered', hoursSince: 2, hoursLeft: null },
    { id: '2', name: 'John Doe', message: 'Sure, let\'s meet tomorrow!', status: 'Sent', hoursSince: 0, hoursLeft: 24 },
    { id: '3', name: 'Emily Smith', message: 'I\'m sorry, I can\'t make it.', status: 'Read', hoursSince: 5, hoursLeft: null },
    { id: '4', name: 'Alex Johnson', message: 'Hey, do you have the project files?', status: 'Delivered', hoursSince: 12, hoursLeft: null },
    { id: '5', name: 'Sarah Thompson', message: 'Can you please call me back?', status: 'Sent', hoursSince: 0, hoursLeft: 48 },
    { id: '6', name: 'Michael Brown', message: 'Let\'s grab lunch next week.', status: 'Delivered', hoursSince: 1, hoursLeft: null },
    { id: '7', name: 'Emma Davis', message: 'Have you seen the latest episode? It was really great.', status: 'Read', hoursSince: 3, hoursLeft: null },
    { id: '8', name: 'David Wilson', message: 'I need your help with the presentation. Please respond when you can.', status: 'Sent', hoursSince: 0, hoursLeft: 12 },
    { id: '9', name: 'Olivia Martin', message: 'Happy birthday! Let\'s celebrate.', status: 'Delivered', hoursSince: 24, hoursLeft: null },
  ];

  // Open keyboard for search
  const textInputRef = useRef(null);
  const handleSearchPress = () => {
    textInputRef.current.focus();
  };

  // Go to messenger from message click
  const handleClick = (item) => {
    navigation.push('Messenger', { prop: item });
  }

  // Render message group
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleClick(item)} style={styles.messageGroup}>
        <View style={{ flex: 1 }}>
          <Image style={styles.profileImage} source={require('../assets/placeholderPFP.png')}></Image>
        </View>

        {/* Message Content */}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0, flex: 3, marginLeft: 5 }}>
          <Text style={{ color: '#5A8F7B', fontSize: 14, fontWeight: '600' }}>{item.name}</Text>
          <Text style={{ color: '#323232', fontSize: 12, }} numberOfLines={2} ellipsizeMode='tail'>{item.message}</Text>
        </View>

        <View style={{ flexDirection: 'column', borderWidth: 0, flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingRight: 5 }}>{item.status}</Text>
          <Icon size={4} style={{ marginVertical: 5 }} name='ellipse-sharp' color='#5A8F7B'></Icon>
          <Text style={{ color: '#5A8F7B', fontSize: 10, fontWeight: '400', paddingLeft: 5 }}>{item.hoursSince} hr</Text>
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScreenHeader navigation={navigation} title='Messages'></ScreenHeader>

      <Pressable style={styles.searchContainer} onPress={handleSearchPress}>
        <View>
          <TextInput
            style={styles.searchBox}
            placeholder='Search'
            keyboardType='web-search'
            ref={textInputRef}
          />
        </View>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} underlayColor='transparent'>
          <View>
            <Icon name="search" size={20} color="#5A8F7B" />
          </View>
        </TouchableOpacity>

      </Pressable>

      <View style={styles.messageList}>
        <FlatList
          data={messageData}
          renderItem={renderItem}
          key={'+'}
          keyExtractor={(item) => "+" + item.id}
        >
        </FlatList>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderColor: '#5A8F7B',
    borderWidth: 1.5,
    borderRadius: 30,
  },
  messageGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
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
  searchBox: {
    textAlign: 'center',
    color: '#323232',
  },
  messageList: {
    flex: 1,
  },
})