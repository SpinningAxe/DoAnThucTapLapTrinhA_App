import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, globalStyles } from '../components/GlobalStyle';
import AppHeader from '../components/AppHeader';
import ScreenTitle from '../components/ScreenTitle';
import { Filigree4 } from '../components/decorations/Filigree';
import { DecoButton } from '../components/decorations/DecoButton';

// ---------------------- FORMAT NUMBER ---------------------- //
const formatCompactNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return '0';
    if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(1) + 'B';
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
    return number.toString();
};

// ---------------------- CHAPTER ITEM ---------------------- //
const ChapterItem = ({ chapter, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!chapter) return null;

    return (
        <View style={styles.chapterItem}>
            <View style={styles.chapterHeaderRow}>
                <View style={styles.chapterInfo}>
                    <Text style={styles.chapterName}>
                        Chương {index + 1}
                        {chapter?.chapterTitle && `: ${chapter.chapterTitle}`}
                    </Text>
                </View>

                <View style={styles.chapterBtns}>
                    <TouchableOpacity style={styles.chapterIconBtn}>
                        <MaterialIcons name="cloud-upload" size={20} color={colors.gold} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chapterIconBtn}>
                        <MaterialIcons name="cloud-download" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chapterIconBtn}>
                        <MaterialIcons name="delete" size={20} color="#D43B3B" />
                    </TouchableOpacity>
                </View>
            </View>

            {chapter?.chapterContent && (
                <View style={styles.chapterContentContainer}>
                    <Text style={styles.chapterContent} numberOfLines={isExpanded ? undefined : 10}>
                        {chapter?.chapterContent}
                    </Text>
                    {chapter?.chapterContent && chapter.chapterContent.length > 500 && (
                        <TouchableOpacity 
                            style={styles.expandButton}
                            onPress={() => setIsExpanded(!isExpanded)}
                        >
                            <Text style={styles.expandButtonText}>
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </Text>
                            <MaterialIcons 
                                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                size={20} 
                                color={colors.gold} 
                            />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
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
const AdminEditBook = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const { bookId } = route.params || {};

    const { booksDatabase, chapterDatabase } = useSelector(state => state.books);
    const safeBooksDatabase = Array.isArray(booksDatabase) ? booksDatabase : [];
    const book = safeBooksDatabase.find(b => 
        b && (
            b.bookId === bookId || 
            b.id === bookId || 
            String(b.bookId) === String(bookId) ||
            String(b.id) === String(bookId)
        )
    );

    // Get chapters for this book
    const safeChapterDatabase = Array.isArray(chapterDatabase) ? chapterDatabase : [];
    const bookChapters = safeChapterDatabase
        .filter(ch => 
            ch.bookId === bookId || 
            ch.bookId === book?.bookId || 
            ch.bookId === book?.id ||
            String(ch.bookId) === String(bookId) ||
            String(ch.bookId) === String(book?.bookId) ||
            String(ch.bookId) === String(book?.id)
        )
        .sort((a, b) => {
            // Sort by chapter number if available, otherwise by index
            const aNum = a.chapterNumber || a.chapterNum || 0;
            const bNum = b.chapterNumber || b.chapterNum || 0;
            return aNum - bNum;
        });

    if (!book) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.white }}>Không tìm thấy sách</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView overScrollMode="never" bounces={false}>
                <ScreenTitle title="LIBRARY" icon="person" />

                {/* Book Card */}
                <View style={styles.bookCard}>
                    <Filigree4 customBottomPosition={-10} customLeftPosition={-25} customOpacity={0.06} />

                    <LinearGradient
                        colors={[colors.black, 'transparent']}
                        style={[globalStyles.shadow, styles.gradient]}
                    />

                    <View style={styles.coverWrapper}>
                        <Image 
                            source={book?.cover ? { uri: book.cover } : require('../assets/icon.png')} 
                            style={styles.cover} 
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.infoWrapper}>
                        <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                            {book?.title || "Untitled"}
                        </Text>

                        <View style={styles.row}>
                            <MaterialIcons name="create" color={colors.white} size={16} />
                            <Text style={styles.text}>{book?.author || "Unknown"}</Text>
                        </View>

                        <View style={[styles.row, { marginTop: 6 }]}>
                            <MaterialIcons name="collections-bookmark" color={colors.white} size={16} />
                            <Text style={styles.text}>{book?.series || ""}</Text>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsRow}>
                            <View style={styles.statBlock}>
                                <Text style={styles.statNum}>
                                    {formatCompactNumber(bookChapters.length || book?.totalChapter || book?.totalPage || 0)}
                                </Text>
                                <Text style={styles.statLabel}>Chương</Text>
                            </View>
                            <View style={styles.statBlock}>
                                <Text style={styles.statNum}>
                                    {formatCompactNumber(book?.totalView || book?.readCount || 0)}
                                </Text>
                                <Text style={styles.statLabel}>Lượt Xem</Text>
                            </View>
                            <View style={styles.statBlock}>
                                <Text style={styles.statNum}>
                                    {formatCompactNumber(book?.totalLike || 0)}
                                </Text>
                                <Text style={styles.statLabel}>Lượt Thích</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <View style={styles.actionBtn}>
                        <TouchableOpacity onPress={() => {}}>
                            <DecoButton ButtonText="DUYỆT" ButtonIcon={false} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionBtn}>
                        <TouchableOpacity onPress={() => {}}>
                            <DecoButton ButtonText="XÓA" ButtonIcon={false} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Chapters List */}
                <View style={styles.chapterHeader}>
                    <Text style={styles.chapterTitle}>DANH SÁCH CHƯƠNG</Text>
                    <Text style={styles.chapterCount}>[{bookChapters.length}]</Text>
                </View>

                <View style={styles.chapterList}>
                    {bookChapters.length > 0 ? (
                        bookChapters.map((chapter, index) => (
                            <ChapterItem 
                                key={chapter?.chapterId || `chapter-${index}`} 
                                chapter={chapter} 
                                index={index} 
                            />
                        ))
                    ) : (
                        <View style={styles.noChapters}>
                            <Text style={styles.noChaptersText}>Chưa có chương nào</Text>
                        </View>
                    )}
                </View>

                <View style={globalStyles.bottomPadding} />
            </ScrollView>

            <AdminFooter currentScreen={2} />
        </View>
    );
};

