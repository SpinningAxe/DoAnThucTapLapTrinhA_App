import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, globalStyles } from "../components/GlobalStyle";
import { useNavigation } from "@react-navigation/native";

import { Filigree5_Bottom, Filigree2 } from "../components/decorations/Filigree";
import { SidedButton_Left, SidedButton_Right, DecoButton, OrnateButton, } from "../components/decorations/DecoButton";

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import ScreenTitle from "../components/ScreenTitle";

import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../store/slices/accountSlice";

// ✅ Firebase Auth setup
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);

  // ✅ Google Auth config (Expo Go + iOS + Web)
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "971300749369-h3enance2u774vr7r29engo9vjdab5n1.apps.googleusercontent.com",
    androidClientId:
      "971300749369-mp0c86ukj18eei2nt2fbvo4u29ev97f.apps.googleusercontent.com",
    webClientId:
      "971300749369-mp0c86ukj18eei2nt2fbvo4u29ev97f.apps.googleusercontent.com",
    expoClientId:
      "971300749369-mp0c86ukj18eei2nt2fbvo4u29ev97f.apps.googleusercontent.com",
  });

  // ✅ Đăng nhập email/password (backend)
  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    dispatch(
      loginUser({
        email,
        password,
        onSuccess: () => navigation.replace("MainScreen"),
      })
    );
  };

  // ✅ Nếu user Redux tồn tại → điều hướng
  useEffect(() => {
    if (user) navigation.replace("MainScreen");
  }, [user]);

  // ✅ Firebase Google Sign-In logic
  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === "success") {
        try {
          const { authentication } = response;

          // Tạo credential từ token Google
          const credential = GoogleAuthProvider.credential(
            authentication.idToken,
            authentication.accessToken
          );

          // Đăng nhập Firebase
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;

          console.log("✅ Firebase user:", user);
          Alert.alert("Thành công", `Xin chào ${user.displayName || user.email}!`);
          navigation.replace("MainScreen");
        } catch (error) {
          console.log("❌ Lỗi Firebase Auth:", error);
          Alert.alert("Lỗi", "Không thể đăng nhập Google!");
        }
      }
    };

    signInWithGoogle();
  }, [response]);

  return (
    <View>
      {/* Nút Google Login */}
      <View style={styles.ornateTextbox_white}>
        <LinearGradient
          colors={[colors.black, "transparent"]}
          style={[
            globalStyles.shadow,
            globalStyles.topShadow,
            { opacity: 0.2 },
          ]}
        />
        <View>
          <TouchableOpacity disabled={!request} onPress={() => promptAsync()}>
            <OrnateButton ButtonText={"Đăng Nhập Bằng Google"} />
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>hoặc</Text>
            <View style={styles.line} />
          </View>
        </View>
      </View>

      {/* Form đăng nhập email/password */}
      <View style={styles.loginContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[colors.black, "transparent"]}
          style={[globalStyles.shadow, globalStyles.leftShadow]}
        />

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["transparent", colors.black]}
          style={[globalStyles.shadow, globalStyles.rightShadow]}
        />

        <Filigree5_Bottom customColor={colors.lightgray} />

        <View style={styles.ot_container}>
          <View style={styles.ot_fieldContainer}>
            <Text
              style={[
                styles.ot_textInputLabel,
                email === "" && { color: colors.gray },
              ]}
            >
              Email hoặc tên đăng nhập
            </Text>
            <TextInput
              style={styles.ot_textInput}
              placeholder="Email hoặc tên đăng nhập"
              placeholderTextColor={colors.lightgray}
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <View style={styles.ot_fieldContainer}>
            <Text
              style={[
                styles.ot_textInputLabel,
                password === "" && { color: colors.gray },
              ]}
            >
              Mật khẩu
            </Text>
            <TextInput
              style={styles.ot_textInput}
              placeholder="Mật khẩu"
              placeholderTextColor={colors.lightgray}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword2}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ position: "absolute", bottom: -20, zIndex: 999 }}
          onPress={handleAuth}
          activeOpacity={1}
        >
          <DecoButton ButtonText={"ĐĂNG NHẬP"} ButtonIcon={""} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🔹 SIGN UP GIỮ NGUYÊN
