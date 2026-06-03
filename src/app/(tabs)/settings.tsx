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

import {
  RezeSettings,
  clearRezeData,
  getSettings,
  saveSettings,
} from "../../lib/storage";

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
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Control Reze&apos;s basic local preferences.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Your name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#77778a"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextBlock}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Placeholder for local notification control.
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#ff4f8b" : "#77778a"}
              trackColor={{
                false: "#2a2a40",
                true: "#5c1f38",
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
              thumbColor={darkModeEnabled ? "#ff4f8b" : "#77778a"}
              trackColor={{
                false: "#2a2a40",
                true: "#5c1f38",
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
          V1 stores everything on this phone only. No login, no backend, no cloud.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#07070d",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#202032",
  },
  title: {
    color: "#f4f4f7",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#9b9bae",
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#11111c",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252539",
    padding: 14,
  },
  label: {
    color: "#f4f4f7",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#171725",
    color: "#f4f4f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2a2a40",
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
    color: "#f4f4f7",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  settingDescription: {
    color: "#9b9bae",
    fontSize: 13,
    lineHeight: 19,
  },
  saveButton: {
    backgroundColor: "#ff4f8b",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  footerNote: {
    color: "#77778a",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
});