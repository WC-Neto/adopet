import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footers/Footer"
import Header from "../components/Headers/Header"
import { Stack } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header 
        backgroundColor="#4897eb"
        leftContent={<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>ADOPET</Text>}
        rightContent={
            <View style={{ flexDirection: 'row' }}>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Adoção</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sobre</Text>
                </TouchableOpacity>
            </View>
        }
      />
      
      <View style={styles.content}>
        <Text>Edit src/app/index.tsx to edit this screen.</Text>
      </View>
      
      <Footer backgroundColor="#4A90F2" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  button: { 
      backgroundColor: '#080909', 
      padding: 10, 
      margin: 5,
      borderRadius: 5, 
  },
 
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});