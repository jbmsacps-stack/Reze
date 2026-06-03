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
  EventItem,
  getEvents,
  saveEvents,
} from "../../lib/storage";

export default function EventsScreen() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [note, setNote] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

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
          Add simple events manually. Reze will keep them safe locally.
        </Text>
      </View>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          placeholderTextColor="#77778a"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Date/time e.g. Tomorrow 10:00 AM"
          placeholderTextColor="#77778a"
          value={dateTime}
          onChangeText={setDateTime}
        />

        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Optional note"
          placeholderTextColor="#77778a"
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
              Add one before your schedule starts acting mysterious.
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
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
  eventCard: {
    backgroundColor: "#11111c",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252539",
    padding: 14,
    gap: 12,
  },
  eventMain: {
    gap: 5,
  },
  eventTitle: {
    color: "#f4f4f7",
    fontSize: 16,
    fontWeight: "800",
  },
  eventDate: {
    color: "#9b9bae",
    fontSize: 13,
  },
  eventNote: {
    color: "#c7c7d6",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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
  },
});