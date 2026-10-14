import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/Footers/Footer";
import Header from "../components/Headers/Header";
import { Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/build/AntDesign";

export default function Index() {
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      
      <SafeAreaView edges={['top']} style={styles.topSafeArea}>
        <Header 
          backgroundColor="#FAFCFF"
          leftContent={<AntDesign name="menu" size={26} color="black" />}
          centerContent={<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B0889' }}>ADOPET</Text>}
          rightContent={
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Adotar</Text>
              </TouchableOpacity>   
            </View>
          }
        />
      </SafeAreaView>
      
      
      <View style={styles.content}>
        <Text>Edit src/app/index.tsx to edit this screen.</Text>
      </View>
      
      
      <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
        <Footer backgroundColor="#6B0889" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F09545', 
  },
  topSafeArea: {
    backgroundColor: '#FAFCFF',
    zIndex: 10, 
  },
  bottomSafeArea: {
    backgroundColor: '#6B0889', 
  },
  button: { 
    backgroundColor: '#080909', 
    padding: 10, 
    margin: 5,
    borderRadius: 5, 
    elevation: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F09545',
  }
});