const SignUpComponent = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const dispatch = useDispatch();

  const handleAuth = async () => {
    if (!email || !username || !password || !repeatPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      await dispatch(
        registerUser({ email, username, password, repeatPassword })
      ).unwrap();
      setIsLogin(true);
      setPassword("");
      setRepeatPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.registerContainer}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[colors.black, "transparent"]}
        style={[globalStyles.shadow, globalStyles.leftShadow]}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["transparent", colors.black]}
        style={[globalStyles.shadow, globalStyles.rightShadow]}
      />

      <Filigree5_Bottom customColor={colors.lightgray} />

      <View style={styles.ot_container}>
        <View style={styles.ot_fieldContainer}>
          <Text
            style={[
              styles.ot_textInputLabel,
              email === "" && { color: colors.gray },
            ]}
          >
            Email
          </Text>
          <TextInput
            style={styles.ot_textInput}
            placeholder="Email"
            placeholderTextColor={colors.lightgray}
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View style={styles.ot_fieldContainer}>
          <Text
            style={[
              styles.ot_textInputLabel,
              username === "" && { color: colors.gray },
            ]}
          >
            Tên người dùng
          </Text>
          <TextInput
            style={styles.ot_textInput}
            placeholder="Tên người dùng"
            placeholderTextColor={colors.lightgray}
            onChangeText={setUsername}
            value={username}
          />
        </View>

        <View style={styles.ot_fieldContainer}>
          <Text
            style={[
              styles.ot_textInputLabel,
              password === "" && { color: colors.gray },
            ]}
          >
            Mật khẩu
          </Text>
          <TextInput
            style={styles.ot_textInput}
            placeholder="Mật khẩu"
            placeholderTextColor={colors.lightgray}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <View style={styles.ot_fieldContainer}>
          <Text
            style={[
              styles.ot_textInputLabel,
              repeatPassword === "" && { color: colors.gray },
            ]}
          >
            Nhập lại mật khẩu
          </Text>
          <TextInput
            style={styles.ot_textInput}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor={colors.lightgray}
            onChangeText={setRepeatPassword}
            value={repeatPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={{ position: "absolute", bottom: -20, zIndex: 999 }}
          onPress={handleAuth}
          activeOpacity={1}
        >
          <DecoButton ButtonText={"ĐĂNG KÝ"} ButtonIcon={""} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🔹 MÀN LOGIN CHÍNH
const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <AppHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          bounces={false}
          overScrollMode="never"
          style={{ width: "100%" }}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenTitle title={"TÀI KHOẢN"} icon={"person"} />

          <View style={styles.loginButtons}>
            <TouchableOpacity onPress={() => setIsLogin(true)}>
              <SidedButton_Left ButtonText={"Đăng Nhập"} Active={isLogin} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(false)}>
              <SidedButton_Right ButtonText={"Đăng Ký"} Active={!isLogin} />
            </TouchableOpacity>
          </View>

          {isLogin ? (
            <LoginComponent />
          ) : (
            <SignUpComponent setIsLogin={setIsLogin} />
          )}

          <Filigree2 customPosition={40} />
          <View style={globalStyles.bottomPadding} />
        </ScrollView>

        <AppFooter currentScreen={4} />
      </KeyboardAvoidingView>
    </View>
  );
};

// 🔹 Styles giữ nguyên
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  loginButtons: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ornateTextbox_white: {
    width: "100%",
    height: "auto",
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: colors.white,
    borderTopWidth: 3,
    borderBottomWidth: 2,
    backgroundColor: colors.white,
  },
  loginContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 230,
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 2,
    backgroundColor: colors.gray,
  },
  registerContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 430,
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 2,
    borderTopColor: colors.white,
    borderTopWidth: 3,
    backgroundColor: colors.gray,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightgray,
    opacity: 0.7,
  },
  separatorText: {
    marginHorizontal: 5,
    color: colors.lightgray,
    fontStyle: "italic",
    fontSize: 16,
  },
  ot_container: {
    width: "80%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  ot_fieldContainer: {
    width: "100%",
    marginTop: 20,
  },
  ot_textInputLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "bold",
  },
  ot_textInput: {
    width: "100%",
    padding: 5,
    fontSize: 18,
    color: colors.white,
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 1,
  },
  forgotPassword2: {
    alignSelf: "flex-end",
    color: colors.lightgray,
    fontSize: 12,
    marginTop: 15,
  },
  input4: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
    paddingVertical: 6,
    fontSize: 12,
    backgroundColor: colors.lightgray,
    borderRadius: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LoginScreen;
