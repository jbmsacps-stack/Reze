import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { REZE_THEME } from "../../constants/rezeTheme";
import {
  Reminder,
  getReminders,
  saveReminders,
} from "../../lib/storage";

const colors = REZE_THEME.colors;
const radius = REZE_THEME.radius;

export default function RemindersScreen() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);

useFocusEffect(
  useCallback(() => {
    loadReminders();
  }, [])
);

  async function loadReminders() {
    const savedReminders = await getReminders();
    setReminders(savedReminders);
  }

  async function addReminder() {
    const trimmedTitle = title.trim();
    const trimmedDateTime = dateTime.trim();

    if (!trimmedTitle) {
      Alert.alert("Missing title", "Give the reminder a title first, JB 😏");
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: trimmedTitle,
      dateTime: trimmedDateTime || "No date/time set",
      completed: false,
    };

    const updatedReminders = [newReminder, ...reminders];

    setReminders(updatedReminders);
    await saveReminders(updatedReminders);

    setTitle("");
    setDateTime("");

    Alert.alert("Saved", "Reminder saved, JB. Reze noted it properly 💜");
  }

  async function toggleReminder(id: string) {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    );

    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  }

  async function deleteReminder(id: string) {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);

    setReminders(updatedReminders);
    await saveReminders(updatedReminders);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>
          Save tasks locally. Reze will keep them waiting.
        </Text>
      </View>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Reminder title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Time note e.g. Today 8:30 PM"
          placeholderTextColor={colors.textMuted}
          value={dateTime}
          onChangeText={setDateTime}
        />

        <TouchableOpacity style={styles.addButton} onPress={addReminder}>
          <Text style={styles.addButtonText}>Save Reminder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {reminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No reminders yet</Text>
            <Text style={styles.emptyText}>
              Add one before your brain throws it into the void.
            </Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <TouchableOpacity
                style={styles.reminderMain}
                onPress={() => toggleReminder(reminder.id)}
              >
                <Text
                  style={[
                    styles.reminderTitle,
                    reminder.completed && styles.completedText,
                  ]}
                >
                  {reminder.completed ? "✓ " : ""}
                  {reminder.title}
                </Text>

                <Text style={styles.reminderDate}>{reminder.dateTime}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteReminder(reminder.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
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
  formCard: {
    margin: 16,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
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
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: radius.button,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  emptyCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  reminderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  reminderMain: {
    gap: 5,
  },
  reminderTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  reminderDate: {
    color: colors.textMuted,
    fontSize: 13,
  },
  completedText: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  deleteButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  deleteButtonText: {
    color: colors.dangerText,
    fontWeight: "800",
    fontSize: 12,
  },
});