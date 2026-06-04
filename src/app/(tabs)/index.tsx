import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
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
import { scheduleReminderNotification } from "../../lib/notifications";
import { askOnlineReze } from "../../lib/onlineReze";
import { getRezeReply } from "../../lib/rezeBrain";
import {
  EventItem,
  getEvents,
  getReminders,
  getSettings,
  Reminder,
  RezeAIMode,
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
  const [aiMode, setAiMode] = useState<RezeAIMode>("offline");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "reze",
      text: "Hey JB, I’m Reze. Your tiny offline assistant is alive now ⚡",
    },
  ]);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const TAB_BAR_HEIGHT = 70; // matches _layout.tsx tabBarStyle height
  const INPUT_BAR_HEIGHT = 70;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadScreenSettings() {
        const settings = await getSettings();

        if (!isActive) return;

        setUserName(settings.userName);
        setAiMode(settings.aiMode);

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

      loadScreenSettings();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      const h = e.endCoordinates?.height || 0;
      setKeyboardHeight(h);
      // ensure messages are visible above keyboard
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  async function handleCommand(trimmedInput: string) {
    const command = parseChatCommand(trimmedInput);

    if (command.type === "reminder") {
      const savedReminders = await getReminders();
      const notificationId = await scheduleReminderNotification(
        command.title,
        command.dateTime
      );

      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: command.title,
        dateTime: command.dateTime,
        completed: false,
        notificationId,
      };

      await saveReminders([newReminder, ...savedReminders]);

      if (notificationId) {
        return "Done. I saved it and I’ll notify you...";
      }

      return "Done. I saved it, but I couldn’t schedule a notification for that time phrase yet.";
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

  async function getAssistantReply(trimmedInput: string) {
    console.log("REZE AI MODE:", aiMode);

    const recentMessages = [
      ...messages.slice(-8).map((message) => message.text),
      trimmedInput,
    ];

    if (aiMode === "online") {
      console.log("Trying Gemini online brain...");

      const onlineResult = await askOnlineReze(trimmedInput, {
        userName,
        recentMessages,
      });

      console.log("Gemini result:", onlineResult);

      if (onlineResult) {
        if (onlineResult.type === "chat") {
          return onlineResult.reply;
        }

        if (onlineResult.type === "reminder") {
          const savedReminders = await getReminders();

          const newReminder: Reminder = {
            id: Date.now().toString(),
            title: onlineResult.title,
            dateTime: onlineResult.dateTime,
            completed: false,
          };

          await saveReminders([newReminder, ...savedReminders]);
          return onlineResult.reply;
        }

        if (onlineResult.type === "event") {
          const savedEvents = await getEvents();

          const newEvent: EventItem = {
            id: Date.now().toString(),
            title: onlineResult.title,
            dateTime: onlineResult.dateTime,
            note: onlineResult.note || "",
          };

          await saveEvents([newEvent, ...savedEvents]);
          return onlineResult.reply;
        }
      }

      console.log("Gemini returned null. Falling back to offline Reze.");
    }

    return getRezeReply(trimmedInput, {
      userName,
      recentMessages,
    });
  }

  async function sendMessage() {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
    };

    const thinkingMessage: Message = {
      id: Date.now() + 1,
      sender: "reze",
      text: aiMode === "online" ? "Reze is thinking..." : "Reze heard you...",
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      thinkingMessage,
    ]);

    setInput("");
    setIsSending(true);

    try {
      const commandReply = await handleCommand(trimmedInput);
      const assistantReply =
        commandReply || (await getAssistantReply(trimmedInput));

      const rezeMessage: Message = {
        id: Date.now() + 2,
        sender: "reze",
        text: assistantReply,
      };

      setMessages((currentMessages) => [
        ...currentMessages.filter((message) => message.id !== thinkingMessage.id),
        rezeMessage,
      ]);
    } catch (error) {
      console.log("Reze reply failed:", error);

      const fallbackMessage: Message = {
        id: Date.now() + 3,
        sender: "reze",
        text: getRezeReply(trimmedInput, {
          userName,
          recentMessages: [
            ...messages.slice(-8).map((message) => message.text),
            trimmedInput,
          ],
        }),
      };

      setMessages((currentMessages) => [
        ...currentMessages.filter((message) => message.id !== thinkingMessage.id),
        fallbackMessage,
      ]);
    } finally {
      setIsSending(false);
    }
  }

  const isAndroid = Platform.OS === "android";

  const content = (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Reze Chat</Text>
        <Text style={styles.subtitle}>
          {aiMode === "online"
            ? "Online AI mode · offline fallback active"
            : "Offline assistant · local command mode active"}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={[
          styles.chatContent,
          {
            paddingBottom:
              INPUT_BAR_HEIGHT + (isAndroid ? Math.max(keyboardHeight - TAB_BAR_HEIGHT, 0) : 0) + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

      <View
        style={
          isAndroid
            ? [
                styles.inputBar,
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: Math.max(keyboardHeight - TAB_BAR_HEIGHT, 0),
                  height: INPUT_BAR_HEIGHT,
                  zIndex: 20,
                },
              ]
            : styles.inputBar
        }
      >
        <TextInput
          style={styles.input}
          placeholder="Talk to Reze..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          editable={!isSending}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isSending}
        >
          <Text style={styles.sendButtonText}>
            {isSending ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return isAndroid ? <View style={styles.screen}>{content}</View> : (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={"padding"}
      keyboardVerticalOffset={84}
    >
      {content}
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
    backgroundColor: colors.background,
  },
  chatContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    lineHeight: 22,
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
  sendButtonDisabled: {
    opacity: 0.55,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "900",
  },
});
