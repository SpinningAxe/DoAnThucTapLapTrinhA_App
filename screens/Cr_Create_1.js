import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from "react-redux";
import { clearNewCreation, clearNewCreationChapter, setCreationField_1 } from '../store/slices/accountSlice';

import { colors, globalStyles } from '../components/GlobalStyle';
import { Filigree2, Filigree4, Filigree5_Bottom } from '../components/decorations/Filigree';
import { OrnateOption } from '../components/decorations/DecoButton';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CreateStoryHeader = ({ cover, type, title, series, bookNum, description }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
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
                    Thông Tin Truyện
                </Text>
            </View>

            <TouchableOpacity style={styles.ch_button}
                onPress={() => {
                    dispatch(setCreationField_1(
                        {
                            cover: cover,
                            type: type,
                            title: title,
                            series: series,
                            bookNum: bookNum,
                            description: description,
                        }
                    ))
                    navigation.navigate("Cr_Create_2")
                }}
            >
                <Text style={[styles.ch_buttonText, { fontWeight: 'normal' }]}>
                    Tiếp
                </Text>
            </TouchableOpacity>

            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, globalStyles.bottomShadow,
                { bottom: -13, height: 13, opacity: 0.4 }
                ]}
            />
        </View>
    )
}
const Cr_Create_1 = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearNewCreation());
        dispatch(clearNewCreationChapter());
    }, [dispatch]);

    const [type, setType] = useState("truyện tranh");
    const [title, setTitle] = useState('');
    const [series, setSeries] = useState('');
    const [cover, setCover] = useState('');
    const [bookNum, setBookNum] = useState(0);
    const [description, setDescription] = useState('');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [2, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setCover(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    return (
        <View style={styles.container}>
            <CreateStoryHeader
                cover={cover}
                type={type}
                title={title}
                series={series}
                bookNum={bookNum}
                description={description}
            />
            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                <View style={styles.ornateTextbox_2}>
                    <Filigree4 customBottomPosition={0} customOpacity={0.12} />

                    <View style={styles.ot2_container}>
                        <TouchableOpacity style={styles.ot_pictureFrame}
                            onPress={pickImage}
                        >
                            {
                                cover == '' ? <MaterialIcons name="add" size={30} color={colors.white} />
                                    : <Image
                                        source={{ uri: cover }}
                                        style={{ width: "100%", height: "100%", borderRadius: 4 }}
                                    />
                            }

                        </TouchableOpacity>

                        <Text style={[styles.ot_text, { marginLeft: 20 }]}>
                            {cover == '' ? "Thêm " : "Sửa "}
                            Ảnh Bìa
                        </Text>
                    </View>

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

                </View>

                <View style={{ marginBottom: 10, marginTop: 5 }}>
                    <TouchableOpacity style={{ zIndex: 2 }} activeOpacity={0.9}
                        onPress={() => {
                            setType("truyện tranh")
                        }}
                    >
                        <OrnateOption ButtonText="Truyện Tranh" Active={type == "truyện tranh"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ zIndex: 1 }} activeOpacity={0.9}
                        onPress={() => {
                            setType("sách chữ")
                        }}
                    >
                        <OrnateOption ButtonText="Sách Chữ" Active={type == "sách chữ"} />
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
                        <View style={styles.ot_fieldContainer}>
                            <Text style={[styles.ot_textInputLabel,
                            (title == null || title == '') && { color: colors.gray }
                            ]}>
                                Tựa Đề
                            </Text>
                            <TextInput style={styles.ot_textInput}
                                placeholder='Tựa Đề'
                                placeholderTextColor={colors.lightgray}
                                onChangeText={(text) => setTitle(text)}
                                value={title}
                            />
                        </View>

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
                                    onChangeText={(text) => setSeries(text)}
                                    value={series}
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
                                    onChangeText={(text) => setBookNum(text)}
                                    value={bookNum}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

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
                                onChangeText={(text) => setDescription(text)}
                                value={description}
                            />
                        </View>
                    </View>
                </View>
                <Filigree2 customPosition={-90} />
                {/* <View style={globalStyles.bottomPadding} /> */}
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
        width: '100%',

        padding: 5,
        paddingTop: 0,

        margin: 0,

        color: colors.white,
        borderBottomColor: colors.lightgray,
        borderBottomWidth: 1
    },

    //-------------------------------------------------------//
    // ORNATE TEXTBOX

    ornateTextbox_2: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 180,
        marginTop: 10,
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
});

export default Cr_Create_1;