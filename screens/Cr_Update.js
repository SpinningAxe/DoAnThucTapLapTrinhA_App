import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";

import { fetchChaptersOfSelectedCreation, setFieldToUpdate, setChapterToUpdate, deleteBookAndChapters, setSelectedCreation, fetchCreationById } from '../store/slices/accountSlice';

import { colors, globalStyles, bookCover } from '../components/GlobalStyle';
import { Filigree2, Filigree4, Filigree5_Bottom } from '../components/decorations/Filigree';
import { OrnateButton, OrnateButtonRed } from '../components/decorations/DecoButton';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CreateStoryHeader = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.creationHeader}>
            {/* <LinearGradient
                colors={[colors.gold, 'transparent']}
                style={[globalStyles.shadow, globalStyles.bottomShadow, { bottom: -13, height: 13, opacity: 0.2 }]}
            /> */}
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

            <TouchableOpacity style={styles.ch_button}
                onPress={() => navigation.navigate("Cr_Home")}
            >
                <MaterialIcons name='arrow-back' color={colors.white} size={30} />
            </TouchableOpacity>

            <View style={styles.ch_textContainer}>
                <Text style={styles.ch_text}>
                    Sửa Truyện
                </Text>
            </View>

            <TouchableOpacity style={styles.ch_button}>
                <Text style={[styles.ch_buttonText, { fontWeight: 'normal' }]}>
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
const GenreComponent = ({ genre }) => {
    return (
        <View style={styles.genreComponent}>
            <Text style={styles.gc_text}>
                {genre}
            </Text>
        </View>
    )
}

const ChapterComponent = ({ navigation, chapter }) => {
    const dispatch = useDispatch();
    return (
        <TouchableOpacity style={styles.ornateTextbox_white}
            onPress={() => {
                dispatch(setChapterToUpdate(chapter))
                navigation.navigate("Cr_Update_Chapter")
            }}
        >
            <View>
                <View style={styles.otw_textRow}>
                    <Text style={styles.otw_title} numberOfLines={1}>
                        Chương {chapter.chapterNum}
                        {chapter.chapterTitle != '' && ": "}
                        {chapter.chapterTitle}
                    </Text>
                    <MaterialIcons name='border-color' size={18} color={colors.gray} />
                </View>
                <View style={styles.otw_textRow}>
                    {
                        chapter.lastUpdateDate != null ?
                            <Text style={[styles.otw_subtitle, { marginLeft: 10 }]}>
                                Cập nhật:
                                {" " + chapter.lastUpdateDate.split("/")[0]}
                                {" Thg" + chapter.lastUpdateDate.split("/")[1]}
                                {", " + chapter.lastUpdateDate.split("/")[2]}
                            </Text>
                            :
                            <Text style={[styles.otw_subtitle, { marginLeft: 10 }]}>
                                Ngày đăng:
                                {" " + chapter.createdDate.split("/")[0]}
                                {" Thg" + chapter.createdDate.split("/")[1]}
                                {", " + chapter.createdDate.split("/")[2]}
                            </Text>
                    }
                </View>
            </View>
            <Filigree5_Bottom />
            <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'transparent']}
                style={[globalStyles.shadow, globalStyles.topShadow]}
            />
        </TouchableOpacity>
    )
}

