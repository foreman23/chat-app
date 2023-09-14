import { StyleSheet, Text, View, Pressable, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

import React from 'react'
import { useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

const SearchInput = () => {

    // Open keyboard for search
    const textInputRef = useRef(null);
    const handleSearchPress = () => {
        textInputRef.current.focus();
        console.log(textInputRef)
    };

    return (
        <View>
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
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
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
        textAlign: 'left',
        color: '#323232',
      },


})