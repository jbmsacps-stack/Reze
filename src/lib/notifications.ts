import Constants from "expo-constants";
import { Platform } from "react-native";

function isExpoGo() {
  return Constants.appOwnership === "expo";
}

function parseRelativeDelaySeconds(dateTime: string) {
  const normalized = dateTime.toLowerCase().trim();

  const minuteMatch = normalized.match(/\b(?:in|after)\s+(\d+)\s+minutes?\b/);
  if (minuteMatch) {
    return Number(minuteMatch[1]) * 60;
  }

  const hourMatch = normalized.match(/\b(?:in|after)\s+(\d+)\s+hours?\b/);
  if (hourMatch) {
    return Number(hourMatch[1]) * 60 * 60;
  }

  return null;
}

export async function setupNotifications(): Promise<void> {
  if (isExpoGo()) {
    console.log(
      "[REZE] Notifications skipped in Expo Go. Test notifications in APK/development build."
    );
    return;
  }

  try {
    const Notifications = await import("expo-notifications");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reze-reminders", {
        name: "Reze Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }

    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      console.log("[REZE] Notification permission denied.");
    }
  } catch (error) {
    console.log("[REZE] Notification setup failed:", error);
  }
}

export async function scheduleReminderNotification(
  title: string,
  dateTime: string
): Promise<string | null> {
  if (isExpoGo()) {
    console.log(
      "[REZE] Reminder saved, but notification scheduling skipped in Expo Go."
    );
    return null;
  }

  const seconds = parseRelativeDelaySeconds(dateTime);

  if (!seconds) {
    return null;
  }

  try {
    const Notifications = await import("expo-notifications");

    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      console.log("[REZE] Notification permission denied.");
      return null;
    }

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reze Reminder",
        body: title,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
        channelId: "reze-reminders",
      },
    });
  } catch (error) {
    console.log("[REZE] Failed to schedule reminder notification:", error);
    return null;
  }
}

export async function cancelReminderNotification(
  notificationId?: string | null
): Promise<void> {
  if (!notificationId || isExpoGo()) {
    return;
  }

  try {
    const Notifications = await import("expo-notifications");
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log("[REZE] Failed to cancel reminder notification:", error);
  }
}