export default AdminEditBook;

// ---------------------- STYLES ---------------------- //
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: 'center',
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black,
    },

    // Book Card
    bookCard: {
        width: '100%',
        maxWidth: 340,
        height: 150,
        backgroundColor: colors.gray,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        overflow: 'hidden',
        borderTopWidth: 2,
        borderColor: '#333',
        borderWidth: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 70,
        opacity: 0.3,
    },
    coverWrapper: {
        width: 90,
        height: 130,
        backgroundColor: '#fff',
        marginLeft: 15,
        marginTop: 10,
        borderRadius: 6,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cover: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    infoWrapper: {
        flex: 1,
        paddingLeft: 18,
        paddingVertical: 18,
        justifyContent: 'space-between',
    },
    bookTitle: {
        color: colors.gold,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    text: {
        color: colors.white,
        marginLeft: 8,
        fontSize: 13,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingRight: 10,
        width: '100%',
    },
    statBlock: {
        alignItems: 'center',
        flex: 1,
    },
    statNum: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 15,
    },
    statLabel: {
        color: '#bbb',
        fontSize: 11,
        marginTop: 3,
    },

    // Action Buttons
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
        paddingHorizontal: 15,
    },
    actionBtn: {
        width: 110,
        marginHorizontal: 12,
        overflow: 'hidden',
        borderRadius: 16.5,
    },


    // Chapter Header
    chapterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 15,
    },
    chapterTitle: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    chapterCount: {
        color: colors.gold,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    // Chapter List
    chapterList: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    chapterItem: {
        width: '100%',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#1a1a1a',
    },
    chapterHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    chapterInfo: {
        flex: 1,
    },
    chapterName: {
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold',
    },
    chapterContentContainer: {
        marginTop: 8,
    },
    chapterContent: {
        color: colors.white,
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'justify',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 8,
    },
    expandButtonText: {
        color: colors.gold,
        fontSize: 13,
        marginRight: 5,
    },
    chapterBtns: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    chapterIconBtn: {
        padding: 5,
    },
    noChapters: {
        padding: 20,
        alignItems: 'center',
    },
    noChaptersText: {
        color: '#999',
        fontSize: 14,
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
