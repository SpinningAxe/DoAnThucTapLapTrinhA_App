import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
// import { updateUserInfo } from '../slices/accountSlice';
import { colors, globalStyles } from '../components/GlobalStyle';
import { Filigree9 } from '../components/decorations/Filigree';

import { DecoButton } from '../components/decorations/DecoButton';

import AppHeader from '../components//AppHeader';
import AppFooter from '../components/AppFooter';
import ScreenTitle from '../components/ScreenTitle';

const AccountUpdate = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);

  const [username, setUsername] = useState(user?.username || "");
  const [realname, setRealname] = useState(user?.realname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [day, setDay] = useState("12");
  const [month, setMonth] = useState("3");
  const [year, setYear] = useState("1234");

  // Cập nhật state khi user data thay đổi
  useEffect(() => {
    if (user) {
      setUsername(user?.username || "");
      setRealname(user.realname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    const updatedData = {
      username,
      realname,
      email,
    };
    
    // dispatch(updateUserInfo(updatedData));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={{ width: '100%' }} bounces={false} overScrollMode="never">
        <ScreenTitle title={"TÀI KHOẢN"} icon={"person"} />
        <View style={{ width: '100%', height: 400 }}>
          <Filigree9 />
        </View>

        {/* avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tên người dùng</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Tên thật</Text>
          <TextInput
            style={styles.input}
            value={realname}
            onChangeText={setRealname}
          />

          <Text style={styles.label}>Ngày sinh</Text>
          <View style={styles.dateRow}>
            <TextInput style={styles.dateInput} value={day} onChangeText={setDay} placeholder="Ngày" keyboardType="numeric" />
            <TextInput style={styles.dateInput} value={month} onChangeText={setMonth} placeholder="Tháng" keyboardType="numeric" />
            <TextInput style={styles.dateInput} value={year} onChangeText={setYear} placeholder="Năm" keyboardType="numeric" />
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <DecoButton ButtonText={"Lưu"}/>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <AppFooter currentScreen={4}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },

  avatarWrapper: {
    alignItems: 'center',
    marginTop: -400,
  },

  avatar: {
    width: 135,
    height: 135,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#000',
  },

  formContainer: {
    marginTop: 20,
    paddingHorizontal: 25,
  },

  label: {
    color: colors.white,
    fontSize: 14,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dateInput: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 3,
  },

  saveButton: {
    marginTop: 30,
    alignSelf: 'center',
    width: '50%',
    borderRadius: 30,
    overflow: 'hidden',
  },

  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default AccountUpdate;
