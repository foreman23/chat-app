import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-navigation';
import Navigator from './routes/homeStack';
import { UserProvider } from './screens/Context/UserContext';
import { PairProvider } from './screens/Context/PairContext';

export default function App() {
  return (

    <UserProvider>
      <PairProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <View style={styles.contentContainer}>
              <Navigator />
            </View>
          </NavigationContainer>
        </SafeAreaView>
      </PairProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
