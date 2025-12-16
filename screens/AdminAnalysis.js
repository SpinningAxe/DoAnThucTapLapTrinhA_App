import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { colors, globalStyles, bookCover } from '../components/GlobalStyle';
import AppHeader from '../components/AppHeader';
import ScreenTitle from '../components/ScreenTitle';
// import ScreenSubTitle from '../components/ScreenSubTitle'; // Component không tồn tại
import { Filigree4 } from '../components/decorations/Filigree';

const { width } = Dimensions.get('window');

// ---------------------- FORMAT NUMBER ---------------------- //
const formatCompactNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) return 'Invalid';
    if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(1) + 'B';
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
    return number.toString();
};

// ---------------------- OVERALL VIEWS GRAPH ---------------------- //
const OverallViewsGraph = () => {
    const [tab, setTab] = useState("Week");
    
    // Sample data for the graph
    const weekData = [200, 800, 500, 1200, 900, 1500, 1100];
    const monthData = [500, 1200, 800, 1500, 1000, 1800, 1300, 2000, 1500, 2200, 1800, 2500];
    const yearData = [1000, 2000, 1500, 3000, 2500, 4000, 3500, 5000, 4500, 6000, 5500, 7000];
    
    const getData = () => {
        if (tab === "Week") return weekData;
        if (tab === "Month") return monthData;
        return yearData;
    };

    const data = getData();
    const graphWidth = width - 80;
    const graphHeight = 180;
    const safeData = Array.isArray(data) ? data : [];
    const maxValue = safeData.length > 0 ? Math.max(...safeData, 1) : 1;
    const padding = 30;

    const points = safeData.map((val, idx) => {
        const x = padding + (idx / Math.max(safeData.length - 1, 1)) * (graphWidth - 2 * padding);
        const y = graphHeight - padding - (val / maxValue) * (graphHeight - 2 * padding);
        return { x, y, val };
    });

    const getXAxisLabels = () => {
        if (tab === "Week") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        if (tab === "Month") return safeData.map((_, i) => `W${i + 1}`);
        return safeData.map((_, i) => `${i + 1}`);
    };

    const yAxisLabels = [];
    const yAxisSteps = 5;
    for (let i = 0; i <= yAxisSteps; i++) {
        const value = Math.round((maxValue / yAxisSteps) * i);
        yAxisLabels.push(value);
    }

    return (
        <View style={styles.overallViewsContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>OVERALL VIEWS</Text>
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
                    
                    {/* Data line */}
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
                    {getXAxisLabels().map((label, idx) => (
                        <Text key={idx} style={styles.xAxisLabel}>
                            {label}
                        </Text>
                    ))}
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
const TopBookItem = ({ book, index }) => {
    const trendData = [10, 20, 15, 25, 20, 30, 25];
    
    if (!book) return null;
    
    // Use default icon if bookCover is not available
    const bookCoverSource = require('../assets/icon.png');
    
    return (
        <View style={styles.topBookItem}>
            <Filigree4 customBottomPosition={-5} customLeftPosition={-25} customOpacity={0.05} />
            
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, { opacity: 0.2, borderRadius: 8 }]}
            />

            <Image
                source={bookCoverSource}
                style={styles.bookThumbnail}
                resizeMode="cover"
            />

            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={1} ellipsizeMode="tail">
                    {book?.title || "Untitled"}
                </Text>
                <Text style={styles.bookAuthor}>{book?.author || "Unknown"}</Text>
                <Text style={styles.bookViews}>
                    {formatCompactNumber(book?.totalView || book?.readCount || 0)} Views
                </Text>
            </View>

            <MiniGraph data={trendData} />
        </View>
    );
};

// ---------------------- TOP BOOKS SECTION ---------------------- //
const TopBooksSection = () => {
    const [tab, setTab] = useState("Week");
    const { booksDatabase } = useSelector((state) => state.books);
    const bookDatabase = booksDatabase || [];
    
    // Sort by views and take top 10
    const safeBookDatabase = Array.isArray(bookDatabase) ? bookDatabase : [];
    const topBooks = [...safeBookDatabase]
        .filter(book => book != null)
        .sort((a, b) => ((b?.totalView || b?.readCount || 0) - (a?.totalView || a?.readCount || 0)))
        .slice(0, 10);

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>TOP BOOKS</Text>
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

            <View style={styles.listContainer}>
                <FlatList
                    data={topBooks}
                    keyExtractor={(item, index) => item?.id?.toString() || item?.bookId || item?.title || `book-${index}`}
                    renderItem={({ item, index }) => {
                        if (!item) return null;
                        return <TopBookItem book={item} index={index} />;
                    }}
                    scrollEnabled={false}
                />
            </View>
        </View>
    );
};

