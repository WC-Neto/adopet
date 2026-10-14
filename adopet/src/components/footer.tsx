import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';


export default function BlueFooter() {
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

        </View>

    );}