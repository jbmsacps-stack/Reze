import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  EventItem,
  Reminder,
  getEvents,
  getReminders,
} from "../../lib/storage";

export default function TodayScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadTodayData();
    }, [])
  );

  async function loadTodayData() {
    const savedReminders = await getReminders();
    const savedEvents = await getEvents();

    setReminders(savedReminders);
    setEvents(savedEvents);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>
          Your local Reze overview. No cloud, no drama.
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today&apos;s Snapshot</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{reminders.length}</Text>
              <Text style={styles.statLabel}>Reminders</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{events.length}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>

          {reminders.length === 0 ? (
            <Text style={styles.emptyText}>
              No reminders saved yet. Suspiciously peaceful, JB.
            </Text>
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.itemCard}>
                <Text
                  style={[
                    styles.itemTitle,
                    reminder.completed && styles.completedText,
                  ]}
                >
                  {reminder.completed ? "✓ " : ""}
                  {reminder.title}
                </Text>
                <Text style={styles.itemMeta}>{reminder.dateTime}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events</Text>

          {events.length === 0 ? (
            <Text style={styles.emptyText}>
              No events saved yet. Your calendar is pretending to be innocent.
            </Text>
          ) : (
            events.map((event) => (
              <View key={event.id} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{event.title}</Text>
                <Text style={styles.itemMeta}>{event.dateTime}</Text>

                {event.note ? (
                  <Text style={styles.itemNote}>{event.note}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
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
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: "#11111c",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#252539",
    padding: 16,
  },
  summaryTitle: {
    color: "#f4f4f7",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#171725",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2a2a40",
  },
  statNumber: {
    color: "#ff4f8b",
    fontSize: 28,
    fontWeight: "900",
  },
  statLabel: {
    color: "#b8b8c7",
    fontSize: 13,
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: "#f4f4f7",
    fontSize: 20,
    fontWeight: "800",
  },
  emptyText: {
    color: "#9b9bae",
    backgroundColor: "#11111c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252539",
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
  },
  itemCard: {
    backgroundColor: "#11111c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252539",
    padding: 14,
    gap: 5,
  },
  itemTitle: {
    color: "#f4f4f7",
    fontSize: 15,
    fontWeight: "800",
  },
  itemMeta: {
    color: "#9b9bae",
    fontSize: 13,
  },
  itemNote: {
    color: "#c7c7d6",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  completedText: {
    color: "#77778a",
    textDecorationLine: "line-through",
  },
});