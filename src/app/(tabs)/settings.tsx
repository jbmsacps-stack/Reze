import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { REZE_THEME } from "../../constants/rezeTheme";
import {
  RezeSettings,
  clearRezeData,
  getSettings,
  saveSettings,
} from "../../lib/storage";

const colors = REZE_THEME.colors;
const radius = REZE_THEME.radius;

export default function SettingsScreen() {
  const [userName, setUserName] = useState("JB");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedSettings = await getSettings();

    setUserName(savedSettings.userName);
    setNotificationsEnabled(savedSettings.notificationsEnabled);
    setDarkModeEnabled(savedSettings.darkModeEnabled);
  }

  async function handleSaveSettings() {
    const trimmedUserName = userName.trim();

    if (!trimmedUserName) {
      Alert.alert("Missing name", "Reze needs something to call you, genius 😏");
      return;
    }

    const updatedSettings: RezeSettings = {
      userName: trimmedUserName,
      notificationsEnabled,
      darkModeEnabled,
    };

    await saveSettings(updatedSettings);

    Alert.alert(
      "Settings saved",
      `Got it, ${trimmedUserName}. Reze will remember that locally ⚡`
    );
  }

  async function handleClearData() {
    Alert.alert(
      "Clear local data?",
      "This will delete Reze's saved reminders, events, and settings from this phone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearRezeData();

            setUserName("JB");
            setNotificationsEnabled(true);
            setDarkModeEnabled(true);

            Alert.alert("Cleared", "Local Reze data has been cleared.");
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Tune Reze&apos;s local preferences for this phone.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Your name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextBlock}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Placeholder. Expo Go notifications are disabled for V1.
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? colors.primarySoft : colors.textMuted}
              trackColor={{
                false: colors.surfaceSoft,
                true: colors.primaryDark,
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextBlock}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Placeholder. Reze is dark-only for now.
              </Text>
            </View>

            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              thumbColor={darkModeEnabled ? colors.primarySoft : colors.textMuted}
              trackColor={{
                false: colors.surfaceSoft,
                true: colors.primaryDark,
              }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
          <Text style={styles.clearButtonText}>Clear Local Data</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          V1 stores everything on your OPPO F31 5G only. No login, no backend, no cloud.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    color: colors.text,
    borderRadius: radius.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  settingTextBlock: {
    flex: 1,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  settingDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.button,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  clearButton: {
    backgroundColor: colors.dangerBg,
    paddingVertical: 14,
    borderRadius: radius.button,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  clearButtonText: {
    color: colors.dangerText,
    fontSize: 15,
    fontWeight: "900",
  },
  footerNote: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
});