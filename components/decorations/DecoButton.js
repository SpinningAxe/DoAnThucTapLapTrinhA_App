import React from 'react';
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Mask, Path, G } from 'react-native-svg';
import { colors, globalStyles } from '../GlobalStyle';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const DecoButton = ({ ButtonText, ButtonIcon }) => {
    const { width } = useWindowDimensions();
    const svgWidth = Math.min(width - 40, 193);
    const svgHeight = 35;

    return (
        <View style={styles.container}>
            <View style={styles.buttonContext}>
                {
                    ButtonIcon != null ?
                        <MaterialIcons name={ButtonIcon}
                            color={colors.lightgray}
                            size={20}
                            style={{ marginRight: 10 }}
                        />
                        : <MaterialIcons name='list'
                            color={colors.lightgray}
                            size={20}
                            style={{ marginRight: 10 }}
                        />
                }
                <Text style={styles.buttonText}>{ButtonText}</Text>
            </View>
            <Svg
                width={svgWidth}
                height={svgHeight}
                viewBox="0 0 193 35"
            >
                <Rect
                    x="1"
                    y="1"
                    width="191"
                    height="33"
                    rx="16.5"
                    fill={colors.trueWhite}
                    stroke={colors.lightgray}
                    strokeWidth="2"
                />
                <Path
                    d="M3.5 7.5H188"
                    stroke={colors.lightgray}
                    strokeOpacity="0.5"
                />
                <Path
                    d="M3.5 27.5H188"
                    stroke={colors.lightgray}
                    strokeOpacity="0.5"
                />
            </Svg>
        </View>
    );
};
export const DecoButton_Dark = ({ ButtonText, ButtonIcon }) => {
    const { width } = useWindowDimensions();
    const svgWidth = Math.min(width - 40, 193);
    const svgHeight = 35;

    return (
        <View style={styles.container}>
            <View style={styles.buttonContext}>
                {
                    ButtonIcon != null ?
                        <MaterialIcons name={ButtonIcon}
                            color={colors.lightgray}
                            size={20}
                            style={{ marginRight: 8 }}
                        />
                        : null
                }
                <Text style={styles.buttonText}>{ButtonText}</Text>
            </View>
            <Svg
                width={svgWidth}
                height={svgHeight}
                viewBox="0 0 193 35"
            >
                <Rect
                    x="1"
                    y="1"
                    width="191"
                    height="33"
                    rx="16.5"
                    fill={colors.gray}
                    stroke={colors.lightgray}
                    strokeWidth="2"
                />
                <Path
                    d="M3.5 7.5H188"
                    stroke={colors.lightgray}
                    strokeOpacity="0.5"
                />
                <Path
                    d="M3.5 27.5H188"
                    stroke={colors.lightgray}
                    strokeOpacity="0.5"
                />
            </Svg>
        </View>
    );
};
export const DirectionButton_Left = ({ }) => {
    const { width } = useWindowDimensions();
    const svgWidth = Math.min(width - 40, 63);
    const svgHeight = 31;

    return (
        <View style={styles.container}>
            <Svg
                width={svgWidth}
                height={svgHeight}
                viewBox="0 0 63 31"
            >
                <Path
                    d="M12.6772 5.16791e-06L3.26961e-09 15.5L12.6772 31L46 31L33.3228 15.5L46 5.61867e-06L12.6772 5.16791e-06Z"
                    fill={colors.gold}
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M41 15.5L53.6772 1.51174e-07L62.6772 2.58498e-07L50 15.5L62.6772 31L53.6772 31L41 15.5Z"
                    fill={colors.gold}
                />
            </Svg>
        </View>
    );
};
export const DirectionButton_Right = ({ }) => {
    const { width } = useWindowDimensions();
    const svgWidth = Math.min(width - 40, 63);
    const svgHeight = 31;

    return (
        <View style={styles.container}>
            <Svg
                width={svgWidth}
                height={svgHeight}
                viewBox="0 0 63 31"
            >
                <Path
                    d="M50.0001 31L62.6772 15.5L50.0001 -1.10561e-06L16.6772 -4.01179e-06L29.3544 15.5L16.6772 31L50.0001 31Z"
                    fill={colors.gold}
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.6772 15.5L9.00006 31L5.79554e-05 31L12.6772 15.5L6.10352e-05 -1.76018e-06L9.00006 -1.25945e-06L21.6772 15.5Z"
                    fill={colors.gold}
                />
            </Svg>
        </View>
    );
};
export const OrnateButton = ({ ButtonText, ButtonIcon }) => {
    return (
        <View style={{ width: '100%' }}>
            <View style={styles.ornateButtonContainer}>
                <Svg style={{ position: 'absolute', top: -1 }} width="33" height="6" viewBox="0 0 33 6" fill="none">
                    <Path
                        d="M2.83789 0.499997L30.1621 0.5L16.5 5.46875L2.83789 0.499997Z"
                        stroke={colors.lightgray}
                        strokeWidth={1}
                    />
                </Svg>
                <Svg style={{ position: 'absolute', bottom: -1 }} width="33" height="6" viewBox="0 0 33 6" fill="none">
                    <Path
                        d="M30.1621 5.5H2.83789L16.5 0.53125L30.1621 5.5Z"
                        stroke={colors.lightgray}
                    />
                </Svg>
                <View style={styles.ob_textContainer}>
                    {ButtonIcon != null && <MaterialIcons style={styles.ob_icon} color={colors.gold} size={24} name={ButtonIcon} />}
                    <Text style={styles.ob_text}>{ButtonText}</Text>
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
                </View>
            </View>
        </View>
    );
}
export const OrnateButtonRed = ({ ButtonText, ButtonIcon }) => {
    return (
        <View style={{ width: '100%' }}>
            <View style={[styles.ornateButtonContainer, { borderColor: colors.red }]}>
                <Svg style={{ position: 'absolute', top: -1 }} width="33" height="6" viewBox="0 0 33 6" fill="none">
                    <Path
                        d="M2.83789 0.499997L30.1621 0.5L16.5 5.46875L2.83789 0.499997Z"
                        stroke={colors.red}
                        strokeWidth={1}
                    />
                </Svg>
                <Svg style={{ position: 'absolute', bottom: -1 }} width="33" height="6" viewBox="0 0 33 6" fill="none">
                    <Path
                        d="M30.1621 5.5H2.83789L16.5 0.53125L30.1621 5.5Z"
                        stroke={colors.red}
                    />
                </Svg>
                <View style={[styles.ob_textContainer, { borderColor: colors.red }]}>
                    {ButtonIcon != null && <MaterialIcons style={styles.ob_icon} color={colors.red} size={24} name={ButtonIcon} />}
                    <Text style={[styles.ob_text, { color: colors.red }]}>{ButtonText}</Text>
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
                </View>
            </View>
        </View>
    );
}
export const OrnateOption = ({ ButtonText, ButtonIcon, Active }) => {
    return (
        <View style={[{ width: '100%' }]}>
            <View style={[styles.ornateOptionContainer]}>
                <View style={[styles.oo_textContainer, !Active && { borderColor: colors.lightgray }]}>
                    {ButtonIcon != null && <MaterialIcons style={styles.ob_icon} color={colors.white} size={24} name={ButtonIcon} />}
                    <Text style={[styles.oo_text, Active && styles.oo_text_active]}>{ButtonText}</Text>
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
                </View>
                {Active && <Svg style={styles.oo_checkmark} width="36" height="27" viewBox="0 0 36 27" fill="none">
                    <Path
                        d="M35.3261 3.41923L12.4194 26.3263L9.07937 22.9725L6.43948 20.3462L1.99713 15.8898C0.346014 14.2389 0.346013 11.5615 1.99713 9.90973C3.64845 8.25882 6.32592 8.25882 7.97725 9.90973L12.4264 14.3595L23.3663 3.41923C26.6689 0.11658 32.0234 0.11658 35.3261 3.41923Z"
                        fill={colors.gold}
                    />
                </Svg>}
                <Svg style={styles.oo_diamond} width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <Rect
                        x="14.6569"
                        y="2.46458"
                        width="17.7279"
                        height="17.7279"
                        transform="rotate(45 14.6569 2.46458)"
                        fill={colors.gray}
                        stroke={Active ? colors.white : colors.lightgray}
                        strokeWidth="3"
                    />
                </Svg>
            </View>
        </View>
    );
}

