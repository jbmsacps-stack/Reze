import AsyncStorage from "@react-native-async-storage/async-storage";

const REMINDERS_KEY = "reze_reminders";
const EVENTS_KEY = "reze_events";
const SETTINGS_KEY = "reze_settings";

export type Reminder = {
  id: string;
  title: string;
  dateTime: string;
  completed: boolean;
  notificationId?: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  dateTime: string;
  note?: string;
};

export type RezeAIMode = "offline" | "online";

export type RezeSettings = {
  userName: string;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  aiMode: RezeAIMode;
};

const DEFAULT_SETTINGS: RezeSettings = {
  userName: "JB",
  notificationsEnabled: false,
  darkModeEnabled: true,
  aiMode: "offline",
};

export async function getReminders(): Promise<Reminder[]> {
  const storedReminders = await AsyncStorage.getItem(REMINDERS_KEY);

  if (!storedReminders) {
    return [];
  }

  return JSON.parse(storedReminders);
}

export async function saveReminders(reminders: Reminder[]) {
  await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export async function getEvents(): Promise<EventItem[]> {
  const storedEvents = await AsyncStorage.getItem(EVENTS_KEY);

  if (!storedEvents) {
    return [];
  }

  return JSON.parse(storedEvents);
}

export async function saveEvents(events: EventItem[]) {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function getSettings(): Promise<RezeSettings> {
  const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);

  if (!storedSettings) {
    return DEFAULT_SETTINGS;
  }

  const parsedSettings = JSON.parse(storedSettings);

  return {
    ...DEFAULT_SETTINGS,
    ...parsedSettings,
  };
}

export async function saveSettings(settings: RezeSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function clearRezeData() {
  await AsyncStorage.multiRemove([REMINDERS_KEY, EVENTS_KEY, SETTINGS_KEY]);
}