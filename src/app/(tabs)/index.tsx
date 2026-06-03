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

import { getSettings } from "../../lib/storage";

type Message = {
  id: number;
  sender: "user" | "reze";
  text: string;
};

function getRezeReply(input: string, userName: string) {
  const message = input.toLowerCase().trim();

  if (!message) {
    return `Say something first, ${userName}. I can't read empty air 😏`;
  }

  if (
    message.includes("hi") ||
    message.includes("hello") ||
    message.includes("hey")
  ) {
    return `Hey ${userName}. Reze is awake. Try not to cause chaos immediately 😌`;
  }

  if (
    message.includes("bored") ||
    message.includes("boring") ||
    message.includes("nothing to do")
  ) {
    return `Bored already, ${userName}? Fine. Do one tiny task for 5 minutes. If you still hate it, I’ll allow dramatic complaining.`;
  }

  if (
    message.includes("sleep") ||
    message.includes("tired") ||
    message.includes("late")
  ) {
    return `${userName}, your sleep schedule is not immortal. Go rest before your brain files a complaint 😴`;
  }

  if (
    message.includes("study") ||
    message.includes("exam") ||
    message.includes("assignment")
  ) {
    return `Good. Study mode then, ${userName}. Pick one small topic, set 25 minutes, and don’t run away this time 📚`;
  }

  if (
    message.includes("game") ||
    message.includes("gaming") ||
    message.includes("play")
  ) {
    return `Games are fine, ${userName}. But if one match becomes four hours, I’m judging you silently 🎮`;
  }

  if (message.includes("reminder") || message.includes("remind")) {
    return `Reminder saving works now, ${userName}. Actual notifications need a development build later 🔔`;
  }

  return `Hmm. I heard you, ${userName}. I’m still a simple V1 assistant, so don’t expect genius-level magic yet.`;
}

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

  function sendMessage() {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
    };

    const rezeMessage: Message = {
      id: Date.now() + 1,
      sender: "reze",
      text: getRezeReply(trimmedInput, userName),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      rezeMessage,
    ]);

    setInput("");
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Reze Chat</Text>
        <Text style={styles.subtitle}>Offline rule-based assistant</Text>
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
          placeholderTextColor="#77778a"
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
    borderRadius: 18,
  },
  rezeBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#151522",
    borderTopLeftRadius: 6,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#ff4f8b",
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  rezeText: {
    color: "#f4f4f7",
  },
  userText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#202032",
    backgroundColor: "#0d0d16",
  },
  input: {
    flex: 1,
    backgroundColor: "#171725",
    color: "#f4f4f7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#26263a",
  },
  sendButton: {
    backgroundColor: "#ff4f8b",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});