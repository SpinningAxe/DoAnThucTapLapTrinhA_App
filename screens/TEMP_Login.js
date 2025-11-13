import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "../components/GlobalStyle";
import { useNavigation } from "@react-navigation/native";

import { Filigree1 } from "../components/decorations/Filigree";
import { OrnateButton, } from "../components/decorations/DecoButton";

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

import { useDispatch, useSelector } from "react-redux";
import { TEMP_fetchTestAccount } from "../store/slices/accountSlice";

const TEMP_Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ width: '100%', alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
          <Text style={{ color: colors.white, letterSpacing: 2 }}>
            MÀN HÌNH ĐĂNG NHẬP TẠM
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log("Begin")
            dispatch(TEMP_fetchTestAccount());
            navigation.navigate("Account");
          }}
        >
          <OrnateButton ButtonText={"ĐĂNG NHẬP TÀI KHOẢN TEST"} ButtonIcon={"person"} />
        </TouchableOpacity>

        <View style={{ width: '100%' }}>
          <Filigree1 customPosition={-90} />
        </View>
      </ScrollView>
      <AppFooter currentScreen={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.black,
  },
});

export default TEMP_Login;
