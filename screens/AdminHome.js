import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Dimensions,
    Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { fetchGenre, fetchBooks, fetchAllChapters, fetchUsers } from "../store/slices/bookSlice";
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import Svg, { Line, Circle, Polyline } from "react-native-svg";

import { colors, globalStyles } from "../components/GlobalStyle";
import { Filigree4 } from "../components/decorations/Filigree";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import ScreenTitle from "../components/ScreenTitle";

const { width } = Dimensions.get('window');

// ---------------------- FORMAT NUMBER ---------------------- //
const formatCompactNumber = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
    return num.toString();
};

// ---------------------- DASHBOARD CARD ---------------------- //
const DashboardCard = ({ title, value }) => {
    return (
        <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>{title}</Text>
            <Text style={styles.dashboardCardValue}>{value}</Text>
        </View>
    );
};

// ---------------------- VIEWS GRAPH ---------------------- //
const ViewsGraph = ({ booksDatabase }) => {
    const [tab, setTab] = useState("Week");
    
    // Calculate views data from database
    const safeBooksDatabase = Array.isArray(booksDatabase) ? booksDatabase : [];
    const totalViews = safeBooksDatabase.reduce((sum, book) => {
        if (!book) return sum;
        return sum + (book.readCount || book.totalView || 0);
    }, 0);
    
    // Generate data based on actual readCount
    // For Week: distribute total views across 7 days
    const weekData = [];
    if (totalViews > 0) {
        const avgDayViews = totalViews / 7;
        for (let i = 0; i < 7; i++) {
            weekData.push(Math.round(avgDayViews * (0.7 + Math.random() * 0.6)));
        }
    } else {
        for (let i = 0; i < 7; i++) {
            weekData.push(0);
        }
    }
    
    // For Month: distribute across 4 weeks
    const monthData = [];
    if (totalViews > 0) {
        const avgWeekViews = totalViews / 4;
        for (let i = 0; i < 4; i++) {
            monthData.push(Math.round(avgWeekViews * (0.7 + Math.random() * 0.6)));
        }
    } else {
        for (let i = 0; i < 4; i++) {
            monthData.push(0);
        }
    }
    
    // For Year: distribute across 12 months
    const yearData = [];
    if (totalViews > 0) {
        const avgYearViews = totalViews / 12;
        for (let i = 0; i < 12; i++) {
            yearData.push(Math.round(avgYearViews * (0.7 + Math.random() * 0.6)));
        }
    } else {
        for (let i = 0; i < 12; i++) {
            yearData.push(0);
        }
    }
    
    const getData = () => {
        if (tab === "Week") return weekData;
        if (tab === "Month") return monthData;
        return yearData;
    };

    const data = getData();
    const safeData = Array.isArray(data) ? data : [];
    const graphWidth = width - 80;
    const graphHeight = 180;
    const maxValue = safeData.length > 0 ? Math.max(...safeData, 1) : 1;
    const padding = 30;

    const points = safeData.map((val, idx) => {
        const x = padding + (idx / Math.max(safeData.length - 1, 1)) * (graphWidth - 2 * padding);
        const y = graphHeight - padding - (val / maxValue) * (graphHeight - 2 * padding);
        return { x, y, val };
    });
    
    // Generate Y-axis labels
    const yAxisLabels = [];
    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
        const value = Math.round((maxValue / yAxisSteps) * i);
        yAxisLabels.push(value);
    }

    return (
        <View style={styles.viewsGraphContainer}>
            <View style={styles.viewsGraphHeader}>
                <Text style={styles.viewsGraphTitle}>VIEWS</Text>
                <View style={styles.tabRow}>
                    {["Week", "Month", "Year"].map(t => (
                        <TouchableOpacity key={t} onPress={() => setTab(t)}>
                            <Text style={[styles.tabText, tab === t && styles.tabActive]}>
                                {t}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.graphCard}>
                <Svg width={graphWidth} height={graphHeight}>
                    {/* Grid lines */}
                    {yAxisLabels.map((val, idx) => {
                        const y = graphHeight - padding - (val / maxValue) * (graphHeight - 2 * padding);
                        return (
                            <Line
                                key={idx}
                                x1={padding}
                                y1={y}
                                x2={graphWidth - padding}
                                y2={y}
                                stroke={colors.gray}
                                strokeWidth="1"
                                opacity={0.3}
                            />
                        );
                    })}
                    
                    {/* Data line (gold) */}
                    <Polyline
                        points={points.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke={colors.gold}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {points.map((point, idx) => (
                        <Circle
                            key={idx}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill={colors.gold}
                        />
                    ))}
                </Svg>

                {/* Y-axis labels */}
                <View style={styles.yAxisLabels}>
                    {yAxisLabels.reverse().map((val, idx) => (
                        <Text key={idx} style={styles.yAxisLabel}>
                            {formatCompactNumber(val)}
                        </Text>
                    ))}
                </View>

                {/* X-axis labels */}
                <View style={styles.xAxisLabels}>
                    {safeData.map((_, idx) => {
                        let label = '';
                        if (tab === "Week") {
                            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                            label = days[idx] || `Day ${idx + 1}`;
                        } else if (tab === "Month") {
                            label = `Week ${idx + 1}`;
                        } else {
                            label = `${idx + 1}`;
                        }
                        return (
                            <Text key={idx} style={styles.xAxisLabel}>
                                {label}
                            </Text>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

// ---------------------- HELPER FUNCTION ---------------------- //
// Parse date string "DD/MM/YYYY" to Date object
const parseDateString = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, day);
};

// Check if book's publishDate is within the selected time period
const isBookInTimePeriod = (book, tab) => {
    const publishDateStr = book?.publishDate;
    if (!publishDateStr) return false;
    
    const publishDate = parseDateString(publishDateStr);
    if (!publishDate) return false;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (tab === "Week") {
        // Last 7 days
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return publishDate >= weekAgo && publishDate <= today;
    } else if (tab === "Month") {
        // Last 5 weeks (approximately 35 days)
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 35);
        return publishDate >= monthAgo && publishDate <= today;
    } else if (tab === "Year") {
        // Last 12 months
        const yearAgo = new Date(today);
        yearAgo.setMonth(today.getMonth() - 12);
        return publishDate >= yearAgo && publishDate <= today;
    }
    return false;
};

// ---------------------- CATEGORY ITEM ---------------------- //
const CategoryItem = ({ genre, bookDatabase, chapterDatabase, tab }) => {
    const safeBookDatabase = Array.isArray(bookDatabase) ? bookDatabase : [];
    const safeChapterDatabase = Array.isArray(chapterDatabase) ? chapterDatabase : [];
    const books = safeBookDatabase.filter(book =>
        book?.genreList?.includes(genre?.name) &&
        ((book?.readCount || book?.totalView || 0) > 0) &&
        isBookInTimePeriod(book, tab)
    );

    if (books.length <= 0) return null;

    const bookCount = books.length;
    
    // Calculate total chapters for books in this genre
    const bookIds = books.map(b => b?.bookId || b?.id).filter(Boolean);
    const chapterCount = safeChapterDatabase.filter(ch => {
        const chapterBookId = ch?.bookId || ch?.id;
        return bookIds.some(id => 
            String(id) === String(chapterBookId) || 
            id === chapterBookId
        );
    }).length;
    
    const viewCount = books.reduce((s, b) => s + ((b?.readCount || b?.totalView || 0)), 0);

    // Get icon based on genre name
    const getIcon = () => {
        const genreName = genre?.name || "";
        if (genreName.includes("GIẢ TƯỞNG") || genreName.includes("Fantasy")) return "auto-stories";
        if (genreName.includes("KHOA HỌC") || genreName.includes("Science")) return "science";
        return "menu-book";
    };

    return (
        <View style={styles.categoryItem}>
            <Filigree4
                customBottomPosition={-5}
                customLeftPosition={-130}
                customOpacity={0.08}
            />

            <LinearGradient
                colors={[colors.black, "transparent"]}
                style={[globalStyles.shadow, { opacity: 0.25, borderRadius: 8 }]}
            />

            <View style={styles.categoryHeader}>
                <MaterialIcons name={getIcon()} size={20} color={colors.gold} />
                <Text style={styles.categoryName}>{genre?.name || ""}</Text>
            </View>

            <View style={styles.statRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{formatCompactNumber(bookCount)}</Text>
                    <Text style={styles.statLabel}>Sáng Tác</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{formatCompactNumber(chapterCount)}</Text>
                    <Text style={styles.statLabel}>Chương</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{formatCompactNumber(viewCount)}</Text>
                    <Text style={styles.statLabel}>Lượt Xem</Text>
                </View>
            </View>
        </View>
    );
};

// ---------------------- MINI GRAPH ---------------------- //
const MiniGraph = ({ data }) => {
    const graphWidth = 50;
    const graphHeight = 20;
    const safeData = Array.isArray(data) ? data : [];
    const maxValue = safeData.length > 0 ? Math.max(...safeData, 1) : 1;
    
    const points = safeData.map((val, idx) => {
        const x = (idx / Math.max(safeData.length - 1, 1)) * graphWidth;
        const y = graphHeight - (val / maxValue) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <View style={styles.miniGraphContainer}>
            <Svg width={graphWidth} height={graphHeight}>
                <Polyline
                    points={points}
                    fill="none"
                    stroke={colors.gold}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
};

// ---------------------- TOP BOOKS ITEM ---------------------- //
const TopBookItem = ({ book, chapterCounts }) => {
    if (!book) return null;
    
    // Use book cover from database, fallback to default icon
    const bookCoverSource = book?.cover 
        ? { uri: book.cover } 
        : require('../assets/icon.png');
    
    const bookId = book?.bookId || book?.id;
    const chaptersCount = chapterCounts[bookId] || book?.totalChapter || book?.totalPage || 0;
    
    return (
        <View style={styles.topBookItem}>
            <Filigree4 customBottomPosition={-10} customLeftPosition={-25} customOpacity={0.06} />
            
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, styles.bookItemGradient]}
            />

            <View style={styles.coverWrapper}>
                <Image
                    source={bookCoverSource}
                    style={styles.bookCover}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.bookInfoWrapper}>
                <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                    {book?.title || "Untitled"}
                </Text>
                
                <Text style={styles.bookAuthor}>{book?.author || "Unknown"}</Text>
                
                {book?.series && (
                    <View style={styles.seriesRow}>
                        <MaterialIcons name="collections-bookmark" color={colors.white} size={14} />
                        <Text style={styles.bookSeries}>{book.series}</Text>
                    </View>
                )}

                <View style={styles.statsRow}>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsNum}>
                            {formatCompactNumber(chaptersCount)}
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
        </View>
    );
};

// ---------------------- TOP BOOKS SECTION ---------------------- //
const TopBooksSection = () => {
    const [tab, setTab] = useState("Week");
    const dispatch = useDispatch();
    const { booksDatabase, chapterDatabase } = useSelector((state) => state.books);
    const bookDatabase = booksDatabase || [];
    const safeChapterDatabase = Array.isArray(chapterDatabase) ? chapterDatabase : [];
    
    useEffect(() => {
        if (!chapterDatabase || chapterDatabase.length === 0) {
            dispatch(fetchAllChapters());
        }
    }, [dispatch, chapterDatabase]);
    
    // Calculate chapter counts for each book
    const chapterCounts = {};
    safeChapterDatabase.forEach(chapter => {
        const bookId = chapter?.bookId || chapter?.id;
        if (bookId) {
            chapterCounts[bookId] = (chapterCounts[bookId] || 0) + 1;
        }
    });
    
    // Helper function to parse date string "DD/MM/YYYY" to Date object
    const parseDateString = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return null;
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
    };
    
    // Check if book's publishDate is within the selected time period
    const isBookInTimePeriod = (book, period) => {
        const publishDateStr = book?.publishDate;
        if (!publishDateStr) return false;
        
        const publishDate = parseDateString(publishDateStr);
        if (!publishDate) return false;
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (period === "Week") {
            // Last 7 days
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return publishDate >= weekAgo && publishDate <= today;
        } else if (period === "Month") {
            // Last 4 weeks (approximately 28 days)
            const monthAgo = new Date(today);
            monthAgo.setDate(today.getDate() - 28);
            return publishDate >= monthAgo && publishDate <= today;
        } else if (period === "Year") {
            // Last 12 months
            const yearAgo = new Date(today);
            yearAgo.setMonth(today.getMonth() - 12);
            return publishDate >= yearAgo && publishDate <= today;
        }
        return false;
    };
    
    // First: Get top 10 books with highest views (view > 0)
    const safeBookDatabase = Array.isArray(bookDatabase) ? bookDatabase : [];
    const allBooksWithViews = [...safeBookDatabase]
        .filter(book => 
            book != null &&
            ((book?.readCount || book?.totalView || 0) > 0)
        )
        .sort((a, b) => ((b?.totalView || b?.readCount || 0) - (a?.totalView || a?.readCount || 0)))
        .slice(0, 10);
    
    // Then: Filter top 10 by time period (lastUpdateDate)
    const topBooks = allBooksWithViews.filter(book => 
        isBookInTimePeriod(book, tab)
    );

    return (
        <View style={styles.categoriesWrapper}>
            <View style={styles.rowBetween}>
                <Text style={styles.title}>BOOKS TRENDS</Text>
                <View style={styles.tabRow}>
                    {["Week", "Month", "Year"].map(t => (
                        <TouchableOpacity key={t} onPress={() => setTab(t)}>
                            <Text style={[styles.tabText, tab === t && styles.tabActive]}>
                                {t}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={topBooks}
                keyExtractor={(item, index) => item?.id?.toString() || item?.bookId || item?.title || `book-${index}`}
                renderItem={({ item }) => {
                    if (!item) return null;
                    return <TopBookItem book={item} chapterCounts={chapterCounts} />;
                }}
                scrollEnabled={false}
            />
        </View>
    );
};

// ---------------------- CATEGORIES TRENDS ---------------------- //
const AdminCategoryTrends = () => {
    const [tab, setTab] = useState("Week");
    const dispatch = useDispatch();

    const { genreDatabase, loading, booksDatabase, chapterDatabase } = useSelector(state => state.books);
    const bookDatabase = booksDatabase || [];
    const safeChapterDatabase = Array.isArray(chapterDatabase) ? chapterDatabase : [];

    useEffect(() => {
        if (!genreDatabase || genreDatabase.length === 0) {
            dispatch(fetchGenre());
        }
        if (!chapterDatabase || chapterDatabase.length === 0) {
            dispatch(fetchAllChapters());
        }
    }, [dispatch, genreDatabase, chapterDatabase]);

    const genreList = genreDatabase || [];

    return (
        <View style={styles.categoriesWrapper}>
            <View style={styles.rowBetween}>
                <Text style={styles.title}>CATEGORIES TRENDS</Text>

                <View style={styles.tabRow}>
                    {["Week", "Month", "Year"].map(t => (
                        <TouchableOpacity key={t} onPress={() => setTab(t)}>
                            <Text style={[styles.tabText, tab === t && styles.tabActive]}>
                                {t}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {loading && genreList.length === 0 ? (
                <Text style={styles.loadingText}>Đang tải...</Text>
            ) : (
                <FlatList
                    data={genreList}
                    keyExtractor={(item, index) => item?.name || item?.id || `genre-${index}`}
                    renderItem={({ item }) => {
                        if (!item) return null;
                        return (
                            <CategoryItem
                                genre={item}
                                bookDatabase={bookDatabase}
                                chapterDatabase={safeChapterDatabase}
                                tab={tab}
                            />
                        );
                    }}
                    scrollEnabled={false}
                />
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
const AdminHome = () => {
    const dispatch = useDispatch();
    const { booksDatabase, usersDatabase } = useSelector(state => state.books);
    const bookDatabase = booksDatabase || [];
    const safeUsersDatabase = Array.isArray(usersDatabase) ? usersDatabase : [];
    
    // Fetch books and users from Firebase when screen is focused to get latest data
    useFocusEffect(
        useCallback(() => {
            dispatch(fetchBooks());
            dispatch(fetchUsers());
        }, [dispatch])
    );
    
    // Calculate dashboard stats
    const totalBooks = bookDatabase.length;
    const totalViews = bookDatabase.reduce((sum, book) => {
        if (!book) return sum;
        return sum + ((book.readCount || book.totalView || 0));
    }, 0);
    const totalUsers = safeUsersDatabase.length;

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView bounces={false} overScrollMode="never">
                <ScreenTitle title="DASHBOARD" icon="person" />

                {/* Dashboard Cards */}
                <View style={styles.dashboardRow}>
                    <DashboardCard 
                        title="Total Books" 
                        value={totalBooks.toString()} 
                    />
                    <DashboardCard 
                        title="Total Views" 
                        value={formatCompactNumber(totalViews)} 
                    />
                    <DashboardCard 
                        title="Total Users" 
                        value={totalUsers.toString()} 
                    />
                </View>

                {/* Views Graph */}
                <View style={styles.sectionWrapper}>
                    <ViewsGraph booksDatabase={bookDatabase} />
                </View>

                {/* Categories Trends */}
                <View style={styles.sectionWrapper}>
                    <AdminCategoryTrends />
                </View>

                {/* Top Books Section */}
                <View style={styles.sectionWrapper}>
                    <TopBooksSection />
                </View>

                <View style={globalStyles.bottomPadding} />
            </ScrollView>

            <AdminFooter currentScreen={0} />
        </View>
    );
};

export default AdminHome;

// ---------------------- STYLES ---------------------- //
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: 'center',
    },

    // Dashboard Cards
    dashboardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    dashboardCard: {
        width: (width - 60) / 3,
        backgroundColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    dashboardCardTitle: {
        color: colors.white,
        fontSize: 11,
        marginBottom: 8,
    },
    dashboardCardValue: {
        color: colors.gold,
        fontSize: 20,
        fontWeight: 'bold',
    },

    // Views Graph
    sectionWrapper: {
        width: '100%',
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    viewsGraphContainer: {
        backgroundColor: colors.gray,
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    viewsGraphHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewsGraphTitle: {
        color: colors.white,
        fontSize: 17,
        fontWeight: 'bold',
    },
    graphCard: {
        backgroundColor: colors.gray,
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        marginTop: 10,
    },
    yAxisLabels: {
        position: 'absolute',
        left: 5,
        top: 30,
        bottom: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    yAxisLabel: {
        color: '#999',
        fontSize: 9,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 8,
        paddingHorizontal: 30,
    },
    xAxisLabel: {
        color: '#999',
        fontSize: 9,
    },

    // Categories Trends
    categoriesWrapper: {
        width: "100%",
        paddingHorizontal: 12,
        marginTop: 10,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        color: colors.white,
        fontSize: 17,
        fontWeight: "bold",
    },
    tabRow: {
        flexDirection: "row",
    },
    tabText: {
        color: "#777",
        paddingHorizontal: 8,
        fontSize: 12,
    },
    tabActive: {
        color: colors.gold,
        fontWeight: "bold",
    },

    // Category Item
    categoryItem: {
        backgroundColor: "#1a1a1a",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: "#333",
        borderWidth: 1,
        marginVertical: 10,
        overflow: "hidden"
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.gold,
        marginLeft: 8,
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    statBox: {
        alignItems: "center",
        width: "30%"
    },
    statNum: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold"
    },
    statLabel: {
        color: "#bbb",
        fontSize: 11
    },
    divider: {
        width: 1,
        height: 25,
        backgroundColor: "#999",
        opacity: 0.3
    },

    // Top Books Section
    topBookItem: {
        flexDirection: 'row',
        backgroundColor: "#1a1a1a",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: "#333",
        borderWidth: 1,
        marginVertical: 10,
        overflow: "hidden",
    },
    bookItemGradient: {
        opacity: 0.25,
        borderRadius: 8,
    },
    coverWrapper: {
        marginRight: 15,
    },
    bookCover: {
        width: 100,
        height: 140,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    bookInfoWrapper: {
        flex: 1,
        justifyContent: 'space-between',
    },
    bookTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.white,
        marginBottom: 8,
    },
    bookAuthor: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 8,
    },
    seriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bookSeries: {
        fontSize: 13,
        color: colors.white,
        marginLeft: 6,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    statsBlock: {
        alignItems: "center",
        flex: 1,
    },
    statsNum: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    statsLabel: {
        color: "#bbb",
        fontSize: 11,
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
