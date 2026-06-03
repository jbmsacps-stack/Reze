import { getRezeReply } from "../../lib/rezeBrain";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { REZE_THEME } from "../../constants/rezeTheme";
import { parseChatCommand } from "../../lib/chatCommands";
import {
  EventItem,
  Reminder,
  getEvents,
  getReminders,
  getSettings,
  saveEvents,
  saveReminders,
} from "../../lib/storage";

const colors = REZE_THEME.colors;
const radius = REZE_THEME.radius;

type Message = {
  id: number;
  sender: "user" | "reze";
  text: string;
};

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("JB");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "reze",
      text: "Hey JB, I’m Reze. Your tiny offline assistant is alive now ⚡",
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadUserName();
    }, [])
  );

  async function loadUserName() {
    const settings = await getSettings();
    setUserName(settings.userName);

    setMessages((currentMessages) => {
      if (currentMessages.length > 1) return currentMessages;

      return [
        {
          id: 1,
          sender: "reze",
          text: `Hey ${settings.userName}, I’m Reze. Your tiny offline assistant is alive now ⚡`,
        },
      ];
    });
  }

  async function handleCommand(trimmedInput: string) {
    const command = parseChatCommand(trimmedInput);

    if (command.type === "reminder") {
      const savedReminders = await getReminders();

      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: command.title,
        dateTime: command.dateTime,
        completed: false,
      };

      await saveReminders([newReminder, ...savedReminders]);

      return `Done, ${userName}. I saved this reminder: “${command.title}” — ${command.dateTime}. Don’t pretend you forgot later 😏`;
    }

    if (command.type === "event") {
      const savedEvents = await getEvents();

      const newEvent: EventItem = {
        id: Date.now().toString(),
        title: command.title,
        dateTime: command.dateTime,
        note: command.note,
      };

      await saveEvents([newEvent, ...savedEvents]);

      return `Event saved, ${userName}: “${command.title}” — ${command.dateTime}. Reze has it noted 🗓️`;
    }

    return null;
  }

  async function sendMessage() {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");

    const commandReply = await handleCommand(trimmedInput);

    const rezeMessage: Message = {
      id: Date.now() + 1,
      sender: "reze",
      text: commandReply || getRezeReply(trimmedInput, { userName }),
    };

    setMessages((currentMessages) => [...currentMessages, rezeMessage]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Reze Chat</Text>
        <Text style={styles.subtitle}>
          Offline assistant · local command mode active
        </Text>
      </View>

      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "user" ? styles.userBubble : styles.rezeBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === "user" ? styles.userText : styles.rezeText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Talk to Reze..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.bubble,
  },
  rezeBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceSoft,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  rezeText: {
    color: colors.text,
  },
  userText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    color: colors.text,
    borderRadius: radius.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.button,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "900",
  },
});