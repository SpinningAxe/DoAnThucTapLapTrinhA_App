import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";

import { colors, globalStyles, bookCover } from '../components/GlobalStyle';
import { Filigree2, Filigree5_Top, Filigree5_Bottom } from '../components/decorations/Filigree';
import { OrnateButton, OrnateOption } from '../components/decorations/DecoButton';
import { updateCreationField } from '../store/slices/accountSlice';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const languageList = ["Tiếng Việt", "Tiếng Anh", "Tiếng Trung", "Tiếng Nhật"] // require("../assets/_languageList.json");
const genreDatabase = []// require("../assets/_genreDatabase.json")

const CreateStoryHeader = ({ fieldToUpdate, valueToUpdate }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bookId = useSelector((state) => (state.account.selectedCreation.bookId));

    const fieldToUpdate_TiengViet = (ftu) => {
        switch (ftu) {
            case "progressStatus": return "trạng thái";
            case "cover": return "ảnh bìa";
            case "title": return "tựa đề";
            case "series": return "series";
            case "description": return "mô tả";
            case "language": return "ngôn ngữ";
            case "translator": return "dịch giả";
            case "genreList": return "thể loại";
            default: return "chi tiết";
        }
    }

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
                onPress={() => navigation.navigate("Cr_Update")}
            >
                <MaterialIcons name='arrow-back' color={colors.white} size={30} />
            </TouchableOpacity>

            <View style={styles.ch_textContainer}>
                <Text style={styles.ch_text}>
                    Sửa {fieldToUpdate_TiengViet(fieldToUpdate)}
                </Text>
            </View>

            <TouchableOpacity style={styles.ch_button}
                onPress={async () => {
                    try {
                        const result = await dispatch(updateCreationField({
                            bookId: String(bookId),
                            fieldToUpdate: fieldToUpdate,
                            valueToUpdate: valueToUpdate,
                        })).unwrap();

                        console.log("Update successful:", result);
                    } catch (error) {
                        console.error("Update failed:", error);
                    }
                    navigation.navigate("Cr_Update")
                }}
            >
                <Text style={[styles.ch_buttonText, { fontSize: 18 }]}>
                    Lưu
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

const LanguagePickerComponent = ({ pickedLanguage, language, setLanguage }) => {
    const active = pickedLanguage == language;
    return (
        <TouchableOpacity style={[styles.genrePickerComponent, active && styles.gpc_activeColor, active && { width: '105%', paddingHorizontal: 22 }]}
            activeOpacity={1}
            onPress={() => {
                setLanguage(language)
            }}
        >
            <View style={[styles.gpc_decoration, active && { backgroundColor: colors.gold }]} />
            <Text style={[styles.gpc_text, active && styles.gpc_activeColor]}>
                {language}
            </Text>
        </TouchableOpacity>
    )
}

const GenrePickerComponent = ({ genre, setGenreList, genreList }) => {
    const [active, setActive] = useState(genreList.includes(genre));

    const handlePickingGenre = (genre) => {
        setActive(!active)
        if (!active) {
            setGenreList([...genreList, genre])
        } else {
            setGenreList(genreList.filter(item => item != genre))
        }
    }
    return (
        <TouchableOpacity style={[styles.genrePickerComponent, active && styles.gpc_activeColor, active && { width: '105%', paddingHorizontal: 22 }]}
            activeOpacity={1}
            onPress={() => { handlePickingGenre(genre) }}
        >
            <View style={[styles.gpc_decoration, active && { backgroundColor: colors.gold }]} />
            <Text style={[styles.gpc_text, active && styles.gpc_activeColor]}>
                {genre}
            </Text>
        </TouchableOpacity>
    )
}

const cover_display = (cover, setCover) => {
    return (
        <View style={[styles.ornateTextbox_2, { marginTop: 10 }]}>
            <Filigree5_Bottom customColor={colors.lightgray} />
            <Filigree5_Top customColor={colors.lightgray} />
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

            <View style={styles.ot2_container}>
                <View style={styles.ot_pictureFrame}>
                    <Image source={{ uri: cover }}
                        style={styles.ot_coverImage}
                    />
                </View>
            </View>
        </View>
    )
}

const progressStatus_display = (progressStatus, setProgressStatus) => {
    return (
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
                {/* Add your story progress status UI here */}
            </View>
        </View>
    )
}

const title_display = (title, setTitle) => {
    return (
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
                <View style={styles.ot_fieldContainer}>
                    <Text style={[styles.ot_textInputLabel,
                    (title == null || title == '') && { color: colors.gray }
                    ]}>
                        Tựa Đề
                    </Text>
                    <TextInput style={styles.ot_textInput}
                        placeholder='Tựa Đề'
                        placeholderTextColor={colors.lightgray}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
            </View>
        </View>
    )
}

const series_display = (series, setSeries, bookNum, setBookNum) => {
    return (
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
                <View style={{ flexDirection: 'row' }}>
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
                            onChangeText={setSeries}
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
                            onChangeText={setBookNum}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const description_display = (description, setDescription) => {
    return (
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
                <View style={styles.ot_fieldContainer}>
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
                        onChangeText={setDescription}
                    />
                </View>
            </View>
        </View>
    )
}

const language_display = (language, setLanguage) => {
    return (
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
                <View style={[styles.ot_fieldContainer,
                { marginTop: 20 }
                ]}>
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
                </View>
                <View style={styles.genrePicker}>
                    {
                        languageList.map((_language) =>
                            <LanguagePickerComponent key={_language}
                                language={_language}
                                pickedLanguage={language}
                                setLanguage={setLanguage}
                            />
                        )
                    }
                </View>
            </View>
        </View>
    )
}

const translator_display = (translator, setTranslator) => {
    return (
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
                <View style={styles.ot_fieldContainer}>
                    <Text style={[styles.ot_textInputLabel,
                    (translator == null || translator == '') && { color: colors.gray }
                    ]}>
                        Dịch Giả
                    </Text>
                    <TextInput style={styles.ot_textInput}
                        placeholder='Dịch Giả'
                        placeholderTextColor={colors.lightgray}
                        value={translator}
                        onChangeText={setTranslator}
                    />
                </View>
            </View>
        </View>
    )
}

const genreList_display = (genreList, setGenreList) => {
    return (
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
            <Filigree5_Top customColor={colors.lightgray} />
            <Filigree5_Bottom customColor={colors.lightgray} />

            <View style={styles.ot_container}>
                <View style={[styles.ot_fieldContainer,
                { marginTop: 20 }
                ]}>
                    <Text style={[styles.ot_textInputLabel,
                    { marginBottom: 5 }
                    ]}>
                        {genreList != null && 'Thể Loại'}
                    </Text>
                    <View style={styles.ot_textInput}>
                        {
                            genreList.length == 0 &&
                            <Text style={{ color: colors.lightgray, marginVertical: 7 }}>
                                Thể Loại
                            </Text>
                        }
                        {
                            genreList.map(
                                (genre) => <GenreComponent key={genre}
                                    genre={genre}
                                />
                            )
                        }

                    </View>
                </View>
                <View style={styles.genrePicker}>
                    {
                        genreDatabase.map((genre) =>
                            <GenrePickerComponent key={genre.name} genre={genre.name}
                                genreList={genreList}
                                setGenreList={setGenreList}
                            />
                        )
                    }
                </View>
            </View>
        </View>
    )
}

const Cr_Update_Field = () => {
    const { selectedCreation, fieldToUpdate } = useSelector((state) => state.account);

    const [cover, setCover] = useState(selectedCreation.cover);
    const [progressStatus, setProgressStatus] = useState(selectedCreation.progressStatus)
    const [title, setTitle] = useState(selectedCreation.title);
    const [series, setSeries] = useState(selectedCreation.series);
    const [description, setDescription] = useState(selectedCreation.description);
    const [language, setLanguage] = useState(selectedCreation.language);
    const [bookNum, setBookNum] = useState(selectedCreation.bookNum);
    const [translator, setTranslator] = useState(selectedCreation.translator);
    const [genreList, setGenreList] = useState(selectedCreation.genreList);

    const [valueToUpdate, setValueToUpdate] = useState(null);

    const screenDisplay = useMemo(() => {
        switch (fieldToUpdate) {
            case "progressStatus":
                setValueToUpdate(progressStatus);
                return progressStatus_display(progressStatus, setProgressStatus);
            case "cover":
                setValueToUpdate(cover);
                return cover_display(cover, setCover);
            case "title":
                setValueToUpdate(title);
                return title_display(title, setTitle);
            case "series":
                setValueToUpdate([series, bookNum]);
                return series_display(series, setSeries, bookNum, setBookNum);
            case "description":
                setValueToUpdate(description);
                return description_display(description, setDescription);
            case "language":
                setValueToUpdate(language);
                return language_display(language, setLanguage);
            case "translator":
                setValueToUpdate(translator);
                return translator_display(translator, setTranslator);
            case "genreList":
                setValueToUpdate(genreList);
                return genreList_display(genreList, setGenreList);
            default:
                console.log("unknown screen mode");
                return null;
        }
    }, [fieldToUpdate, progressStatus, cover, title, series, bookNum, description, language, translator, genreList]);

    return (
        <View style={styles.container}>
            <CreateStoryHeader fieldToUpdate={fieldToUpdate} valueToUpdate={valueToUpdate} />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                {screenDisplay}
                <Filigree2 customPosition={-85} />
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
    // ORNATE TEXTBOX

    ornateTextbox: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '100%',
        height: 'auto',
        marginVertical: 10,

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
        paddingBottom: 40,
        width: '90%',
        height: 'auto'
    },
    ot_pictureFrame: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 250,
        height: 350,
        marginVertical: 40,

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
        height: 'auto',
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
        justifyContent: 'center',
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
    },
    //-------------------------------------------------------//
    // GENRE PICKER COMPONENT
    genrePicker: {
        justifyContent: 'flex-start',
        alignItems: 'center',

        width: '90%',
        // marginBottom: 10
    },

    genrePickerComponent: {
        flexDirection: 'row',
        alignItems: 'center',

        width: '100%',
        padding: 15,
        paddingHorizontal: 15,
        marginRight: 5,
        marginTop: 8,

        borderRadius: 4,

        backgroundColor: colors.gray,
        borderColor: colors.lightgray,
        borderWidth: 1,
        borderLeftWidth: 3,
        borderRightWidth: 3,
    },
    gpc_activeColor: {
        color: colors.white,
        borderColor: colors.gold,
        backgroundColor: colors.black
    },
    gpc_text: {
        color: colors.lightgray,
        fontWeight: 'bold'
    },
    gpc_diamond: {
        position: 'absolute',
        right: -17
    },
    gpc_checkmark: {
        position: 'absolute',
        right: -25,
        top: 5
    },
    gpc_decoration: {
        height: '100%',
        width: 6,
        borderRadius: 4,
        backgroundColor: colors.lightgray,
        marginRight: 10
    }

});

export default Cr_Update_Field;