import Constants from "expo-constants";
import { Platform } from "react-native";

const hostUri = Constants.expoConfig?.hostUri;
const host = hostUri?.replace(/:\d+$/, "");

export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : host
      ? `http://${host}:8000`
      : "http://127.0.0.1:8000")
).replace(/\/$/, "");
