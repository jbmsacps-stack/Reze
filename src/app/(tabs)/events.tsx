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
  EventItem,
  getEvents,
  saveEvents,
} from "../../lib/storage";

const colors = REZE_THEME.colors;
const radius = REZE_THEME.radius;

export default function EventsScreen() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [note, setNote] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);

useFocusEffect(
  useCallback(() => {
    loadEvents();
  }, [])
);

  async function loadEvents() {
    const savedEvents = await getEvents();
    setEvents(savedEvents);
  }

  async function addEvent() {
    const trimmedTitle = title.trim();
    const trimmedDateTime = dateTime.trim();
    const trimmedNote = note.trim();

    if (!trimmedTitle) {
      Alert.alert("Missing title", "Give the event a title first, JB 😏");
      return;
    }

    const newEvent: EventItem = {
      id: Date.now().toString(),
      title: trimmedTitle,
      dateTime: trimmedDateTime || "No date/time set",
      note: trimmedNote || undefined,
    };

    const updatedEvents = [newEvent, ...events];

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);

    setTitle("");
    setDateTime("");
    setNote("");

    Alert.alert("Saved", "Event saved, JB. Reze has it noted 🗓️");
  }

  async function deleteEvent(id: string) {
    const updatedEvents = events.filter((event) => event.id !== id);

    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>
          Add plans manually. Reze will keep the schedule tidy.
        </Text>
      </View>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Date/time e.g. Tomorrow 10:00 AM"
          placeholderTextColor={colors.textMuted}
          value={dateTime}
          onChangeText={setDateTime}
        />

        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Optional note"
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity style={styles.addButton} onPress={addEvent}>
          <Text style={styles.addButtonText}>Save Event</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptyText}>
              Your schedule is quiet. Suspiciously quiet.
            </Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventMain}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.dateTime}</Text>

                {event.note ? (
                  <Text style={styles.eventNote}>{event.note}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteEvent(event.id)}
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
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  eventMain: {
    gap: 5,
  },
  eventTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  eventDate: {
    color: colors.textMuted,
    fontSize: 13,
  },
  eventNote: {
    color: colors.primarySoft,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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