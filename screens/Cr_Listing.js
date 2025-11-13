import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";

import { colors, globalStyles } from '../components/GlobalStyle';
import { Filigree2, Filigree4 } from '../components/decorations/Filigree';
import { OrnateButton } from '../components/decorations/DecoButton';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { fetchAccountCreations, setSelectedCreation } from '../store/slices/accountSlice';

const CreateStoryHeader = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.creationHeader}>
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

            <TouchableOpacity style={styles.csh_button}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons name='arrow-back' color={colors.white} size={30} />
            </TouchableOpacity>

            <View style={styles.csh_textContainer}>
                <Text style={styles.csh_text}>
                    Sáng Tác Của Bạn
                </Text>
            </View>

            <TouchableOpacity style={styles.csh_button}>
                <Text style={[styles.csh_buttonText, { fontWeight: 'normal' }]}>
                    {/* Bỏ Qua */}
                </Text>
            </TouchableOpacity>

            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, globalStyles.bottomShadow, { bottom: -13, height: 13, opacity: 0.4 }]}
            />
        </View>
    )
}

const BookItem = ({ navigation, creation }) => {
    const dispatch = useDispatch();
    return (
        <TouchableOpacity style={styles.bi_container}
            onPress={() => {
                dispatch(setSelectedCreation(creation))
                navigation.navigate("Cr_Update")
            }}
        >
            <Filigree4
                customBottomPosition={-5}
                customLeftPosition={-35}
                customOpacity={0.1}
            />
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, globalStyles.topShadow, { opacity: 0.3, }]}
            />

            <View style={styles.bi_bookCover}
                onPress={() => {
                    navigation.navigate("BookDetail")
                }}
            >
                <Image source={{ uri: creation.cover }}
                    style={styles.bi_bookCoverImg}
                    resizeMode='cover'
                />
            </View>
            <View style={styles.bi_detailContainer}>
                <Text style={[styles.bi_bookTitle, { fontSize: 15, color: colors.white, letterSpacing: 0 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    Tiếp tục soạn
                </Text>

                <Text style={styles.bi_bookTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {creation.title}
                </Text>

                <View style={{ marginTop: 10 }}>
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
                        creation.lastUpdateDate != null &&
                        <View style={[styles.bi_row]}>
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
        </TouchableOpacity>
    )
}

const Cr_Listing = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { creationIdList, creationList, loading } = useSelector((state) => state.account);

    useEffect(() => {
        dispatch(fetchAccountCreations(creationIdList));
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <CreateStoryHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                {
                    loading ? null :
                        <View style={{ marginTop: 15, width: '100%', alignItems: 'center' }}>
                            {
                                creationList.length == 0
                                    ?
                                    <Text style={{ marginVertical: 15, color: colors.lightgray, fontStyle: 'italic' }}>
                                        Bạn chưa có tác phẩm nào...
                                    </Text>
                                    :
                                    creationList.map((creation) =>
                                        <BookItem navigation={navigation} creation={creation} key={creation.bookId} />
                                    )
                            }

                        </View>
                }

                <TouchableOpacity style={{ marginTop: 5 }}
                    onPress={() => {
                        navigation.navigate("Cr_Create_1")
                    }}
                >
                    <OrnateButton ButtonText={"Sáng Tác Truyện"} ButtonIcon={"edit-note"} />
                </TouchableOpacity>
                <Filigree2 customPosition={60} />
                <View style={globalStyles.bottomPadding} />
            </ScrollView >
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
    // CREATION HEADER

    creationHeader: {
        zIndex: 999999,

        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        paddingTop: 45,
        paddingBottom: 10,

        width: '100%',
        height: 'max-content',

        backgroundColor: colors.gray,
    },

    csh_button: {
        flex: 1,
        paddingHorizontal: 20
    },

    csh_buttonText: {
        textAlign: 'right',
        color: colors.white,
        fontWeight: "bold"
    },

    csh_textContainer: {
        flex: 4
    },

    csh_text: {
        textAlign: 'left',
        color: colors.white,
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1.2
    },

    pictureFrame: {
        width: 200,
        height: 300,
        margin: 20,

        borderColor: colors.lightgray,
        borderWidth: 1
    },

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

    ornateTextbox_2: {
        width: '100%',
        height: 180,
        marginVertical: 10,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.gray,
    },

    ornateTextbox_white: {
        width: '100%',
        height: 100,
        marginVertical: 10,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.white,
    },

    currentCreationContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    //-------------------------------------------------------//
    // BOOK ITEM

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
    bi_bookCover: {
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
    bi_bookCoverImg: {
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
    bi_bookTitle: {
        width: 190,
        flexWrap: 'wrap',
        color: colors.gold,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 20,

        marginVertical: 3,
    },
    bi_bookAuthor: {
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
    },
});

export default Cr_Listing;