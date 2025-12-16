import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGenre, fetchBooks, fetchAllChapters } from '../store/slices/bookSlice';

import { colors, globalStyles } from '../components/GlobalStyle';
import AppHeader from '../components/AppHeader';
import ScreenTitle from '../components/ScreenTitle';
import { Filigree4 } from '../components/decorations/Filigree';

// ---------------------- FORMAT NUMBER ---------------------- //
const formatCompactNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return 'Invalid';
    if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(1) + 'B';
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
    return number.toString();
};

// ---------------------- GENRE DROPDOWN ---------------------- //
const GenreDropdown = ({ selectedGenre, onSelectGenre, genreList }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={styles.dropdownText}>
                    {selectedGenre || 'Thể loại'}
                </Text>
                <MaterialIcons 
                    name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                    color={colors.white} 
                    size={20} 
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.dropdownMenu}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        <TouchableOpacity
                            style={[styles.dropdownItem, !selectedGenre && styles.dropdownItemActive]}
                            onPress={() => {
                                onSelectGenre(null);
                                setIsOpen(false);
                            }}
                        >
                            <Text style={[styles.dropdownItemText, !selectedGenre && styles.dropdownItemTextActive]}>
                                Tất cả
                            </Text>
                        </TouchableOpacity>
                        {genreList.map((genre) => (
                            <TouchableOpacity
                                key={genre.name}
                                style={[styles.dropdownItem, selectedGenre === genre.name && styles.dropdownItemActive]}
                                onPress={() => {
                                    onSelectGenre(genre.name);
                                    setIsOpen(false);
                                }}
                            >
                                <Text style={[styles.dropdownItemText, selectedGenre === genre.name && styles.dropdownItemTextActive]}>
                                    {genre.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

// ---------------------- BOOK ITEM ---------------------- //
const AdminBookItem = ({ book, chapterCounts }) => {
    const navigation = useNavigation();

    if (!book) return null;

    // Get chapter count for this book
    const bookId = book?.bookId || book?.id;
    const chapterCount = chapterCounts[bookId] || book?.totalChapter || book?.totalPage || 0;

    // Use book cover from database, fallback to default icon
    const bookCoverSource = book?.cover 
        ? { uri: book.cover } 
        : require('../assets/icon.png');

    return (
        <TouchableOpacity 
            style={styles.bookItem} 
            onPress={() => navigation.navigate('AdminEditBook', { bookId })}
        >
            <Filigree4 customBottomPosition={-10} customLeftPosition={-25} customOpacity={0.06} />

            <LinearGradient 
                colors={[colors.black, 'transparent']} 
                style={[globalStyles.shadow, styles.bookItemGradient]} 
            />

            <View style={styles.coverWrapper}>
                <Image 
                    source={bookCoverSource} 
                    style={styles.cover} 
                    resizeMode="cover" 
                />
            </View>

            <View style={styles.infoWrapper}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                    {book?.title || "Untitled"}
                </Text>
                
                <View style={styles.metaRow}>
                    <MaterialIcons name="collections-bookmark" color={colors.white} size={14} />
                    <Text style={styles.series}>{book?.series || ""}</Text>
                </View>
                
                <View style={[styles.metaRow, { marginTop: 8 }]}> 
                    <MaterialIcons name="create" color={colors.white} size={14} />
                    <Text style={styles.author}>{book?.author || "Unknown"}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsNum}>
                            {formatCompactNumber(chapterCount)}
                        </Text>
                        <Text style={styles.statsLabel}>Chương</Text>
                    </View>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsNum}>
                            {formatCompactNumber(book?.totalView || book?.readCount || 0)}
                        </Text>
                        <Text style={styles.statsLabel}>Lượt Xem</Text>
                    </View>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsNum}>
                            {formatCompactNumber(book?.totalLike || 0)}
                        </Text>
                        <Text style={styles.statsLabel}>Lượt Thích</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ---------------------- ADMIN FOOTER ---------------------- //
const AdminFooter = ({ currentScreen }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerContainer}>
            <LinearGradient
                colors={['transparent', colors.gold]}
                style={[globalStyles.shadow, globalStyles.bottomShadow, { top: -13, height: 13, opacity: 0.1 }]}
            />
            <View style={styles.footerContent}>
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
                
                <TouchableOpacity 
                    style={[styles.footerButton, currentScreen === 0 && styles.footerButtonActive]}
                    onPress={() => navigation.navigate("AdminHome")}
                >
                    <MaterialIcons name="dashboard" size={22} color={currentScreen === 0 ? colors.gold : colors.white} />
                    <Text style={[styles.footerText, currentScreen === 0 && styles.footerTextActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.footerButton, currentScreen === 1 && styles.footerButtonActive]}
                    onPress={() => navigation.navigate("AdminAnalysis")}
                >
                    <MaterialIcons name="analytics" size={22} color={currentScreen === 1 ? colors.gold : colors.white} />
                    <Text style={[styles.footerText, currentScreen === 1 && styles.footerTextActive]}>Analytics</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.footerButton, currentScreen === 2 && styles.footerButtonActive]}
                    onPress={() => navigation.navigate("AdminLibraryManagement")}
                >
                    <MaterialIcons name="menu-book" size={22} color={currentScreen === 2 ? colors.gold : colors.white} />
                    <Text style={[styles.footerText, currentScreen === 2 && styles.footerTextActive]}>Library</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.footerButton, currentScreen === 3 && styles.footerButtonActive]}
                    onPress={() => navigation.navigate("AdminAccount")}
                >
                    <MaterialIcons name="person" size={22} color={currentScreen === 3 ? colors.gold : colors.white} />
                    <Text style={[styles.footerText, currentScreen === 3 && styles.footerTextActive]}>Setting</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ---------------------- MAIN SCREEN ---------------------- //
