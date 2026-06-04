import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { REZE_THEME } from "../../constants/rezeTheme";
import {
    RezeAIMode,
    RezeSettings,
    clearRezeData,
    getSettings,
    saveSettings,
} from "../../lib/storage";

const colors = REZE_THEME.colors;
const radius = REZE_THEME.radius;

export default function SettingsScreen() {
  const [settings, setSettings] = useState<RezeSettings>({
    userName: "JB",
    notificationsEnabled: false,
    darkModeEnabled: true,
    aiMode: "offline",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedSettings = await getSettings();
    setSettings(savedSettings);
  }

  function updateAIMode(aiMode: RezeAIMode) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      aiMode,
    }));
  }

  async function handleSaveSettings() {
    await saveSettings(settings);
    Alert.alert("Saved", "Reze settings updated.");
  }

  async function handleClearData() {
    await clearRezeData();
    await loadSettings();
    Alert.alert("Cleared", "Reze local data has been cleared.");
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Control how Reze behaves on your device.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Your Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          value={settings.userName}
          onChangeText={(text) =>
            setSettings((currentSettings) => ({
              ...currentSettings,
              userName: text,
            }))
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>AI Mode</Text>
        <Text style={styles.description}>
          Offline mode uses Reze’s local brain and works without any online API.
          Online mode is optional and can be enabled later.
        </Text>

        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              settings.aiMode === "offline" && styles.modeButtonActive,
            ]}
            onPress={() => updateAIMode("offline")}
          >
            <Text
              style={[
                styles.modeButtonText,
                settings.aiMode === "offline" && styles.modeButtonTextActive,
              ]}
            >
              Offline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              settings.aiMode === "online" && styles.modeButtonActive,
            ]}
            onPress={() => updateAIMode("online")}
          >
            <Text
              style={[
                styles.modeButtonText,
                settings.aiMode === "online" && styles.modeButtonTextActive,
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.smallNote}>
          Online mode is only a saved setting for now. We’ll connect the API
          next.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.label}>Notification Reminders</Text>
            <Text style={styles.description}>
              Placeholder for later native notification support.
            </Text>
          </View>

          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) =>
              setSettings((currentSettings) => ({
                ...currentSettings,
                notificationsEnabled: value,
              }))
            }
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.label}>Dark Mode</Text>
            <Text style={styles.description}>
              Reze is designed for a dark purple interface.
            </Text>
          </View>

          <Switch
            value={settings.darkModeEnabled}
            onValueChange={(value) =>
              setSettings((currentSettings) => ({
                ...currentSettings,
                darkModeEnabled: value,
              }))
            }
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
        V1 stores everything locally on your phone.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 14,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  smallNote: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    color: colors.text,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    fontSize: 15,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  modeButton: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primarySoft,
  },
  modeButtonText: {
    color: colors.textMuted,
    fontWeight: "900",
  },
  modeButtonTextActive: {
    color: "#ffffff",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  switchTextWrap: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },
  clearButton: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  clearButtonText: {
    color: colors.dangerText,
    fontWeight: "900",
    fontSize: 15,
  },
  footerNote: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 18,
    fontSize: 12,
  },
});