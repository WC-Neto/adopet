import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
// 1. Import FontAwesome from Expo Vector Icons
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function Footer({ backgroundColor }: { backgroundColor: string }) {
    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor 
        }}>
            {/* Logo */}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>ADOPET</Text>
                <Image 
                   source={require('../../../assets/images/logo.png')} 
                   style={{ width: 50, height: 50, marginLeft: 10 }} 
                   resizeMode="contain" 
                />
            </View>
            
            {/* Socials */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 20, marginTop: 15, paddingBottom: 10 }}>
                <TouchableOpacity>
                    <Entypo name="facebook" size={14} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="linkedin" size={14} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="youtube" size={14} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome5 name="instagram" size={14} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}