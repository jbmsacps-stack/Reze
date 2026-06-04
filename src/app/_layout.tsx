import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setupNotifications } from "../lib/notifications";

export default function RootLayout() {
  useEffect(() => {
    setupNotifications().catch((error) => {
      console.log("[REZE] Notifications setup failed:", error);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}