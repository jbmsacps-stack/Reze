import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function setupNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reze-reminders", {
      name: "Reze Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff4f8b",
    });
  }

  const permissionStatus = await Notifications.getPermissionsAsync();

  if (!permissionStatus.granted) {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    return requestedPermission.granted;
  }

  return true;
}

export async function scheduleReminderNotification(title: string) {
  const hasPermission = await setupNotifications();

  if (!hasPermission) {
    return null;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reze Reminder 🔔",
      body: title,
      sound: true,
    },
    trigger: {
      seconds: 10,
    },
  });

  return notificationId;
}