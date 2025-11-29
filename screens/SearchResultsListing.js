import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Line } from 'react-native-svg';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchBooksForBookListing, setSelectedBook } from '../store/slices/bookSlice';

import { colors, globalStyles } from '../components/GlobalStyle';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

import { Filigree1, Filigree4 } from '../components/decorations/Filigree';
import { DirectionButton_Left, DirectionButton_Right } from '../components/decorations/DecoButton';


const ResultCount = ({ title, bookList, totalPage }) => {
    const searchKeyword = useSelector((state) => (state.books.searchKeyword))
    return (
        <View style={[styles.rc_container, totalPage == 1 ? { borderColor: colors.gray } : { borderColor: colors.black }]}>
            <Text style={styles.rc_title}>
                {title}
                {(searchKeyword != null) && ": " + searchKeyword}

            </Text>
            <View style={styles.row}>
                <Svg width={40} height={40 * 0.184} viewBox="0 0 38 7">
                    <Circle
                        cx="34.5"
                        cy="3.5"
                        r="3"
                        fill={colors.gray}
                        stroke={colors.gray}
                    />
                    <Line
                        x1="33"
                        y1="3.5"
                        x2="0"
                        y2="3.5"
                        stroke={colors.gray}
                        strokeWidth="1"
                    />
                </Svg>
                <Text style={[styles.rc_subtitle, { marginLeft: 10 }]}>
                    {bookList.length} Kết quả
                </Text>
            </View>
        </View>
    )
}

const ResultButton = ({ page, setPage, totalPage }) => {
    const movePage = (direction) => {
        let newPage = page + direction;
        if (newPage < 1 || newPage > totalPage) return;
        setPage(newPage);
    }
    return (
        <View style={styles.rb_container}>
            {/* <View style={styles.line} /> */}
            <Filigree1 customPosition={-95} />

            <View style={[styles.row, { justifyContent: 'center' }]}>
                <TouchableOpacity style={styles.rb_button}
                    onPress={() => movePage(-1)}
                >
                    <DirectionButton_Left />
                </TouchableOpacity>

                <Text style={styles.rb_text}>Trang {page} trên {totalPage}</Text>
                <TouchableOpacity style={styles.rb_button}
                    onPress={() => movePage(1)}>
                    <DirectionButton_Right />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ResultDisplay = ({ page, bookList }) => {
    const data = bookList.slice((page - 1) * 10, page * 10)
    const navigation = useNavigation();
    return (
        <View style={styles.rd_container}>

            <FlatList
                data={data}
                renderItem={({ item }) => <BookItem navigation={navigation} book={item} />}
                numColumns={2}
                scrollEnabled={false}
                style={styles.bi_flatlist_compact}
            />

            {/* <FlatList
                data={data}
                renderItem={(bookItem) => <BookItem_Wide navigation={navigation} book={bookItem.item} />}
                keyExtractor={bookItem => bookItem.id}
                scrollEnabled={false}
            /> */}
        </View>
    )
}

const BookItem_Wide = ({ navigation, book }) => {
    return (
        <View style={styles.bi_container}>
            <Filigree4
                customBottomPosition={-10}
                customLeftPosition={-25}
                customOpacity={0.1}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'transparent']}
                style={[globalStyles.shadow, globalStyles.topShadow]}
            />

            <TouchableOpacity style={styles.bi_bookCover}
                onPress={() => {
                    navigation.navigate("BookDetailScreen")
                }}
            >
                <Image source={{ uri: book.cover }}
                    style={styles.bi_bookCoverImg}
                    resizeMode='cover'
                />
            </TouchableOpacity>
            <View style={styles.bi_detailContainer}>
                <Text style={styles.bi_bookTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {book.title}
                </Text>
                <View style={styles.bi_row}>
                    <MaterialIcons name="collections-bookmark"
                        color={colors.white}
                        size={12}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.bi_bookAuthor}>{book.series}</Text>
                </View>

                <View style={[styles.bi_row, { marginTop: 10 }]}>
                    <MaterialIcons name="create"
                        color={colors.white}
                        size={12}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.bi_bookPage}>{book.author}</Text>
                </View>


                {/* <View style={styles.bi_statContainer}>
                    <View style={styles.bi_stat}>
                        <Text style={styles.bi_statNum}>{formatCompactNumber(book.totalPage)}</Text>
                        <Text style={styles.bi_statText}>Trang</Text>
                    </View>
                    <View style={styles.bi_stat}>
                        <Text style={styles.bi_statNum}>{formatCompactNumber(book.totalView)}</Text>
                        <Text style={styles.bi_statText}>Lượt Xem</Text>
                    </View>
                    <View style={styles.bi_stat}>
                        <Text style={styles.bi_statNum}>{formatCompactNumber(book.totalLike)}</Text>
                        <Text style={styles.bi_statText}>Lượt Thích</Text>
                    </View>
                </View> */}
            </View>
        </View>
    )
}
const formatCompactNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return 'Invalid';

    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B';
    }
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    }
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k';
    }
    return number.toString();
};
const BookItem = ({ navigation, book }) => {
    const dispatch = useDispatch();
    return (
        <View style={styles.bi_container_compact}>
            <TouchableOpacity style={styles.bi_bookCover_compact}
                onPress={() => {
                    dispatch(setSelectedBook(book))
                    navigation.navigate("BookDetail")
                }}
            >
                <Image source={{ uri: book.cover }}
                    style={styles.bi_bookCoverImg_compact}
                    resizeMode='cover'
                />
            </TouchableOpacity>
            <Text style={styles.bi_bookTitle_compact}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {book.title}
            </Text>
            <Text style={styles.bi_bookAuthor_compact}>{book.author}</Text>
            {/* <Text style={styles.bi_bookPage}>1000 trang</Text> */}
        </View>
    )
}

