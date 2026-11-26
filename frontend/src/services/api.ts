import Constants from "expo-constants";
import { Platform } from "react-native";

const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

export const API_URL =
  Platform.OS === "web"
    ? "https://adopet-eosin.vercel.app"
    : debuggerHost
      ? `http://${debuggerHost}:8000`
      : "http://192.168.1.179:8000";

export default API_URL;
