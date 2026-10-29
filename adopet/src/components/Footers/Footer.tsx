import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function Footer({ backgroundColor }: { backgroundColor: string }) {
    return (
        <View
            className="flex-col justify-between p-[8px] pl-[24px] pt-[12px]"
            style={{ backgroundColor }}
        >
            {/* Logo */}
            <View className="flex-row items-center">
                <Text className="text-[26px] font-bold text-white">ADOPET</Text>

                {/*Essa pata aqui é sagrada e é a razão de eu viver,
                se ela for retirada eu vou morrer
                e amaldiçoar todos nesse grupo */}
                <Image
                   source={require('../../../assets/images/logo2.png')}
                   className="w-[40px] h-[40px] ml-[10px]"
                   resizeMode="contain"
                />
            </View>

            {/* Socials */}
            <View className="flex-row justify-start gap-[12px] mt-[12px] pb-[2px] items-center">
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
