import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from 'react-redux';

import { colors, globalStyles } from './GlobalStyle';
import { searchBooks, setBookListingTitle, setSearchKeyword } from '../store/slices/bookSlice';
// import { Filigree6_Bottom, Filigree6_Top, Filigree7_Top, Filigree7_Bottom } from '../Decorations/Filigree';
// import { searchForBooks, viewBookType } from '../../slices/bookSlice';

// const SideTabRight = ({ setLeftIsVisible, setRightIsVisible }) => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     return (
//         <View style={styles.str_container}>
//             <View style={styles.str_menuContainer}>
//                 <Filigree6_Top />
//                 <Filigree6_Bottom />

//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate('MainScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="home" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Trang Chủ
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         dispatch(viewBookType("TRUYỆN TRANH"))
//                         navigation.navigate('BookListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="photo-library" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Truyện Tranh
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         dispatch(viewBookType("SÁCH CHỮ"))
//                         navigation.navigate('BookListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="library-books" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Sách Chữ
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate('GenreListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="list" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Thể Loại
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate('GenreListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="settings" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Cài Đặt
//                     </Text>
//                 </TouchableOpacity>

//                 {/* <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate('LibraryScreen')
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="account-balance" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Thư Viện
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate("CreateStoryScreen_Main")
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="create" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Đăng Truyện
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate("NotificationScreen")
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="notifications" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Thông Báo
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate("AccountScreen")
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="person" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Tài Khoản
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         // navigation.navigate("SettingScreen")
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="settings" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Cài Đặt
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate("LoginScreen")
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="person" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Đăng Nhập
//                     </Text>
//                 </TouchableOpacity> */}
//             </View>
//         </View>
//     )
// }

// const SideTabLeft = ({ setLeftIsVisible, setRightIsVisible }) => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     return (
//         <View style={styles.stl_container}>
//             <View style={styles.stl_menuContainer}>
//                 <Filigree7_Top />
//                 <Filigree7_Bottom />

//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate('MainScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="home" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Trang Chủ
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         dispatch(viewBookType("TRUYỆN TRANH"))
//                         navigation.navigate('BookListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="photo-library" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Truyện Tranh
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         dispatch(viewBookType("SÁCH CHỮ"))
//                         navigation.navigate('BookListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="library-books" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Sách Chữ
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.str_menuButton}
//                     onPress={() => {
//                         navigation.navigate('GenreListingScreen')
//                         setLeftIsVisible(false)
//                         setRightIsVisible(false)
//                     }}
//                 >
//                     <MaterialIcons name="list" color={colors.gold} size={20} />
//                     <Text style={styles.str_menuButtonText}>
//                         Thể Loại
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     )
// }

