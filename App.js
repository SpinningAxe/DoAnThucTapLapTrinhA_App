import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookHome from './screens/BookHome';
import BookDetail from './screens/BookDetail';
import BookPage from './screens/BookPage';
import BookListing from './screens/BookListing';
import Cr_Home from './screens/Cr_Home';
import Cr_Create_1 from './screens/Cr_Create_1';
import Cr_Create_2 from './screens/Cr_Create_2';
import Cr_Create_3 from './screens/Cr_Create_3';
import Cr_Create_Chapter from './screens/Cr_Create_Chapter';
import Cr_Update from './screens/Cr_Update';
import Cr_Update_Field from './screens/Cr_Update_Field';
import Cr_Update_Chapter from './screens/Cr_Update_Chapter';
import Cr_Listing from './screens/Cr_Listing';
import Account from './screens/Account';
import AccountUpdate from './screens/AccountUpdate';
import Notification from './screens/Notification';
import Library from './screens/Library';
import LibraryListing from './screens/LibraryListing';
import Login from './screens/Login';
import GenreListing from './screens/GenreListing';
import TEMP_Login from './screens/TEMP_Login';
import AdminAccount from './screens/AdminAccount';
import AdminHome from './screens/AdminHome';
import AdminAnalysis from './screens/AdminAnalysis';
import AdminLibraryManagement from './screens/AdminLibraryManagement';
import AdminEditBook from './screens/AdminEditBook';
import SearchResultListing from './screens/SearchResultsListing'

import { Provider } from 'react-redux';
import { store } from './store';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="BookHome" component={BookHome} />
          <Stack.Screen name="BookDetail" component={BookDetail} />
          <Stack.Screen name="BookPage" component={BookPage} />
          <Stack.Screen name="BookListing" component={BookListing} />
          <Stack.Screen name="Cr_Home" component={Cr_Home} />
          <Stack.Screen name="Cr_Create_1" component={Cr_Create_1} />
          <Stack.Screen name="Cr_Create_2" component={Cr_Create_2} />
          <Stack.Screen name="Cr_Create_3" component={Cr_Create_3} />
          <Stack.Screen name="Cr_Create_Chapter" component={Cr_Create_Chapter} />
          <Stack.Screen name="Cr_Update" component={Cr_Update} />
          <Stack.Screen name="Cr_Update_Field" component={Cr_Update_Field} />
          <Stack.Screen name="Cr_Update_Chapter" component={Cr_Update_Chapter} />
          <Stack.Screen name="Cr_Listing" component={Cr_Listing} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="AccountUpdate" component={AccountUpdate} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Library" component={Library} />
          <Stack.Screen name="LibraryListing" component={LibraryListing} />
          <Stack.Screen name="GenreListing" component={GenreListing} />
          
          
          <Stack.Screen name="TEMP_Login" component={TEMP_Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
