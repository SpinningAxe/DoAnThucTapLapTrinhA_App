import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";

import { colors, globalStyles } from '../components/GlobalStyle';
import { Filigree2, Filigree4 } from '../components/decorations/Filigree';
import { OrnateButton } from '../components/decorations/DecoButton';

import ScreenTitle from '../components/ScreenTitle';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const CreationItem = ({ creation }) => {
    if (creation == null) return null;
    return (
        <View style={styles.bi_container}>
            <Filigree4
                customBottomPosition={-5}
                customLeftPosition={-35}
                customOpacity={0.1}
            />
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, globalStyles.topShadow, { opacity: 0.3, }]}
            />

            <View style={styles.bi_CreationCover}>
                <Image source={{ uri: creation.cover }}
                    style={styles.bi_CreationCoverImg}
                    resizeMode='cover'
                />
            </View>
            <View style={styles.bi_detailContainer}>
                <Text style={[styles.bi_CreationTitle,
                { fontSize: 15, color: colors.white, letterSpacing: 0 }
                ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    Tiếp tục soạn
                </Text>

                <Text style={styles.bi_CreationTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {creation.title}
                </Text>

                <View style={{ marginTop: 0 }}>
                    <View style={[styles.bi_row]}>
                        <Text style={{ color: colors.lightgray, width: 100 }}>
                            NGÀY ĐĂNG:
                        </Text>
                        <Text style={{ color: colors.white }}>
                            {creation.publishDate.split("/")[0]}
                            {" Thg" + creation.publishDate.split("/")[1]}
                            {", " + creation.publishDate.split("/")[2]}
                        </Text>
                    </View>
                    {
                        (creation.lastUpdateDate != null && creation.lastUpdateDate != creation.publishDate) &&
                        <View style={[styles.bi_row, { marginTop: 0 }]}>
                            <Text style={{ color: colors.lightgray, width: 100 }}>
                                CẬP NHẬT:
                            </Text>
                            <Text style={{ color: colors.white }}>
                                {creation.lastUpdateDate.split("/")[0]}
                                {" Thg" + creation.lastUpdateDate.split("/")[1]}
                                {", " + creation.lastUpdateDate.split("/")[2]}
                            </Text>
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}

const Cr_Home = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isLogin, selectedCreation, loading, uploading } = useSelector((state) => (state.account));

    if (loading) return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
                    <Text style={{ color: colors.white, letterSpacing: 2 }}>
                        Đang tải ...
                    </Text>
                </View>
            </ScrollView>
            <AppFooter currentScreen={2} />
        </View >
    );

    if (!isLogin) return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
                    <Text style={{ color: colors.white, letterSpacing: 2 }}>
                        Bạn cần đăng nhập để đăng truyện ...
                    </Text>
                </View>
            </ScrollView>
            <AppFooter currentScreen={2} />
        </View >
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <ScreenTitle title={"ĐĂNG TRUYỆN"} icon={"edit-note"} customIconPosition={-2} />
                {
                    selectedCreation != null &&
                    <TouchableOpacity style={styles.currentCreation}
                        onPress={() => {
                            navigation.navigate("Cr_Update")
                        }}
                    >
                        <CreationItem navigation={navigation}
                            creation={selectedCreation}
                        />
                    </TouchableOpacity>
                }

                <TouchableOpacity style={{ marginTop: 5 }}
                    onPress={() => {
                        navigation.navigate("Cr_Create_1")
                    }}
                >
                    <OrnateButton ButtonText={"Sáng Tác Truyện"} ButtonIcon={"edit-note"} />
                </TouchableOpacity>

                {
                    selectedCreation != null &&
                    <TouchableOpacity style={{ marginTop: 5 }}
                        onPress={() => {
                            navigation.navigate("Cr_Update")
                        }}
                    >
                        <OrnateButton ButtonText={"Sửa Truyện"} ButtonIcon={"edit-note"} />
                    </TouchableOpacity>
                }

                <TouchableOpacity style={{ marginTop: 5 }}
                    onPress={() => {
                        navigation.navigate("Cr_Listing")
                    }}
                >
                    <OrnateButton ButtonText={"Sáng Tác Của Bạn"} ButtonIcon={"list"} />
                </TouchableOpacity>

                <Filigree2 customPosition={-95} />
                {/* <View style={globalStyles.bottomPadding} /> */}
            </ScrollView>
            <AppFooter currentScreen={2} />
        </View >
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

    //-------------------------------------------------------//
    // ORNATE TEXTBOX

    ornateTextbox: {
        width: '100%',
        height: 450,
        marginVertical: 10,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.gray,
    },

    //-------------------------------------------------------//
    // ORNATE TEXTBOX

    currentCreation: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    //-------------------------------------------------------//
    // Creation ITEM

    bi_container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',

        width: 340,
        height: 170,
        //paddingHorizontal: 10,
        //marginHorizontal: 20,
        marginVertical: 4,

        borderRadius: 4,

        backgroundColor: colors.gray,

        borderColor: colors.gray,
        borderTopWidth: 2
    },
    bi_CreationCover: {
        height: 140,
        width: 90,
        marginLeft: 20,

        borderRadius: 4,

        backgroundColor: 'white',

        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    bi_CreationCoverImg: {
        height: '100%',
        width: '100%',

        borderRadius: 4
    },
    bi_detailContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',

        height: '100%',

        paddingVertical: 20,
        marginLeft: 15,
    },
    bi_CreationTitle: {
        width: 190,
        flexWrap: 'wrap',
        color: colors.gold,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 20,

        marginVertical: 3,
    },
    bi_CreationAuthor: {
        color: colors.white,
        fontWeight: 'light',
        fontStyle: 'italic',
        letterSpacing: 1,
        fontSize: 12,
    },
    bi_row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        width: '100%',
        marginTop: 10
    },
});

export default Cr_Home;