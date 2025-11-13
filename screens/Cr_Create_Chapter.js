import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { store } from '../store';
import {
    uploadNewCreationToFirestore,
    initNewCreation,
    setChapter,
    fetchCreationById,
    fetchChaptersOfSelectedCreation,
    initNewChapter,
    uploadNewChapter
} from '../store/slices/accountSlice';

import { colors, globalStyles } from '../components/GlobalStyle';
import { Filigree2, Filigree5_Bottom, Filigree5_Top } from '../components/decorations/Filigree';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CreateStoryHeader = ({ title, content }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { selectedCreation, chaptersOfSelectedCreation, loading } = useSelector((state) => (state.account));
    const newChapterNum = chaptersOfSelectedCreation.length + 1;

    const handleFinalizeCreation = async () => {
        try {
            dispatch(setChapter({
                bookId: selectedCreation.bookId,
                chapterNum: newChapterNum,
                chapterTitle: title,
                chapterContent: content,
            }));
            dispatch(initNewChapter());

            const { newCreationChapter } = store.getState().account;

            dispatch(uploadNewChapter({ newCreationChapter }));

        } catch (error) {
            console.error("Error during finalize creation:", error);
        }
    };

    if (loading) return null;

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

            <TouchableOpacity style={styles.ch_button}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons name='arrow-back' color={colors.white} size={30} />
            </TouchableOpacity>

            <View style={styles.ch_textContainer}>
                <Text style={styles.ch_text}>
                    Nội Dung Chương {newChapterNum}
                </Text>
            </View>

            <TouchableOpacity style={styles.ch_button}
                onPress={() => {
                    navigation.navigate("Cr_Home")
                    handleFinalizeCreation()
                }}
            >
                <Text style={[styles.ch_buttonText, { fontWeight: 'normal' }]}>
                    Đăng
                </Text>
            </TouchableOpacity>

            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, globalStyles.bottomShadow, { bottom: -13, height: 13, opacity: 0.4 }]}
            />
        </View>
    )
}

const Cr_Create_Chapter = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <View style={styles.container}>
            <CreateStoryHeader title={title} content={content} />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <View style={styles.titleInput}>
                    <TextInput style={styles.ti_input}
                        placeholder='Tựa Đề Chương'
                        placeholderTextColor={colors.lightgray}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                    />
                    <Filigree2 customPosition={-75} />
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
                    <Filigree5_Top customColor={colors.lightgray} />

                    <View style={styles.ot_container}>
                        <TextInput style={styles.ot_textInput}
                            placeholder='Bắt đầu viết'
                            placeholderTextColor={colors.lightgray}
                            onChangeText={(text) => setContent(text)}
                            value={content}
                            multiline={true}
                        />
                    </View>
                </View>
                {/* <Filigree2 customPosition={60} />
                <View style={globalStyles.bottomPadding} /> */}
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
    // TITLE INPUT

    titleInput: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 70,
    },

    ti_input: {
        width: 320,
        paddingTop: 10,
        marginTop: 5,

        color: colors.white,
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',

        borderColor: colors.gray,
        borderTopWidth: 1.5,
    },

    //-------------------------------------------------------//
    // ORNATE TEXTBOX

    ornateTextbox: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        width: '100%',
        height: 600,
        marginVertical: 10,

        overflow: 'hidden',

        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
        backgroundColor: colors.gray,
    },

    ot_container: {
        flexDirection: 'collumn',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        paddingHorizontal: 35,
        paddingVertical: 40,
        width: '100%',
        height: '100%'
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
        color: colors.lightgray,
        fontSize: 11,
        fontWeight: 'bold'
    },

    ot_textInput: {
        width: '100%',
        padding: 5,
        paddingTop: 0,

        margin: 0,

        color: colors.white,

        lineHeight: 22
        // borderBottomColor: colors.lightgray,
        // borderBottomWidth: 1
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
});

export default Cr_Create_Chapter;