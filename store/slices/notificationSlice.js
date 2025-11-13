import { createSlice } from "@reduxjs/toolkit";
import notificationsData from "../../assets/_notiDatabase.json";

// State ban đầu
const initialState = {
  notifications: [],
  groupedNotifications: [],
  isLoading: false,
  error: null,
};

function formatNotificationData(data) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;

  return data.map((item) => {
    const date = new Date(item.time);

    if (isNaN(date.getTime())) {
      console.warn("Lỗi định dạng thời gian:", item.time);
      return {
        text: item.text,
        title: "Không xác định",
        time: "--:--",
      };
    }

    // Chuyển sang giờ Việt Nam (UTC+7)
    const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const hours = vnTime.getHours().toString().padStart(2, "0");
    const minutes = vnTime.getMinutes().toString().padStart(2, "0");
    const displayTime = `${hours}:${minutes}`;

    const day = vnTime.getDate();
    const month = vnTime.getMonth() + 1;
    const isToday = day === currentDay && month === currentMonth;
    const title = isToday ? "Hôm nay" : `${day}/${month}`;

    return {
      text: item.text,
      title,
      time: displayTime,
    };
  });
}

// Hàm gom nhóm thông báo theo tiêu đề (Hôm nay, 22/10, ...)
function groupNotifications(data) {
  return data.reduce((acc, item) => {
    const existingGroup = acc.find((g) => g.title === item.title);
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({ title: item.title, items: [item] });
    }
    return acc;
  }, []);
}

// Thunk (action bất đồng bộ giả lập việc “load” dữ liệu)
export const loadNotifications = () => async (dispatch) => {
  try {
    dispatch(loadNotificationsStart());

    // ở đây có thể thay bằng gọi API thực tế
    const formatted = formatNotificationData(notificationsData);
    const grouped = groupNotifications(formatted);

    dispatch(loadNotificationsSuccess({ formatted, grouped }));
  } catch (error) {
    dispatch(loadNotificationsFailure(error.message));
  }
};

// Tạo slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    loadNotificationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadNotificationsSuccess: (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload.formatted;
      state.groupedNotifications = action.payload.grouped;
    },
    loadNotificationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.groupedNotifications = [];
    },
  },
});

// Actions
export const {
  loadNotificationsStart,
  loadNotificationsSuccess,
  loadNotificationsFailure,
  clearNotifications,
} = notificationSlice.actions;

// Export reducer mặc định
export default notificationSlice.reducer;