const AppHeader = ({ hideLine }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const [right_isVisible, setRightIsVisible] = useState(false);
    const [left_isVisible, setLeftIsVisible] = useState(false);

    const [text, onChangeText] = React.useState('');
    return (
        <View style={styles.container}>
            <View style={styles.h_container}>
                <LinearGradient
                    colors={[colors.gold, 'transparent']}
                    style={[globalStyles.shadow, globalStyles.bottomShadow, { bottom: -13, height: 13, opacity: 0.2 }]}
                />
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={[colors.black, 'transparent']}
                    style={[globalStyles.shadow, globalStyles.leftShadow, { height: 100 }]}
                />
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['transparent', colors.black]}
                    style={[globalStyles.shadow, globalStyles.rightShadow, { height: 100 }]}
                />
                <View style={styles.leftSideContainer}>
                    {/* <TouchableOpacity style={styles.button}
                        onPress={() => {
                            setLeftIsVisible(!left_isVisible)
                            setRightIsVisible(false)
                        }}
                    >
                        <MaterialIcons name="menu" color={colors.white} size={30} />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            navigation.navigate('BookHome')
                            setLeftIsVisible(false)
                            setRightIsVisible(false)
                        }}
                    >
                        <MaterialIcons name="home" color={colors.white} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { marginRight: 3 }]}>
                        <MaterialIcons name="search" color={colors.white} size={18} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Tìm Kiếm'
                        placeholderTextColor={colors.lightgray}
                        style={styles.textinput}
                        onChangeText={onChangeText}
                        value={text}
                        onSubmitEditing={() => {
                            dispatch(setBookListingTitle("Tìm kiếm"))
                            dispatch(setSearchKeyword(text))
                            dispatch(searchBooks(text))
                            navigation.navigate('BookListing')
                        }}
                    />
                </View>

                <View style={styles.rightSideContainer}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            setLeftIsVisible(false)
                            setRightIsVisible(!right_isVisible)
                        }}
                    >
                        <MaterialIcons name="menu" color={colors.white} size={30} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.button}
                        onPress={() => {
                            setLeftIsVisible(false)
                            setRightIsVisible(!right_isVisible)
                        }}
                    >
                        <MaterialIcons name="person" color={colors.white} size={30} />
                    </TouchableOpacity> */}
                </View>
            </View>

            <View style={styles.sideTabContainer}>
                {(right_isVisible || left_isVisible) && (
                    <Pressable style={styles.sideTabBackground}
                        onPress={() => {
                            setLeftIsVisible(false)
                            setRightIsVisible(false)
                        }}
                    />
                )}
                {right_isVisible && (<SideTabRight
                    setLeftIsVisible={setLeftIsVisible}
                    setRightIsVisible={setRightIsVisible}
                />)}
                {left_isVisible && (<SideTabLeft
                    setLeftIsVisible={setLeftIsVisible}
                    setRightIsVisible={setRightIsVisible}
                />)}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    //-------------------------------------------------------//

    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },

    //-------------------------------------------------------//

    h_container: {
        zIndex: 999999,

        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        paddingTop: 45,
        paddingBottom: 10,

        width: '100%',
        height: 'max-content',

        backgroundColor: colors.gray,
        borderColor: colors.gold,
        borderBottomWidth: 3,
    },
    leftSideContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        marginLeft: 25,
    },
    rightSideContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        marginRight: 25,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',

        marginHorizontal: 7,
    },
    textinput: {
        margin: 0,
        padding: 0,

        color: colors.white,

        width: 170,
    },
    line: {
        position: 'absolute',
        bottom: -10,
        zIndex: 99,

        height: 2,
        width: '100%',

        backgroundColor: colors.gray
    },

    //-------------------------------------------------------//

    sideTabContainer: {
        zIndex: 9999,
        position: 'absolute',
        top: 85,

        width: '100%',
        height: '100%',

    },
    sideTabBackground: {
        width: '100%',
        height: 1000,

        opacity: 0.8,

        backgroundColor: colors.black
    },
    str_container: {
        zIndex: 99999,
        position: 'absolute',
        top: 0,
        right: 0,

        height: 1000,
        width: '70%',

        opacity: 1,

        backgroundColor: colors.black,
        // borderColor: colors.lightgray,
        // borderLeftWidth: 1
    },
    stl_container: {
        zIndex: 99999,
        position: 'absolute',
        top: 0,
        left: 0,

        height: 1000,
        width: '70%',

        opacity: 1,

        backgroundColor: colors.black,
        // borderColor: colors.lightgray,
        // borderRightWidth: 1
    },

    str_menuContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',
        marginTop: 10,
        paddingTop: 50,
        paddingBottom: 60,
    },
    stl_menuContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',
        marginTop: 20,
        paddingTop: 40,
        paddingBottom: 60,
    },

    str_menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '90%',
        marginVertical: 4,
        paddingVertical: 10,
        paddingHorizontal: 10,

        borderRadius: 4,

        borderColor: colors.lightgray,
        borderLeftWidth: 5,
        backgroundColor: colors.gray
    },
    str_menuButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1.5,

        marginLeft: 10,
    },

    shadow: {
        position: 'absolute',
    },
    topShadow: {
        height: 70,
        width: '100%',
        top: 0,
        left: 0,
    },
    bottomShadow: {
        height: 150,
        width: '100%',
        bottom: 0,
        left: 0,
    },
});

export default AppHeader;