const Cr_Update = () => {
    const navigation = useNavigation();
    const { selectedCreation, chaptersOfSelectedCreation, loading } = useSelector((state) => state.account);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCreationById(selectedCreation.bookId));
        dispatch(fetchChaptersOfSelectedCreation(selectedCreation.bookId));
    }, [dispatch]);

    const handleDeleteBook = (bookId) => {
        dispatch(deleteBookAndChapters(bookId));
    };

    if (loading) return null;

    const bookId = selectedCreation?.bookId || null;
    const progressStatus = selectedCreation?.progressStatus || null;
    const cover = selectedCreation?.cover || null;
    const title = selectedCreation?.title || null;
    const series = selectedCreation?.series || null;
    const genreList = selectedCreation?.genreList || null;
    const description = selectedCreation?.description || null;
    const bookNum = selectedCreation?.bookNum || null;
    const language = selectedCreation?.language || null;
    const translator = selectedCreation?.translator || null;

    return (
        <View style={styles.container}>
            <CreateStoryHeader />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <TouchableOpacity style={{ paddingVertical: 20, alignItems: 'center' }}
                    onPress={() => {
                        dispatch(setFieldToUpdate("progressStatus"))
                        navigation.navigate("Cr_Update_Field")
                    }}
                >
                    <Text style={styles.title}>
                        Trạng Thái:{" "}
                        <Text style={progressStatus == "hoàn tất" ? { color: colors.green }
                            : progressStatus == "đang cập nhật" ? { color: colors.yellow }
                                : { color: colors.red }}
                        >
                            {progressStatus.toUpperCase()}
                        </Text>
                    </Text>
                    <Filigree2 customPosition={-70} />
                </TouchableOpacity>

                <View style={[styles.ornateTextbox_2, { marginTop: 10 }]}>
                    <Filigree4 customBottomPosition={0} customOpacity={0.12} />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, globalStyles.leftShadow]}
                    />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['transparent', colors.black]}
                        style={[globalStyles.shadow, globalStyles.rightShadow]}
                    />

                    <TouchableOpacity style={styles.ot2_container}
                        onPress={() => {
                            dispatch(setFieldToUpdate("cover"))
                            navigation.navigate("Cr_Update_Field")
                        }}
                    >
                        <View style={styles.ot_pictureFrame}>
                            <Image source={{ uri: cover }}
                                style={styles.ot_coverImage}
                            />
                            {/* <MaterialIcons name="add" size={30} color={colors.white} /> */}
                        </View>

                        <Text style={styles.ot_text}>
                            Sửa Ảnh Bìa
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ornateTextbox}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, globalStyles.leftShadow]}
                    />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['transparent', colors.black]}
                        style={[globalStyles.shadow, globalStyles.rightShadow]}
                    />
                    <Filigree5_Bottom customColor={colors.lightgray} />

                    <View style={styles.ot_container}>
                        <TouchableOpacity style={styles.ot_fieldContainer}
                            onPress={() => {
                                dispatch(setFieldToUpdate("title"))
                                navigation.navigate("Cr_Update_Field")
                            }}
                        >
                            <Text style={[styles.ot_textInputLabel,
                            (title == null || title == '') && { color: colors.gray }
                            ]}>
                                Tựa Đề
                            </Text>
                            <TextInput style={styles.ot_textInput}
                                placeholder='Tựa Đề'
                                placeholderTextColor={colors.lightgray}
                                value={title}
                                editable={false}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row' }}
                            onPress={() => {
                                dispatch(setFieldToUpdate("series"))
                                navigation.navigate("Cr_Update_Field")
                            }}
                        >
                            <View style={[styles.ot_fieldContainer, { width: '72%' }]}>
                                <Text style={[styles.ot_textInputLabel,
                                (series == null || series == '') && { color: colors.gray }
                                ]}>
                                    Series
                                </Text>
                                <TextInput style={styles.ot_textInput}
                                    placeholder='Series'
                                    placeholderTextColor={colors.lightgray}
                                    value={series}
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.ot_fieldContainer, { width: '25%', marginLeft: '3%', }]}>
                                <Text style={[styles.ot_textInputLabel,
                                (bookNum == null || bookNum == '') && { color: colors.gray }
                                ]}>
                                    Thứ Tự
                                </Text>
                                <TextInput style={styles.ot_textInput}
                                    placeholder='Thứ Tự'
                                    placeholderTextColor={colors.lightgray}
                                    value={bookNum}
                                    keyboardType="numeric"
                                    editable={false}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ot_fieldContainer}
                            onPress={() => {
                                dispatch(setFieldToUpdate("description"))
                                navigation.navigate("Cr_Update_Field")
                            }}
                        >
                            <Text style={[styles.ot_textInputLabel,
                            (description == null || description == '') && { color: colors.gray }
                            ]}>
                                Mô Tả
                            </Text>
                            <TextInput style={styles.ot_textInput}
                                placeholder='Mô Tả'
                                placeholderTextColor={colors.lightgray}
                                multiline={true}
                                textAlignVertical="top"
                                value={description}
                                editable={false}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.ornateTextbox}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, globalStyles.leftShadow]}
                    />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['transparent', colors.black]}
                        style={[globalStyles.shadow, globalStyles.rightShadow]}
                    />
                    <Filigree5_Bottom customColor={colors.lightgray} />
                    <View style={styles.ot_container}>
                        <TouchableOpacity style={[styles.ot_fieldContainer,
                        { marginTop: 20 }
                        ]}
                            onPress={() => {
                                dispatch(setFieldToUpdate("language"))
                                navigation.navigate("Cr_Update_Field")
                            }}>
                            <Text style={styles.ot_textInputLabel}>
                                {language != null && 'Ngôn Ngữ'}
                            </Text>
                            <View style={styles.ot_textInput}>
                                {
                                    language != null ?
                                        <Text style={{ color: colors.white, marginVertical: 2 }}>
                                            {language}
                                        </Text>
                                        :
                                        <Text style={{ color: colors.lightgray, marginVertical: 2 }}>
                                            Ngôn Ngữ
                                        </Text>
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.ot_fieldContainer]}
                            onPress={() => {
                                dispatch(setFieldToUpdate("translator"))
                                navigation.navigate("Cr_Update_Field")
                            }}
                        >
                            <Text style={[styles.ot_textInputLabel,
                            (translator == null || translator == '') && { color: colors.gray }
                            ]}>
                                Dịch Giả
                            </Text>
                            <TextInput style={styles.ot_textInput}
                                placeholder='Dịch Giả (Nếu Có)'
                                placeholderTextColor={colors.lightgray}
                                value={translator}
                                editable={false}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.ornateTextbox}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, globalStyles.leftShadow]}
                    />
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['transparent', colors.black]}
                        style={[globalStyles.shadow, globalStyles.rightShadow]}
                    />
                    <Filigree5_Bottom customColor={colors.lightgray} />

                    <View style={styles.ot_container}>
                        <TouchableOpacity style={styles.ot_fieldContainer}
                            onPress={() => {
                                dispatch(setFieldToUpdate("genreList"))
                                navigation.navigate("Cr_Update_Field")
                            }}
                        >
                            <Text style={[styles.ot_textInputLabel,
                            (genreList != null && genreList.length == 0) && { color: colors.gray }
                            ]}>
                                Thể Loại
                            </Text>
                            <View style={styles.ot_textInput}>
                                {
                                    (genreList != null && genreList.length == 0) &&
                                    <Text style={
                                        { color: colors.lightgray, marginTop: 5 }
                                    }>
                                        Thể Loại
                                    </Text>
                                }
                                {
                                    genreList.map(
                                        (genre) =>
                                            <GenreComponent key={genre} genre={genre} />
                                    )
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>MỤC LỤC</Text>
                </View>
                <View style={styles.chapterContainer}>
                    {
                        chaptersOfSelectedCreation != null &&
                        chaptersOfSelectedCreation.map((chapter) =>
                            <ChapterComponent chapter={chapter}
                                key={chapter.chapterId}
                                navigation={navigation}
                            />
                        )
                    }
                </View>

                <TouchableOpacity style={{ marginVertical: 0 }}
                    onPress={() => {
                        navigation.navigate("Cr_Create_Chapter")
                    }}
                >
                    <OrnateButton ButtonText={"Thêm Chương Mới"} ButtonIcon={"add"} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 10 }}
                    onPress={() => {
                        handleDeleteBook(bookId);
                        navigation.navigate("Cr_Home");
                    }}
                >
                    <OrnateButtonRed ButtonText={"Xóa Truyện"} ButtonIcon={"delete"} isRed={true} />
                </TouchableOpacity>
                <Filigree2 customPosition={60} />
                <View style={globalStyles.bottomPadding} />
            </ScrollView>
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
        // borderColor: colors.gold,
        // borderBottomWidth: 3
    },

    ch_button: {
        flex: 1,
        paddingHorizontal: 20
    },

    ch_buttonText: {
        textAlign: 'right',
        color: colors.white,
        fontWeight: "bold"
    },

    ch_textContainer: {
        flex: 4
    },

    ch_text: {
        textAlign: 'left',
        color: colors.white,
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1.2
    },

    //-------------------------------------------------------//
    // ORNATE TEXTBOX

    ornateTextbox: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',
        height: 'auto',
        marginVertical: 5,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.gray,
    },
    ot_container: {
        flexDirection: 'collumn',
        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: 20,
        paddingBottom: 50,
        width: '90%',
        height: 'auto'
    },
    ot_pictureFrame: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 100,
        height: 150,

        borderRadius: 4,

        borderColor: colors.lightgray,
        borderWidth: 1,
        backgroundColor: colors.gray
    },
    ot_text: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',

        marginLeft: 10,
        marginBottom: 10
    },
    ot_fieldContainer: {
        width: '100%',

        marginTop: 20
    },
    ot_textInputLabel: {
        color: colors.gold,
        fontSize: 11,
        fontWeight: 'bold'
    },
    ot_textInput: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        width: '100%',
        padding: 5,
        paddingTop: 0,
        margin: 0,

        color: colors.white,
        borderBottomColor: colors.lightgray,
        borderBottomWidth: 1
    },
    ot_coverImage: {
        width: '100%',
        height: '100%',

        borderRadius: 4
    },

    //-------------------------------------------------------//
    // GENRE COMPONENT

    genreComponent: {
        width: 'auto',
        padding: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        marginTop: 5,

        borderRadius: 4,

        backgroundColor: colors.black,
    },
    gc_text: {
        color: colors.white,
        fontWeight: 'bold'
    },

    //-------------------------------------------------------//
    // ORNATE TEXTBOX 2

    ornateTextbox_2: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 180,
        marginTop: 5,
        marginBottom: 5,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.gray,
    },
    ot2_container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        paddingHorizontal: 15,
        width: '80%'
    },

    //-------------------------------------------------------//
    // TITLE CONTAINER

    titleContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',

        width: '100%',
        height: 60,
        paddingHorizontal: 40
    },

    title: {
        fontSize: 20,
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 2
    },

    //-------------------------------------------------------//
    // ORNATE TEXTBOX WHITE

    ornateTextbox_white: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',
        height: 80,
        marginVertical: 2,
        paddingVertical: 10,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 2,
        backgroundColor: colors.white,
    },
    otw_textRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        width: '100%',
        paddingHorizontal: 45
    },
    otw_title: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.4,
        color: colors.black,
        width: '100%'
    },
    otw_subtitle: {
        fontSize: 13,
        fontStyle: 'italic',
        color: colors.gray
    }
});

export default Cr_Update;