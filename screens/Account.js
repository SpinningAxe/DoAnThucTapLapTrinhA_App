import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";

// import { logoutUser } from '../slices/accountSlice';

import { fetchAccountCreations } from '../store/slices/accountSlice';

import { Filigree9, Filigree5_Bottom } from '../components/decorations/Filigree';
import { OrnateButton, OrnateButtonRed } from '../components/decorations/DecoButton';

import { colors, globalStyles } from '../components/GlobalStyle';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import ScreenTitle from '../components/ScreenTitle';
import { CreationList } from '../components/BookList';

const Account = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const { user, creationList, creationIdList, loading } = useSelector((state) => state.account);

    useEffect(() => {
        if (creationIdList.length != 0) {
            dispatch(fetchAccountCreations(creationIdList));
        }
    }, [creationIdList]);

    if (loading) return null;

    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: () => {
                        dispatch(logoutUser());
                        navigation.navigate('LoginScreen');
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <ScreenTitle title={"TÀI KHOẢN"} icon={"person"} />

                <View style={{ width: '100%', height: 400, zIndex: -1 }}>
                    <Filigree9 />
                </View>

                {/* avt */}
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: user?.avatar || 'https://www.cnet.com/a/img/resize/e58477ebf3a1bb812b68953ea2bf6c5cdc93e825/hub/2019/07/08/631653cd-fb27-476a-bb76-1e8f8b70b87e/troller-t4-trail-1.jpg?auto=webp&width=1200'
                            }}
                            style={styles.avatar}
                        />
                    </View>
                </View>

                <View style={styles.ornateTextbox_white}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.username}>{user.username}</Text>
                        <Text style={styles.userSubtitle}>{user.realname}</Text>
                    </View>
                    <Filigree5_Bottom />
                    <LinearGradient colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, globalStyles.topShadow, { opacity: 0.3, }]}
                    />
                </View>

                <CreationList data={creationList} />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AccountUpdate')}
                    >
                        <OrnateButton
                            ButtonText={"Cài đặt"}
                            ButtonIcon={"settings"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout}>
                        <OrnateButtonRed
                            ButtonText={"Đăng Xuất"}
                            ButtonIcon={"person"}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <AppFooter currentScreen={4} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.black,
    },

    ornateTextbox_white: {
        zIndex: 999,

        width: '100%',
        height: 100,
        marginVertical: 10,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.white,

        // canh chỉnh tên hiển thị
        alignSelf: 'center',
        alignItems: 'center',
        // paddingVertical: 10,
    },


    // phần bổ sung

    avatarWrapper: {
        alignItems: 'center',
        marginTop: -400, // cách 5px so với "TÀI KHOẢN"
        marginBottom: -15, // cách 5px với phần text box trắng
    },

    avatar: {
        width: 135,        // tăng kích thước
        height: 135,       // tăng kích thước
        borderRadius: 70,  // bán kính = 1/2 để giữ hình tròn
        borderWidth: 4,
        borderColor: colors.gold,
        backgroundColor: '#000',
        resizeMode: 'cover',
    },

    iconWrapper: {
        paddingLeft: 10,
    },

    edit: {
        width: 15,
        height: 15,
    },

    username: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
    },

    userSubtitle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 3,
    },

    bookListWrapper: {
        position: 'relative',
        zIndex: 5,
    },

    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: -10,
        marginBottom: 60, // chừa khoảng phía footer
        position: 'relative',
        zIndex: 10, // đảm bảo hiển thị trên nền và trước footer
    },

    optionButton: {
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',

        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.white,

        backgroundColor: 'transparent',
        marginVertical: 4,
    },

    optionText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '500',
    },

    // User info styles
    userInfoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        zIndex: 10,
    },
    userName: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    userEmail: {
        color: colors.lightgray,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Account;