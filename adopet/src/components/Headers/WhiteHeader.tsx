import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function WhiteHeader() {
    {/* Header Container */}
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: '#FAFCFF'
        }}>
            
            {/*  Menu Lateral */}
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text>Menu Lateral</Text>
            </View>

            {/* Logo */}
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6B0889' }}>ADOPET</Text>
            </View>
            
            
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
               
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