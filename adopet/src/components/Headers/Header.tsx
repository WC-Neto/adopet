import { StyleSheet, View } from 'react-native';
import { ReactNode } from 'react';


type HeaderProps = {
  backgroundColor?: string;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
};


export default function Header({ 
  backgroundColor = '#4897eb',
  leftContent, 
  centerContent, 
  rightContent 
}: HeaderProps) {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Left Slot */}
            <View style={[styles.slot, { alignItems: 'flex-start' }]}>
                {leftContent}
            </View>

            {/* Center Slot */}
            <View style={[styles.slot, { alignItems: 'center' }]}>
                {centerContent}
            </View>
            
            {/* Right Slot */}
            <View style={[styles.slot, { alignItems: 'flex-end' }]}>
                {rightContent}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    slot: {
        flex: 1,
    }
});