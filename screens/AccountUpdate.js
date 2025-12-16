import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../store/slices/accountSlice';
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

  // Helper function to parse date string "DD/MM/YYYY" to day, month, year
  const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return { day: "", month: "", year: "" };
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return { day: parts[0], month: parts[1], year: parts[2] };
    }
    return { day: "", month: "", year: "" };
  };

  // Helper function to get date from user object
  const getUserDate = (user) => {
    if (user?.birthday) return parseDate(user.birthday);
    if (user?.dateOfBirth) return parseDate(user.dateOfBirth);
    if (user?.birthDate) return parseDate(user.birthDate);
    return { day: "", month: "", year: "" };
  };

  const initialDate = getUserDate(user);
  const [username, setUsername] = useState(user?.username || "");
  const [realname, setRealname] = useState(user?.realname || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [day, setDay] = useState(initialDate.day);
  const [month, setMonth] = useState(initialDate.month);
  const [year, setYear] = useState(initialDate.year);
  const [loading, setLoading] = useState(false);

  // Cập nhật state khi user data thay đổi
  useEffect(() => {
    if (user) {
      setUsername(user?.username || "");
      setRealname(user?.realname || user?.name || "");
      setEmail(user?.email || "");
      const userDate = getUserDate(user);
      setDay(userDate.day);
      setMonth(userDate.month);
      setYear(userDate.year);
    }
  }, [user]);

  const handleSave = async () => {
    // Validation
    if (!username.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người dùng!");
      return;
    }
    
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email!");
      return;
    }

    // Validate email format - must be name@domain.com
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Lỗi", "Email không hợp lệ! Email phải có định dạng name@domain.com");
      return;
    }

    // Validate date - check if all fields are filled
    if (day || month || year) {
      if (!day || !month || !year) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ ngày, tháng, năm sinh!");
        return;
      }

      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      const currentYear = new Date().getFullYear();
      
      // Validate day (1-31)
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
        Alert.alert("Lỗi", "Ngày không hợp lệ! Ngày phải từ 1 đến 31");
        return;
      }
      
      // Validate month (1-12)
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        Alert.alert("Lỗi", "Tháng không hợp lệ! Tháng phải từ 1 đến 12");
        return;
      }
      
      // Validate year (1900 - current year)
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        Alert.alert("Lỗi", `Năm không hợp lệ! Năm phải từ 1900 đến ${currentYear}`);
        return;
      }

      // Validate date is valid (e.g., not 31/02/2000)
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
        Alert.alert("Lỗi", "Ngày sinh không hợp lệ! Vui lòng kiểm tra lại ngày, tháng, năm");
        return;
      }
    }

    setLoading(true);
    
    try {
      // Format date as DD/MM/YYYY
      const birthday = (day && month && year) 
        ? `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}` 
        : null;

      const updatedData = {
        username: username.trim(),
        realname: realname.trim(),
        name: realname.trim(), // Cũng cập nhật name field
        email: email.trim(),
        ...(birthday && { birthday, dateOfBirth: birthday, birthDate: birthday }),
      };
      
      await dispatch(updateUserInfo(updatedData)).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error("Update user info error:", error);
      Alert.alert("Lỗi", error || "Không thể cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={{ width: '100%' }} 
          bounces={false} 
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <ScreenTitle title={"TÀI KHOẢN"} icon={"person"} />
          <View style={{ width: '100%', height: 400 }}>
            <Filigree9 />
          </View>

          {/* avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.avatar || 'https://www.cnet.com/a/img/resize/e58477ebf3a1bb812b68953ea2bf6c5cdc93e825/hub/2019/07/08/631653cd-fb27-476a-bb76-1e8f8b70b87e/troller-t4-trail-1.jpg?auto=webp&width=1200' }}
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
              placeholder="Nhập tên người dùng"
              placeholderTextColor={colors.gray}
            />

            <Text style={styles.label}>Tên thật</Text>
            <TextInput
              style={styles.input}
              value={realname}
              onChangeText={setRealname}
              placeholder="Nhập tên thật"
              placeholderTextColor={colors.gray}
            />

            <Text style={styles.label}>Ngày sinh</Text>
            <View style={styles.dateRow}>
              <TextInput 
                style={styles.dateInput} 
                value={day} 
                onChangeText={setDay} 
                placeholder="Ngày (1-31)" 
                placeholderTextColor={colors.gray}
                keyboardType="numeric" 
                maxLength={2}
              />
              <TextInput 
                style={styles.dateInput} 
                value={month} 
                onChangeText={setMonth} 
                placeholder="Tháng (1-12)" 
                placeholderTextColor={colors.gray}
                keyboardType="numeric" 
                maxLength={2}
              />
              <TextInput 
                style={styles.dateInput} 
                value={year} 
                onChangeText={setYear} 
                placeholder="Năm (1900-nay)" 
                placeholderTextColor={colors.gray}
                keyboardType="numeric" 
                maxLength={4}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="name@domain.com"
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={loading}
            >
                <DecoButton ButtonText={loading ? "Đang lưu..." : "Lưu"}/>
            </TouchableOpacity>
          </View>

          <View style={{ height: 200 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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

  scrollContent: {
    paddingBottom: 50,
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
    paddingBottom: 20,
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
