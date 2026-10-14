import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import PurpleFooter from "@/components/Footers/PurpleFooter";
import WhiteHeader from "../components/Headers/WhiteHeader";

export default function Inicio() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <WhiteHeader />
      
      <View style={styles.content}>
        <Text>Edit src/app/index.tsx to edit this screen.</Text>
      </View>
      
      <PurpleFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});