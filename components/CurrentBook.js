import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentBookById, fetchChaptersOfCurrentBook } from '../store/slices/accountSlice';

import { colors } from './GlobalStyle';
import { Filigree2, Filigree4 } from './decorations/Filigree';
import { DecoButton } from './decorations/DecoButton';
import { fetchChaptersOfSelectedBook, setSelectedBook, setSelectedChapter } from '../store/slices/bookSlice';

const CurrentBook = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    currentBookId,
    currentChapterNum,
    currentBook,
    chaptersOfCurrentBook,
    loading,
  } = useSelector((state) => state.account);

  useEffect(() => {
    if (!currentBookId) return; // prevent null calls

    // Fetch only if we don't already have this book or its chapters
    if (!currentBook || currentBook.bookId !== currentBookId) {
      dispatch(fetchCurrentBookById(currentBookId));
    }
    if (
      !chaptersOfCurrentBook ||
      chaptersOfCurrentBook.length === 0 ||
      chaptersOfCurrentBook[0]?.bookId !== currentBookId
    ) {
      dispatch(fetchChaptersOfCurrentBook(currentBookId));
    }
  }, [dispatch, currentBookId]); // depend on ID only

  if (loading || !currentBook) return null;

  const totalChapter = chaptersOfCurrentBook.length;
  const currentProgress = Math.round((currentChapterNum / totalChapter) * 100);

  return (
    <View style={styles.cb_container}>
      <Filigree2 />
      <Filigree4
        customLeftPosition={-12}
        customBottomPosition={10}
      />
      <LinearGradient
        colors={[colors.black, 'transparent']}
        style={[styles.shadow, styles.topShadow, { marginTop: 20, opacity: 0.2 }]}
      />
      <LinearGradient
        colors={['transparent', colors.black]}
        style={[styles.shadow, styles.bottomShadow, { height: 130, opacity: 0.2 }]}
      />
      <LinearGradient
        colors={['transparent', colors.black]}
        style={[styles.shadow, styles.bottomShadow, { top: -40, height: 40, opacity: 1 }]}
      />

      <View style={[styles.bl_header, { paddingLeft: 160 }]}>
        <Text style={styles.bl_headerTitle}>
          ĐANG ĐỌC
        </Text>
      </View>
      <TouchableOpacity style={styles.cb_bookCover}
        activeOpacity={1}
        onPress={() => navigation.navigate('PageScreen')}>
        <Image
          source={{ uri: currentBook.cover }}
          style={styles.cb_bookCoverImg}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.cb_desContainer}>
        <Text style={styles.cb_desTitle}
          numberOfLines={4}
        >{currentBook.title}</Text>
        <Text style={styles.cb_desAuthor}>{currentBook.author}</Text>
        <Text style={styles.cb_desProgress}>
          Chương {currentChapterNum} | {currentProgress}%
        </Text>
      </View>
      <TouchableOpacity style={styles.decoButton}
        activeOpacity={1}
        onPress={() => {
          dispatch(setSelectedBook(currentBook));
          dispatch(setSelectedChapter(chaptersOfCurrentBook[(currentChapterNum - 1)]))
          dispatch(fetchChaptersOfSelectedBook(currentBook.bookId));
          navigation.navigate('BookPage')
        }}
      >
        <DecoButton ButtonText="ĐỌC TIẾP" ButtonIcon="import-contacts" />
      </TouchableOpacity>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
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

export default CurrentBook;