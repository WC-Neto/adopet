import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Header from "../components/Headers/Header"; 
import Footer from "../components/Footers/Footer";

export default function Inicio() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header 
          backgroundColor="#FAFCFF"
          leftContent={<Text>Menu Lateral</Text>}
          centerContent={<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B0889' }}>ADOPET</Text>}
      />
      
      <View style={styles.content}>
        <Text>Edit src/app/index.tsx to edit this screen.</Text>
      </View>  
      <Footer backgroundColor="#6B0889" />
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