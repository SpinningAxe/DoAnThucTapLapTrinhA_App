import { StyleSheet } from 'react-native';

export const colors = {
  trueBlack: '#000000ff',
  trueWhite: '#ffffffff',

  black: '#131313ff',
  gray: '#252525ff',
  lightgray: '#a0a0a0ff',
  white: '#ecececff',

  gold: '#f6c144ff',
  green: '#7eaa72ff',
  yellow: "#e2d34fff",
  red: "#d34f43ff"
}

export const globalStyles = StyleSheet.create({
  //----------------------------------------------//

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.black,
  },

  //----------------------------------------------//

  bottomPadding: {
    paddingBottom: 150
  },

  shadow: {
    position: 'absolute',
  },
  topShadow: {
    height: "70%",
    width: '100%',
    top: 0,
    left: 0,
  },
  bottomShadow: {
    height: "50%",
    width: '100%',
    bottom: 0,
    left: 0,
  },
  leftShadow: {
    height: '100%',
    width: '10%',
    bottom: 0,
    left: 0,
  },
  rightShadow: {
    height: '100%',
    width: '10%',
    bottom: 0,
    right: 0,
  },

  //----------------------------------------------//
});

