import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from '../store/slices/accountSlice';

import { colors, globalStyles } from '../components/GlobalStyle';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { Filigree9, Filigree5_Bottom } from '../components/decorations/Filigree';
import { OrnateButton } from '../components/decorations/DecoButton';
import ScreenTitle from '../components/ScreenTitle';

const AdminAccount = () => {
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Navigate to Login when user is null (after logout)
    useEffect(() => {
        if (!user) {
            navigation.replace('Login');
        }
    }, [user, navigation]);

    // Early return if user is null (after logout)
    if (!user) {
        return null;
    }

    const handleLogout = async () => {
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
                    onPress: async () => {
                        try {
                            await dispatch(logoutUser()).unwrap();
                            navigation.replace('Login');
                        } catch (error) {
                            console.error("Logout error:", error);
                            // Still navigate to Login even if there's an error
                            navigation.replace('Login');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <ScreenTitle title={"ADMIN"} icon={"person"} />

                <View style={{ width: '100%', height: 400, zIndex: -1 }}>
                    <Filigree9 />
                </View>

                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://www.cnet.com/a/img/resize/e58477ebf3a1bb812b68953ea2bf6c5cdc93e825/hub/2019/07/08/631653cd-fb27-476a-bb76-1e8f8b70b87e/troller-t4-trail-1.jpg?auto=webp&width=1200' }}
                            style={styles.avatar}
                        />
                    </View>
                </View>

                {/* Username Box */}
                <View style={styles.ornateTextbox_white}>
                    <View>
                        <Text style={styles.username}>
                            {(user?.username || "Alt Schwift X").toUpperCase()}
                        </Text>
                        <Text style={styles.userSubtitle}>
                            {user?.fullName || "Đoàn Thị Nguyên Sa"}
                        </Text>
                    </View>
                    <Filigree5_Bottom />
                    <LinearGradient 
                        colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, globalStyles.topShadow, { opacity: 0.3 }]}
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AccountUpdate')}
                    >
                        <OrnateButton
                            ButtonText={"Sửa Thông Tin Tài Khoản"}
                            ButtonIcon={"add"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('AdminHome')}
                    >
                        <OrnateButton
                            ButtonText={"Quản lý"}
                            ButtonIcon={"add"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout}>
                        <OrnateButton
                            ButtonText={"Đăng Xuất"}
                            ButtonIcon={"add"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Decorative Element */}
                <View style={styles.decorativeWrapper}>
                    <Filigree9 />
                </View>

                <View style={globalStyles.bottomPadding} />
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
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },

    avatarWrapper: {
        alignItems: 'center',
        marginTop: -400,
        marginBottom: -15,
    },

    avatarContainer: {
        // Container for avatar (same as AccountScreen)
    },
    avatar: {
        width: 135,        // tăng kích thước
        height: 135,       // tăng kích thước
        borderRadius: 70,  // bán kính = 1/2 để giữ hình tròn
        borderWidth: 2,
        borderColor: '#FFD700',
        backgroundColor: '#000',
        resizeMode: 'cover',
    },

    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },

    userSubtitle: {
        fontSize: 14,
        color: '#555',
        marginTop: 3,
    },

    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: -10,
        marginBottom: 60,
        position: 'relative',
        zIndex: 10,
    },

    decorativeWrapper: {
        width: '100%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        transform: [{ scaleY: -1 }],
    },
});

export default AdminAccount;

