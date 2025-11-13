import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, globalStyles } from "../components/GlobalStyle";

import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter";
import BookList from "../components/BookList"

import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../store/slices/bookSlice";
import CurrentBook from "../components/CurrentBook";

const Quotes = [
    "A mind needs books\nas a sword needs a whetstone.",
    "Knowledge is power.",
    "A room without a book\nis like a body without a soul.",
    "A book is a dream\nthat you hold in your hand.",
    "Never trust anyone who has\nnot brought a book with them.",
    "There is only one thing that\ncould replace a book: the next book.",
    "Books are the mirrors of the soul.",
    "There is no friend as loyal as a book."
]

const createRandomList = (array, count) => {
    if (!array || array.length === 0) return [];
    return [...array]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
};
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Catalogue = () => {
    const { booksDatabase } = useSelector((state) => state.books);

    const catalogueList = createRandomList(booksDatabase, 10);
    const randomQuote = getRandomInt(0, Quotes.length - 1);
    const catalogueRow_1 = catalogueList.slice(0, 3);
    const catalogueRow_2 = catalogueList.slice(3, 7);
    const catalogueRow_3 = catalogueList.slice(7, 10);

    return (
        <View style={styles.c_container}>
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, globalStyles.topShadow, { zIndex: 999, opacity: 0.8, top: 0, height: 40 }]}
            />
            <LinearGradient
                colors={['transparent', colors.black]}
                style={[globalStyles.shadow, globalStyles.bottomShadow, { opacity: 0.3, }]}
            />
            <Text style={styles.c_text}>{Quotes[randomQuote]}</Text>

            <View style={[styles.c_row, { top: -45 }]}>
                {
                    catalogueRow_1.map((catalogue) => (
                        <View style={styles.c_book} key={"row1" + catalogue.title}>
                            <Image
                                source={{ uri: catalogue.cover }}
                                style={styles.c_bookImg}
                                resizeMode="cover"
                            />
                        </View>
                    ))
                }
            </View>
            <View style={[styles.c_row]}>
                {
                    catalogueRow_2.map((catalogue) => (
                        <View style={styles.c_book} key={"row2" + catalogue.title}>
                            <Image
                                source={{ uri: catalogue.cover }}
                                style={styles.c_bookImg}
                                resizeMode="cover"
                            />
                        </View>
                    ))
                }
            </View>
            <View style={[styles.c_row, { bottom: -45 }]}>
                {
                    catalogueRow_3.map((catalogue) => (
                        <View style={styles.c_book} key={"row3" + catalogue.title}>
                            <Image
                                source={{ uri: catalogue.cover }}
                                style={styles.c_bookImg}
                                resizeMode="cover"
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

export default function BookHome() {
    const dispatch = useDispatch();
    const { booksDatabase, loading, error } = useSelector((state) => state.books);

    useEffect(() => {
        dispatch(fetchBooks());
    }, []);

    //   if (error) return <Text style={styles.centered}>Error: {error}</Text>;

    const _bookList1 = createRandomList(booksDatabase, 10);

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView bounces={false} overScrollMode="never" style={{ width: '100%' }}>
                {loading ? <ActivityIndicator style={styles.centered} /> :
                    <View>
                        <Catalogue />
                        <CurrentBook />
                        <BookList title="Mới Cập Nhật" data={_bookList1} />

                        {/* <BookList title="Nổi Bật" data={booksDatabase} />

                        <BookList title="Hàng Đầu" data={booksDatabase} /> */}

                        <View style={globalStyles.bottomPadding} />
                    </View>
                }
            </ScrollView>
            <AppFooter currentScreen={0} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.text,
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: colors.error,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.black,
    },

    //-------------------------------------------------------//
    // CATALOGUE

    c_container: {
        justifyContent: 'center',
        alignItems: 'center',

        height: 450,
        width: "100%",

        overflow: 'hidden',
        backgroundColor: colors.black,
    },
    c_text: {
        position: "absolute",

        color: colors.white,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'light',
        letterSpacing: 3,
        lineHeight: 25
    },
    c_book: {
        width: "30%",
        height: "100%",
        marginHorizontal: 5,

        backgroundColor: colors.gray,
        opacity: 0.12,
    },
    c_bookImg: {
        width: "100%",
        height: "100%",
    },
    c_row: {
        position: "absolute",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        zIndex: -99,

        width: "100%",
        height: "40%",
        paddingVertical: 5,

        overflow: 'hidden',
        backgroundColor: colors.black,
    },

    //-------------------------------------------------------//
    // CURRENT BOOK

    cb_container: {
        justifyContent: 'flex-start',
        alignItems: 'center',

        height: 220,
        width: '100%',
        marginBottom: 60,

        backgroundColor: colors.white,
        borderBottomColor: colors.gray,
        borderBottomWidth: 2
    },
    cb_bookCover: {
        position: 'absolute',
        zIndex: 999,
        left: 10,
        top: -30,
        height: 215,
        width: 130,

        borderRadius: 6,
        backgroundColor: "white",

        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cb_bookCoverImg: {
        height: '100%',
        width: '100%',

        borderRadius: 6,
    },
    cb_desContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: 9,

        width: '50%',
        height: '70%',
        marginLeft: '40%',
        paddingTop: 0,
    },
    cb_desTitle: {
        color: colors.black,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 17,
    },
    cb_desAuthor: {
        color: colors.black,
        fontWeight: 'light',
        fontStyle: 'italic',
        letterSpacing: 2,
        fontSize: 14,
    },
    cb_desProgress: {
        marginTop: 20,
        color: colors.black,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 12,
    },

    //-------------------------------------------------------//
    // BOOK LISTING

    bl_container: {
        justifyContent: 'flex-start',
        alignItems: 'center',

        // height: 320,
        width: '100%',
        marginBottom: 60,

        backgroundColor: colors.white,
        borderBottomColor: colors.gray,
        borderBottomWidth: 2
    },
    bl_header: {
        justifyContent: 'center',
        alignItems: 'flex-start',

        zIndex: 9,

        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,

        backgroundColor: colors.gray,
    },
    bl_headerTitle: {
        color: colors.gold,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 17,
    },
    bl_flatList: {
        // height: '100%',
        marginHorizontal: 6,
        marginVertical: 20,
    },

    //-------------------------------------------------------//
    // BOOK ITEM

    bi_container: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        height: "100%",
        width: 150,
        marginHorizontal: 8,
        paddingBottom: 10
    },
    bi_bookCover: {
        height: 250,
        width: 150,
        marginBottom: 10,

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
        width: "100%",
        height: '100%',
        borderRadius: 4,
    },
    bi_bookTitle: {
        fontWeight: 'bold',
        fontSize: 14
    },
    bi_bookAuthor: {
        fontWeight: 'light',
        fontSize: 12,
        fontStyle: 'italic'
    },

    //-------------------------------------------------------//
    // GENERAL

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
    line: {
        position: 'absolute',
        top: -10,
        zIndex: 99,

        height: 2,
        width: '100%',

        backgroundColor: colors.gray
    },
    decoButton: {
        position: 'absolute',
        bottom: -17,
        zIndex: 999,
    },
    bottomPadding: {
        paddingBottom: 120
    }
});
