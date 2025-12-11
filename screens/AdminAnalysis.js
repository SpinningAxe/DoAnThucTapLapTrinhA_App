import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/slices/bookSlice';
import { useFocusEffect } from '@react-navigation/native';

import { colors, globalStyles } from '../components/GlobalStyle';
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
const OverallViewsGraph = ({ booksDatabase, tab, onTabChange }) => {
    
    // Calculate total views from database
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
    
    // For Month: distribute across 5 weeks
    const monthData = [];
    if (totalViews > 0) {
        const avgWeekViews = totalViews / 5;
        for (let i = 0; i < 5; i++) {
            monthData.push(Math.round(avgWeekViews * (0.7 + Math.random() * 0.6)));
        }
    } else {
        for (let i = 0; i < 5; i++) {
            monthData.push(0);
        }
    }
    
    // For Year: distribute across 12 months
    const yearData = [];
    if (totalViews > 0) {
        const avgMonthViews = totalViews / 12;
        for (let i = 0; i < 12; i++) {
            yearData.push(Math.round(avgMonthViews * (0.7 + Math.random() * 0.6)));
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
                        <TouchableOpacity key={t} onPress={() => onTabChange(t)}>
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

// ---------------------- USERS GRAPH ---------------------- //
const UsersGraph = ({ usersDatabase, tab, onTabChange }) => {
    // Calculate total users from database
    const safeUsersDatabase = Array.isArray(usersDatabase) ? usersDatabase : [];
    const totalUsers = safeUsersDatabase.length;
    
    // Helper function to parse date string "DD/MM/YYYY" to Date object
    const parseDateString = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return null;
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
    };
    
    // Helper to get user creation date (handle both Timestamp and string)
    const getUserCreationDate = (user) => {
        // Try Timestamp first (Firestore Timestamp) - in case data hasn't been converted yet
        if (user?.createdAt?.toDate) {
            return user.createdAt.toDate();
        }
        if (user?.createdDate?.toDate) {
            return user.createdDate.toDate();
        }
        if (user?.registrationDate?.toDate) {
            return user.registrationDate.toDate();
        }
        if (user?.created_at?.toDate) {
            return user.created_at.toDate();
        }
        
        // Try string format "DD/MM/YYYY" (after conversion from Timestamp)
        const userDateStr = user?.createdAt || user?.createdDate || user?.registrationDate || user?.created_at;
        if (userDateStr && typeof userDateStr === 'string') {
            const parsed = parseDateString(userDateStr);
            if (parsed) return parsed;
        }
        
        return null;
    };
    
    // Count users created in each time period
    const countUsersByPeriod = (period) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const counts = [];
        
        if (period === "Week") {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const count = safeUsersDatabase.filter(user => {
                    const userDate = getUserCreationDate(user);
                    if (!userDate) return false;
                    const userDateOnly = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
                    return userDateOnly.getTime() === date.getTime();
                }).length;
                counts.push(count);
            }
        } else if (period === "Month") {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - (i * 7 + 6));
                const weekEnd = new Date(today);
                weekEnd.setDate(today.getDate() - (i * 7));
                const count = safeUsersDatabase.filter(user => {
                    const userDate = getUserCreationDate(user);
                    if (!userDate) return false;
                    const userDateOnly = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
                    return userDateOnly >= weekStart && userDateOnly <= weekEnd;
                }).length;
                counts.push(count);
            }
        } else {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
                const count = safeUsersDatabase.filter(user => {
                    const userDate = getUserCreationDate(user);
                    if (!userDate) return false;
                    const userDateOnly = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
                    return userDateOnly >= monthStart && userDateOnly <= monthEnd;
                }).length;
                counts.push(count);
            }
        }
        
        return counts;
    };
    
    // Generate data based on actual user registration dates
    const weekData = countUsersByPeriod("Week");
    const monthData = countUsersByPeriod("Month");
    const yearData = countUsersByPeriod("Year");
    
    // If no date data, distribute evenly
    const weekDataFinal = weekData.length === 7 ? weekData : Array(7).fill(0);
    const monthDataFinal = monthData.length === 4 ? monthData : Array(4).fill(0);
    const yearDataFinal = yearData.length === 12 ? yearData : Array(12).fill(0);
    
    const getData = () => {
        if (tab === "Week") return weekDataFinal;
        if (tab === "Month") return monthDataFinal;
        return yearDataFinal;
    };

    const data = getData();
    const graphWidth = width - 80;
    const graphHeight = 180;
    const safeData = Array.isArray(data) ? data : [];
    const maxValue = safeData.length > 0 ? Math.max(...safeData, 100) : 100; // Max 100 for Y-axis
    const padding = 30;

    const points1 = safeData.map((val, idx) => {
        const x = padding + (idx / Math.max(safeData.length - 1, 1)) * (graphWidth - 2 * padding);
        const y = graphHeight - padding - (val / maxValue) * (graphHeight - 2 * padding);
        return { x, y, val };
    });
    
    // Second line (for comparison - could be active users or another metric)
    const points2 = safeData.map((val, idx) => {
        const x = padding + (idx / Math.max(safeData.length - 1, 1)) * (graphWidth - 2 * padding);
        const adjustedVal = Math.round(val * 0.6); // Second line shows 60% of first line
        const y = graphHeight - padding - (adjustedVal / maxValue) * (graphHeight - 2 * padding);
        return { x, y, val: adjustedVal };
    });

    const getXAxisLabels = () => {
        if (tab === "Week") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        if (tab === "Month") return safeData.map((_, i) => `Week ${i + 1}`);
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
                <Text style={styles.sectionTitle}>USERS</Text>
                <View style={styles.tabRow}>
                    {["Week", "Month", "Year"].map(t => (
                        <TouchableOpacity key={t} onPress={() => onTabChange(t)}>
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
                    
                    {/* First data line (black) */}
                    <Polyline
                        points={points1.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke={colors.black}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Second data line (yellow/gold) */}
                    <Polyline
                        points={points2.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke={colors.gold}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Data points for first line */}
                    {points1.map((point, idx) => (
                        <Circle
                            key={`line1-${idx}`}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill={colors.black}
                        />
                    ))}
                    
                    {/* Data points for second line */}
                    {points2.map((point, idx) => (
                        <Circle
                            key={`line2-${idx}`}
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

// ---------------------- TOP USER ITEM ---------------------- //
const TopUserItem = ({ user, index }) => {
    if (!user) return null;
    
    // Get user display name (username, fullName, or name)
    const displayName = user?.username || user?.fullName || user?.name || `User ${index + 1}`;
    const firstLetter = displayName.charAt(0).toUpperCase();
    
    // Calculate book count from libraryBookIdList
    const bookCount = Array.isArray(user?.libraryBookIdList) 
        ? user.libraryBookIdList.length 
        : (user?.bookCount || 0);
    
    return (
        <View style={styles.topUserItem}>
            <Filigree4 customBottomPosition={-5} customLeftPosition={-25} customOpacity={0.05} />
            
            <LinearGradient
                colors={[colors.black, 'transparent']}
                style={[globalStyles.shadow, { opacity: 0.2, borderRadius: 8 }]}
            />

            <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                    {firstLetter}
                </Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userActivity}>
                    {bookCount} Books
                </Text>
            </View>
        </View>
    );
};

// ---------------------- TOP USERS SECTION ---------------------- //
const TopUsersSection = () => {
    const [tab, setTab] = useState("Week");
    const { usersDatabase } = useSelector((state) => state.books);
    const safeUsersDatabase = Array.isArray(usersDatabase) ? usersDatabase : [];
    
    // Calculate book count for each user and sort by book count
    const topUsers = [...safeUsersDatabase]
        .map(user => {
            if (!user) return null;
            const bookCount = Array.isArray(user?.libraryBookIdList) 
                ? user.libraryBookIdList.length 
                : (user?.bookCount || 0);
            return {
                ...user,
                bookCount: bookCount
            };
        })
        .filter(user => user != null)
        .sort((a, b) => (b?.bookCount || 0) - (a?.bookCount || 0))
        .slice(0, 10); // Top 10 users

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
                {topUsers.length > 0 ? (
                    <FlatList
                        data={topUsers}
                        keyExtractor={(item, index) => item?.id || item?.username || item?.name || `user-${index}`}
                        renderItem={({ item, index }) => {
                            if (!item) return null;
                            return <TopUserItem user={item} index={index} />;
                        }}
                        scrollEnabled={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Chưa có dữ liệu users</Text>
                    </View>
                )}
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
    const dispatch = useDispatch();
    const { usersDatabase } = useSelector((state) => state.books);
    const safeUsersDatabase = Array.isArray(usersDatabase) ? usersDatabase : [];
    
    // Tab state for UsersGraph
    const [usersTab, setUsersTab] = useState("Week");
    
    // Fetch users from Firebase when screen is focused to get latest data
    useFocusEffect(
        useCallback(() => {
            dispatch(fetchUsers());
        }, [dispatch])
    );
    
    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView bounces={false} overScrollMode="never">
                <ScreenTitle title="ANALYTICS" icon="person" />

                {/* Users Graph */}
                <View style={styles.sectionWrapper}>
                    <UsersGraph 
                        usersDatabase={safeUsersDatabase}
                        tab={usersTab}
                        onTabChange={setUsersTab}
                    />
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
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
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