const SearchResultListing = ({ navigation }) => {
    const { searchResults, bookListingTitle, loading, error } = useSelector((state) => state.books);

    const [page, setPage] = useState(1);
    if (loading) return null;

    const totalPage = Math.ceil(searchResults.length / 10);
    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={{ width: '100%' }} bounces={false} overScrollMode="never">
                <ResultCount
                    title={bookListingTitle}
                    bookList={searchResults}
                    totalPage={totalPage}
                />

                {
                    totalPage == 1 &&
                    <View>
                        <Filigree1 customPosition={-95} />
                    </View>
                }

                {
                    totalPage != 1 &&
                    <ResultButton page={page}
                        setPage={setPage}
                        totalPage={totalPage}
                    />
                }

                <ResultDisplay page={page} bookList={searchResults} />

                {
                    (totalPage != 1 && searchResults.length > 4) &&
                    <ResultButton page={page}
                        setPage={setPage}
                        totalPage={totalPage}
                    />
                }

                {
                    totalPage == 1 &&
                    <View>
                        <Filigree1 customPosition={-80} />
                    </View>
                }

                <View style={globalStyles.bottomPadding} />
            </ScrollView>
            <AppFooter currentScreen={0} />
        </View>
    );
};

const styles = StyleSheet.create({
    //-------------------------------------------------------//

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.black,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        width: '100%',

        marginVertical: 5,
    },

    //-------------------------------------------------------//
    // RESULT COUNT

    rc_container: {
        justifyContent: 'center',
        alignItems: 'flex-start',

        width: '100%',
        height: 'auto',

        paddingTop: 20,
        paddingBottom: 10,

        borderBottomWidth: 2,
    },
    rc_title: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',

        marginHorizontal: 25
    },
    rc_subtitle: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'light',
        letterSpacing: 1
    },

    //-------------------------------------------------------//
    // RESULTS DISPLAY

    rd_container: {
        justifyContent: 'center',
        alignItems: 'center',

        width: '100%',
        paddingVertical: 10,
        marginTop: 10,
    },

    //-------------------------------------------------------//
    // RESULT BUTTON

    rb_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        width: '100%',

        paddingTop: 10,

        borderTopWidth: 2,
        borderColor: colors.gray
    },
    rb_text: {
        color: colors.white
    },
    rb_button: {
        marginHorizontal: 20,
    },

    //-------------------------------------------------------//
    // BOOK ITEM

    bi_container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',

        width: 320,
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

        //borderRadius: 4,

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
        width: '100%'
    },
    bi_detailContainer: {
        justifyContent: 'flex-start',
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
        fontSize: 14,

        marginTop: 8,
    },
    bi_bookAuthor: {
        color: colors.white,
        fontWeight: 'light',
        fontStyle: 'italic',
        letterSpacing: 1,
        fontSize: 12,
    },
    bi_bookPage: {
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 12,
    },
    bi_statContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        width: 170,
        marginTop: 15,
    },
    bi_stat: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        marginHorizontal: 5
    },
    bi_statNum: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.white
    },
    bi_statText: {
        fontSize: 11,
        color: colors.white
    },
    bi_row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        width: '100%',
    },

    bi_flatlist_compact: {
        width: '100%',
        paddingHorizontal: 10,
    },

    bi_container_compact: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

        overflow: 'hidden',

        width: 150,
        height: 'auto',
        marginHorizontal: 10,
        marginVertical: 15,
    },
    bi_bookCover_compact: {
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
    bi_bookTitle_compact: {
        color: colors.gold,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 14,
    },
    bi_bookAuthor_compact: {
        color: colors.white,
        fontWeight: 'light',
        fontStyle: 'italic',
        letterSpacing: 1,
        fontSize: 12,
    },
    bi_bookPage_compact: {
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 12,

        marginTop: 10
    },
    bi_bookCoverImg_compact: {
        width: '100%',
        height: '100%',
        borderRadius: 4
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
        height: 120,
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
        // position: 'absolute',
        // bottom: 0,
        paddingBottom: 120
    }
});

export default SearchResultListing;