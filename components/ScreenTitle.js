import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

import { colors } from './GlobalStyle';
import { Filigree3 } from './decorations/Filigree';

const ScreenTitle = ({ title, icon, customIconPosition }) => {
    const position = customIconPosition == null ? 0 : customIconPosition;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>

                <View style={styles.bottomBorderContainer}>
                    <View style={styles.bottomBorder} />
                    <View style={[styles.iconContainer, { bottom: position }]}>
                        <MaterialIcons size={26} color={colors.gold} name={icon} />
                    </View>
                    <View style={styles.bottomBorder} />
                </View>
                <Filigree3 />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    //-------------------------------------------------------//

    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },

    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 50,
        marginTop: 0,
        marginBottom: 40,

        borderTopWidth: 2,
        borderColor: colors.gold,
        backgroundColor: colors.gray,
    },

    titleText: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 3,

    },

    bottomBorderContainer: {
        zIndex: 999,
        position: 'absolute',
        bottom: -13,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        width: '100%',
    },

    iconContainer: {
        transform: [{ translateY: 5 }]
    },

    bottomBorder: {
        width: '46%',
        height: 2,

        backgroundColor: colors.gold
    }

    //-------------------------------------------------------//
});

export default ScreenTitle;