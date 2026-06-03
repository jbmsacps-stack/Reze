import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Reminder,
  getReminders,
  saveReminders,
} from "../../lib/storage";

export default function RemindersScreen() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

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
      dateTime: trimmedDateTime || "Test notification in 10 seconds",
      completed: false,
    };

    const updatedReminders = [newReminder, ...reminders];

    setReminders(updatedReminders);
    await saveReminders(updatedReminders);

    setTitle("");
    setDateTime("");

Alert.alert(
  "Saved",
  "Reminder saved, JB. Notifications need a development build later 🔔"
);
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
          Save tasks locally. Reze will test-notify after 10 seconds.
        </Text>
      </View>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Reminder title"
          placeholderTextColor="#77778a"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Note e.g. Today 8:00 PM"
          placeholderTextColor="#77778a"
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
  formCard: {
    margin: 16,
    padding: 14,
    backgroundColor: "#11111c",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252539",
    gap: 12,
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
  addButton: {
    backgroundColor: "#ff4f8b",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "800",
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
    backgroundColor: "#11111c",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252539",
  },
  emptyTitle: {
    color: "#f4f4f7",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptyText: {
    color: "#9b9bae",
    fontSize: 14,
    lineHeight: 21,
  },
  reminderCard: {
    backgroundColor: "#11111c",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252539",
    padding: 14,
    gap: 12,
  },
  reminderMain: {
    gap: 5,
  },
  reminderTitle: {
    color: "#f4f4f7",
    fontSize: 16,
    fontWeight: "800",
  },
  reminderDate: {
    color: "#9b9bae",
    fontSize: 13,
  },
  completedText: {
    color: "#77778a",
    textDecorationLine: "line-through",
  },
  deleteButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#24141b",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4a2432",
  },
  deleteButtonText: {
    color: "#ff8caf",
    fontWeight: "700",
    fontSize: 12,

    clearButton: {
      backgroundColor: "#24141b",
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#4a2432",
    },
    clearButtonText: {
      color: "#ff8caf",
      fontSize: 15,
      fontWeight: "900",
    },
  },
});