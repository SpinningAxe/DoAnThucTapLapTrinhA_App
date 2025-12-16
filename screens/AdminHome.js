import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { fetchGenre } from "../store/slices/bookSlice";
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
const DashboardCard = ({ title, value, range, data }) => {
    const graphWidth = 60;
    const graphHeight = 30;
    const safeData = Array.isArray(data) ? data : [];
    const maxValue = safeData.length > 0 ? Math.max(...safeData, 1) : 1;
    const points = safeData.map((val, idx) => {
        const x = (idx / Math.max(safeData.length - 1, 1)) * graphWidth;
        const y = graphHeight - (val / maxValue) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardTitle}>{title}</Text>
            <Text style={styles.dashboardCardValue}>{value}</Text>
            <View style={styles.dashboardCardGraph}>
                <Svg width={graphWidth} height={graphHeight}>
                    <Polyline
                        points={points}
                        fill="none"
                        stroke={colors.gold}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </View>
            <Text style={styles.dashboardCardRange}>{range}</Text>
        </View>
    );
};

// ---------------------- VIEWS GRAPH ---------------------- //
const ViewsGraph = () => {
    const [tab, setTab] = useState("Week");
    
    // Sample data for the graph
    const weekData = [10, 30, 20, 40];
    const monthData = [20, 50, 40, 60, 45, 70, 55];
    const yearData = [100, 150, 200, 180, 220, 250, 230, 280, 300, 350, 320, 400];
    
    const getData = () => {
        if (tab === "Week") return weekData;
        if (tab === "Month") return monthData;
        return yearData;
    };

    const data = getData();
    const safeData = Array.isArray(data) ? data : [];
    const graphWidth = 280;
    const graphHeight = 120;
    const maxValue = safeData.length > 0 ? Math.max(...safeData, 1) : 1;
    const padding = 10;

    const points = safeData.map((val, idx) => {
        const x = padding + (idx / Math.max(safeData.length - 1, 1)) * (graphWidth - 2 * padding);
        const y = graphHeight - padding - (val / maxValue) * (graphHeight - 2 * padding);
        return { x, y, val };
    });

    const linePath = points.map((p, idx) => 
        `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

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

            <View style={styles.graphWrapper}>
                <Svg width={graphWidth} height={graphHeight}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((val, idx) => {
                        const y = graphHeight - padding - (val / 100) * (graphHeight - 2 * padding);
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {points.map((point, idx) => (
                        <Circle
                            key={idx}
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill={colors.gold}
                        />
                    ))}
                </Svg>

                {/* X-axis labels */}
                <View style={styles.xAxisLabels}>
                    {safeData.map((_, idx) => (
                        <Text key={idx} style={styles.xAxisLabel}>
                            {tab === "Week" ? `Week ${idx + 1}` : 
                             tab === "Month" ? `M${idx + 1}` : 
                             `${idx + 1}`}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

// ---------------------- CATEGORY ITEM ---------------------- //
const CategoryItem = ({ genre, bookDatabase }) => {
    const safeBookDatabase = Array.isArray(bookDatabase) ? bookDatabase : [];
    const books = safeBookDatabase.filter(book =>
        book?.genreList?.includes(genre?.name)
    );

    if (books.length <= 0) return null;

    const bookCount = books.length;
    const authorCount = new Set(books.map(b => b?.author).filter(Boolean)).size;
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
                    <Text style={styles.statNum}>{authorCount}</Text>
                    <Text style={styles.statLabel}>Tác Giả</Text>
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

// ---------------------- CATEGORIES TRENDS ---------------------- //
const AdminCategoryTrends = () => {
    const [tab, setTab] = useState("Week");
    const dispatch = useDispatch();

    const { genreDatabase, loading, booksDatabase } = useSelector(state => state.books);
    const bookDatabase = booksDatabase || [];

    useEffect(() => {
        if (!genreDatabase || genreDatabase.length === 0) {
            dispatch(fetchGenre());
        }
    }, [dispatch]);

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
    const { booksDatabase } = useSelector(state => state.books);
    const bookDatabase = booksDatabase || [];
    
    // Calculate dashboard stats
    const totalBooks = bookDatabase.length;
    const totalViews = bookDatabase.reduce((sum, book) => {
        if (!book) return sum;
        return sum + ((book.readCount || book.totalView || 0));
    }, 0);
    const totalUsers = 100; // Placeholder - you may need to get this from your state
    
    // Sample data for dashboard cards (mini graphs)
    const booksData = [30, 50, 40, 60, 55, 70, 65];
    const viewsData = [20, 40, 30, 50, 45, 60, 55];
    const usersData = [10, 30, 20, 40, 35, 50, 45];

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
                        range="30 180"
                        data={booksData}
                    />
                    <DashboardCard 
                        title="Total Views" 
                        value={formatCompactNumber(totalViews)} 
                        range="30 180"
                        data={viewsData}
                    />
                    <DashboardCard 
                        title="Total Users" 
                        value={totalUsers.toString()} 
                        range="30 180"
                        data={usersData}
                    />
                </View>

                {/* Views Graph */}
                <View style={styles.sectionWrapper}>
                    <ViewsGraph />
                </View>

                {/* Categories Trends */}
                <View style={styles.sectionWrapper}>
                    <AdminCategoryTrends />
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
        marginBottom: 8,
    },
    dashboardCardGraph: {
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboardCardRange: {
        color: '#999',
        fontSize: 9,
        marginTop: 4,
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
    graphWrapper: {
        alignItems: 'center',
        marginTop: 10,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 280,
        marginTop: 8,
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
