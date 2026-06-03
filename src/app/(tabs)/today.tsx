import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { REZE_THEME } from "../../constants/rezeTheme";
import {
  EventItem,
  Reminder,
  getEvents,
  getReminders,
} from "../../lib/storage";

const colors = REZE_THEME.colors;
const radius = REZE_THEME.radius;

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
          Your Reze snapshot. Clean, local, and suspiciously organized.
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
              No reminders saved yet. Reze sees the empty list, JB.
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
              No events saved yet. Your calendar is acting innocent.
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
    flex: 1,
  },
  contentInner: {
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    color: colors.primarySoft,
    fontSize: 30,
    fontWeight: "900",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    fontWeight: "700",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 5,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  itemMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  itemNote: {
    color: colors.primarySoft,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  completedText: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
});