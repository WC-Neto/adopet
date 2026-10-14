import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function BlueHeader() {
     {/* Header container */}
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: '#4897eb'
        }}>
            {/* Logo */}
            <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>ADOPET</Text>
            </View>
            
            {/* Buttons container */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
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
        </View>
    );
}

const styles = StyleSheet.create({
  button: { 
      backgroundColor: '#080909', 
      padding: 10, 
      margin: 5,
      borderRadius: 5 
  },
  buttonText: {
      color: 'white'
  }
});