export const SidedButton_Left = ({ ButtonText, Active }) => {
    const color = Active ? colors.white : colors.lightgray;

    return (
        <View style={styles.sideButtonContainer}>
            <View style={[styles.sb_textContainer, { right: 0 }]}>
                <Text style={[styles.sb_text]}>{ButtonText}</Text>
            </View>
            <Svg
                width="178" height="34" viewBox="0 0 178 34" fill="none"
            >
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M45.4314 0C39.0438 18.9163 21.681 32.7612 0.939453 33.9212V34H178.097V0H45.4314Z"
                    fill={color}
                />
            </Svg>
            {
                !Active &&
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.2)']}
                    style={[globalStyles.shadow, globalStyles.bottomShadow]}
                />
            }
        </View>
    )
}

export const SidedButton_Right = ({ ButtonText, Active }) => {
    const color = Active ? colors.white : colors.lightgray;
    return (
        <View style={styles.sideButtonContainer}>
            <View style={[styles.sb_textContainer, { left: 0 }]}>
                <Text style={[styles.sb_text]}>{ButtonText}</Text>
            </View>
            <Svg
                width="178" height="34" viewBox="0 0 178 34" fill="none"
            >
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M132.608 0C138.99 18.9163 156.337 32.7612 177.061 33.9212V34H0.0605512V0H132.608Z"
                    fill={color}
                />
            </Svg>
            {
                !Active &&
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.2)']}
                    style={[globalStyles.shadow, globalStyles.bottomShadow]}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 'auto'
    },
    buttonText: {
        color: colors.lightgray,
        fontWeight: 'light',
        letterSpacing: 3,
    },
    buttonContext: {
        position: 'absolute',
        zIndex: 99,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 35,
    },

    ornateButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 60,
        marginVertical: 8,

        borderColor: colors.lightgray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    ob_textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: '85%',

        backgroundColor: colors.gray,
        borderColor: colors.trueWhite,
        borderTopWidth: 3,
        borderBottomWidth: 2,
    },
    ob_icon: {
        marginRight: 15
    },
    ob_text: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 18
    },

    ornateOptionContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: 70,
        marginVertical: -3,

        // borderColor: colors.lightgray,
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
    },
    oo_textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',
        height: '85%',

        backgroundColor: colors.gray,
        borderColor: colors.white,
        borderTopWidth: 3,
        borderBottomWidth: 2,
    },
    oo_diamond: {
        zIndex: 999,
        position: 'absolute',
        bottom: -9,
    },
    oo_checkmark: {
        zIndex: 9999,
        position: 'absolute',
        bottom: -2,
        left: "46.5%"
    },
    oo_text: {
        color: colors.lightgray,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 0,

        marginBottom: 5,
    },
    oo_text_active: {
        color: colors.white,
    },

    sideButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden'
    },
    sb_textContainer: {
        zIndex: 999,
        position: 'absolute',

        alignItems: 'center',
        justifyContent: 'center',

        width: 140,
        height: 34,

        // borderColor: 'red',
        // borderWidth: 1
    },
    sb_text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.gray
    },

    shadow: {
        position: 'absolute',
    },
    leftShadow: {
        height: '100%',
        width: '15%',
        bottom: 0,
        left: 0,
    },
    rightShadow: {
        height: '100%',
        width: '15%',
        bottom: 0,
        right: 0,
    },
});

// export default DecoButton;