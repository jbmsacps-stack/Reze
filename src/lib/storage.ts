import AsyncStorage from "@react-native-async-storage/async-storage";

export type Reminder = {
  id: string;
  title: string;
  dateTime: string;
  completed: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  dateTime: string;
  note?: string;
};

export type RezeSettings = {
  userName: string;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
};

const STORAGE_KEYS = {
  reminders: "reze_reminders",
  events: "reze_events",
  settings: "reze_settings",
};

export async function getReminders(): Promise<Reminder[]> {
  const storedReminders = await AsyncStorage.getItem(STORAGE_KEYS.reminders);
  return storedReminders ? JSON.parse(storedReminders) : [];
}

export async function saveReminders(reminders: Reminder[]) {
  await AsyncStorage.setItem(
    STORAGE_KEYS.reminders,
    JSON.stringify(reminders)
  );
}

export async function getEvents(): Promise<EventItem[]> {
  const storedEvents = await AsyncStorage.getItem(STORAGE_KEYS.events);
  return storedEvents ? JSON.parse(storedEvents) : [];
}

export async function saveEvents(events: EventItem[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

export async function getSettings(): Promise<RezeSettings> {
  const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.settings);

  if (!storedSettings) {
    return {
      userName: "JB",
      notificationsEnabled: true,
      darkModeEnabled: true,
    };
  }

  return JSON.parse(storedSettings);
}

export async function saveSettings(settings: RezeSettings) {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export async function clearRezeData() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.reminders,
    STORAGE_KEYS.events,
    STORAGE_KEYS.settings,
  ]);
}