const AdminLibraryManagement = () => {
    const dispatch = useDispatch();
    const { booksDatabase, genreDatabase, chapterDatabase, loading } = useSelector(state => state.books);
    const bookDatabase = booksDatabase || [];
    const safeChapterDatabase = Array.isArray(chapterDatabase) ? chapterDatabase : [];
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        // Fetch books from Firebase if database is empty
        if (!booksDatabase || booksDatabase.length === 0) {
            dispatch(fetchBooks());
        }
        // Fetch genres from Firebase if database is empty
        if (!genreDatabase || genreDatabase.length === 0) {
            dispatch(fetchGenre());
        }
        // Fetch all chapters from Firebase if database is empty
        if (!chapterDatabase || chapterDatabase.length === 0) {
            dispatch(fetchAllChapters());
        }
    }, [dispatch, booksDatabase, genreDatabase, chapterDatabase]);

    const genreList = genreDatabase || [];

    // Calculate chapter counts for each book
    const chapterCounts = {};
    safeChapterDatabase.forEach(chapter => {
        const bookId = chapter?.bookId || chapter?.id;
        if (bookId) {
            chapterCounts[bookId] = (chapterCounts[bookId] || 0) + 1;
        }
    });

    // Filter books by selected genre
    const filteredBooks = selectedGenre 
        ? bookDatabase.filter(book => book && book.genreList && book.genreList.includes(selectedGenre))
        : bookDatabase;

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView bounces={false} overScrollMode="never">
                <ScreenTitle title="LIBRARY" icon="person" />

                {/* Filter Dropdown */}
                <View style={styles.filterBar}>
                    <GenreDropdown
                        selectedGenre={selectedGenre}
                        onSelectGenre={setSelectedGenre}
                        genreList={genreList}
                    />
                </View>

                {/* List Title */}
                <View style={styles.listTitleRow}>
                    <Text style={styles.listTitle}>TÁC PHẨM [{filteredBooks.length}]</Text>
                </View>

                {/* Book List */}
                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredBooks}
                        keyExtractor={(item, index) => item?.id?.toString() || item?.bookId || item?.title || `book-${index}`}
                        renderItem={({ item }) => {
                            if (!item) return null;
                            return <AdminBookItem book={item} chapterCounts={chapterCounts} />;
                        }}
                        scrollEnabled={false}
                    />
                </View>

                <View style={globalStyles.bottomPadding} />
            </ScrollView>

            <AdminFooter currentScreen={2} />
        </View>
    );
};

export default AdminLibraryManagement;

// ---------------------- STYLES ---------------------- //
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: 'center',
    },

    // Filter Dropdown
    filterBar: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 8,
        alignItems: 'center',
        zIndex: 1000,
    },
    dropdownContainer: {
        width: '90%',
        position: 'relative',
    },
    dropdownButton: {
        width: '100%',
        height: 42,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: '#111',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    dropdownText: {
        color: colors.white,
        fontSize: 14,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: colors.gray,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#333',
        maxHeight: 200,
        zIndex: 1001,
        elevation: 5,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    dropdownItemActive: {
        backgroundColor: colors.gold,
    },
    dropdownItemText: {
        color: colors.white,
        fontSize: 14,
    },
    dropdownItemTextActive: {
        color: colors.black,
        fontWeight: 'bold',
    },

    // List Title
    listTitleRow: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 12,
    },
    listTitle: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // Book List
    listContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },

    // Book Item
    bookItem: {
        width: '100%',
        height: 150,
        backgroundColor: colors.gray,
        borderTopWidth: 2,
        borderColor: '#333',
        borderRadius: 8,
        marginVertical: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingRight: 15,
        borderWidth: 1,
    },
    bookItemGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        opacity: 0.3,
    },
    coverWrapper: {
        width: 90,
        height: 130,
        marginLeft: 15,
        marginTop: 10,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderRadius: 6,
    },
    cover: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    infoWrapper: {
        flex: 1,
        paddingVertical: 18,
        paddingLeft: 18,
        justifyContent: 'space-between',
    },
    title: {
        color: colors.gold,
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    series: {
        color: colors.white,
        marginLeft: 8,
        fontSize: 13,
    },
    author: {
        color: colors.white,
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        paddingRight: 10,
        width: '100%',
    },
    statsBlock: {
        alignItems: 'center',
        flex: 1,
    },
    statsNum: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 15,
    },
    statsLabel: {
        color: '#bbb',
        fontSize: 11,
        marginTop: 3,
    },

    // Footer
    footerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    footerContent: {
        zIndex: 999999,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        height: 70,
        paddingHorizontal: 20,
        borderColor: colors.gold,
        borderTopWidth: 3,
        backgroundColor: colors.gray,
    },
    footerButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    footerButtonActive: {
        backgroundColor: colors.lightgray,
    },
    footerText: {
        fontSize: 10,
        color: colors.white,
        marginTop: 4,
    },
    footerTextActive: {
        color: colors.gold,
    },
});
