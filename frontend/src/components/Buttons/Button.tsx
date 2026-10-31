import { Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
};

export default function Button({
  title,
  backgroundColor = '#262626',
  textColor = '#FFFFFF',
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="px-[36px] py-[14px] rounded-[16px] items-center justify-center shadow-md"
      style={{ backgroundColor }}
    >
      <Text
        className="text-[18px] font-medium tracking-wider"
        style={{ color: textColor }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