// ---------------------- TOP USER ITEM ---------------------- //
const TopUserItem = ({ user, index }) => {
    const trendData = [5, 15, 10, 20, 15, 25, 20];
    
    if (!user) return null;
    
    return (
        <View style={styles.topUserItem}>
            <Filigree4 customBottomPosition={-5} customLeftPosition={-25} customOpacity={0.05} />
            
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, { opacity: 0.2, borderRadius: 8 }]}
            />

            <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || `User ${index + 1}`}</Text>
                <Text style={styles.userActivity}>
                    {user?.bookCount || 120} Books
                </Text>
            </View>

            <MiniGraph data={trendData} />
        </View>
    );
};

// ---------------------- TOP USERS SECTION ---------------------- //
const TopUsersSection = () => {
    const [tab, setTab] = useState("Week");
    
    // Sample user data (since we don't have users in Redux)
    const sampleUsers = [
        { name: "John Doe", bookCount: 120 },
        { name: "Jane Smith", bookCount: 95 },
        { name: "Bob Johnson", bookCount: 87 },
        { name: "Alice Brown", bookCount: 76 },
        { name: "Charlie Wilson", bookCount: 65 },
    ];

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>TOP USERS</Text>
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

            <View style={styles.listContainer}>
                <FlatList
                    data={sampleUsers}
                    keyExtractor={(item, index) => item?.name || `user-${index}`}
                    renderItem={({ item, index }) => {
                        if (!item) return null;
                        return <TopUserItem user={item} index={index} />;
                    }}
                    scrollEnabled={false}
                />
            </View>
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
const AdminAnalysisScreen = () => {
    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView bounces={false} overScrollMode="never">
                <ScreenTitle title="ANALYTICS" icon="person" />

                {/* Overall Views Graph */}
                <View style={styles.sectionWrapper}>
                    <OverallViewsGraph />
                </View>

                {/* Top Books Section */}
                <View style={styles.sectionWrapper}>
                    <TopBooksSection />
                </View>

                {/* Top Users Section */}
                <View style={styles.sectionWrapper}>
                    <TopUsersSection />
                </View>

                <View style={globalStyles.bottomPadding} />
            </ScrollView>

            <AdminFooter currentScreen={1} />
        </View>
    );
};

export default AdminAnalysisScreen;

// ---------------------- STYLES ---------------------- //
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.black,
    },

    sectionWrapper: {
        width: '100%',
        paddingHorizontal: 12,
        marginBottom: 25,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        color: colors.white,
        fontSize: 17,
        fontWeight: 'bold',
    },
    tabRow: {
        flexDirection: 'row',
    },
    tabText: {
        color: '#777',
        paddingHorizontal: 8,
        fontSize: 12,
    },
    tabActive: {
        color: colors.gold,
        fontWeight: 'bold',
    },

    // Overall Views Graph
    overallViewsContainer: {
        width: '100%',
    },
    graphCard: {
        backgroundColor: colors.gray,
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
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

    // Mini Graph
    miniGraphContainer: {
        marginLeft: 'auto',
    },

    // Top Books Section
    sectionContainer: {
        width: '100%',
    },
    listContainer: {
        width: '100%',
    },

    // Top Book Item
    topBookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    bookThumbnail: {
        width: 50,
        height: 70,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    bookInfo: {
        flex: 1,
        marginLeft: 12,
    },
    bookTitle: {
        color: colors.gold,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bookAuthor: {
        color: colors.white,
        fontSize: 12,
        marginBottom: 4,
    },
    bookViews: {
        color: '#bbb',
        fontSize: 11,
    },

    // Top User Item
    topUserItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.gold,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatarText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userActivity: {
        color: '#bbb',
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
