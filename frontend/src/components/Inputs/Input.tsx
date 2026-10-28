import { ReactNode, useState } from 'react';
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

type InputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rightIcon?: ReactNode;
  options?: string[];
  isDate?: boolean;
};

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  rightIcon,
  options,
  isDate = false,
}: InputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(2000);

  const isSelect = Array.isArray(options) && options.length > 0;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const calendarCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleSelectDay = (day: number) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(viewMonth + 1).padStart(2, '0');
    const formatted = `${dd}/${mm}/${viewYear}`;
    onChangeText?.(formatted);
    setIsCalendarOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateTextChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    onChangeText?.(formatted);
  };

  return (
    <View className="w-full mb-[14px]">
      <Text className="text-[15px] text-[#080909] mb-[6px]">{label}</Text>

      {isSelect ? (
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsOpen((prev) => !prev)}
            className="flex-row items-center justify-center bg-[#F5EDED] border border-[#9E9595] rounded-[22px] h-[42px] px-[16px] relative outline-none focus:outline-none"
          >
            <Text
              className={`text-[13px] text-center tracking-wide ${
                value ? 'text-[#080909]' : 'text-[#9A9090]'
              }`}
            >
              {value || placeholder}
            </Text>
            {rightIcon && (
              <View className="absolute right-[16px]">{rightIcon}</View>
            )}
          </TouchableOpacity>

          {isOpen && (
            <View className="bg-[#F5EDED] border border-[#9E9595] rounded-[16px] mt-[4px] overflow-hidden">
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    onChangeText?.(option);
                    setIsOpen(false);
                  }}
                  className="py-[10px] px-[16px] border-b border-[#E5DCDC] outline-none focus:outline-none"
                >
                  <Text className="text-[13px] text-center text-[#080909]">
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ) : isDate ? (
        <View>
          <View className="flex-row items-center justify-center bg-[#F5EDED] border border-[#9E9595] rounded-[22px] h-[42px] px-[16px] relative">
            <TextInput
              value={value}
              onChangeText={handleDateTextChange}
              placeholder={isFocused ? '' : placeholder}
              placeholderTextColor="#9A9090"
              keyboardType="numeric"
              onFocus={() => {
                setIsFocused(true);
                setIsCalendarOpen(true);
              }}
              onBlur={() => setIsFocused(false)}
              underlineColorAndroid="transparent"
              className="flex-1 h-full text-center text-[13px] text-[#080909] tracking-wide py-0 bg-transparent outline-none focus:outline-none border-0"
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsCalendarOpen((prev) => !prev)}
              className="absolute right-[16px] outline-none focus:outline-none"
            >
              <Feather name="calendar" size={16} color="#7A7070" />
            </TouchableOpacity>
          </View>

          {isCalendarOpen && (
            <View className="bg-[#F5EDED] border border-[#9E9595] rounded-[18px] mt-[6px] p-[12px] shadow-sm">
              {/* Year Navigation */}
              <View className="flex-row items-center justify-between mb-[6px] px-[8px]">
                <TouchableOpacity
                  onPress={() => setViewYear((y) => y - 1)}
                  className="p-[4px]"
                >
                  <AntDesign name="left" size={13} color="#6B0889" />
                </TouchableOpacity>
                <Text className="text-[14px] font-bold text-[#6B0889]">
                  {viewYear}
                </Text>
                <TouchableOpacity
                  onPress={() => setViewYear((y) => y + 1)}
                  className="p-[4px]"
                >
                  <AntDesign name="right" size={13} color="#6B0889" />
                </TouchableOpacity>
              </View>

              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-[10px] px-[8px]">
                <TouchableOpacity onPress={handlePrevMonth} className="p-[4px]">
                  <AntDesign name="left" size={13} color="#080909" />
                </TouchableOpacity>
                <Text className="text-[13px] font-semibold text-[#080909]">
                  {MONTHS[viewMonth]}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} className="p-[4px]">
                  <AntDesign name="right" size={13} color="#080909" />
                </TouchableOpacity>
              </View>

              {/* Weekdays Header */}
              <View className="flex-row justify-between mb-[4px]">
                {WEEKDAYS.map((dayLabel, idx) => (
                  <View
                    key={idx}
                    className="w-[14.28%] items-center justify-center"
                  >
                    <Text className="text-[11px] font-bold text-[#7A7070]">
                      {dayLabel}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Days Grid */}
              <View className="flex-row flex-wrap">
                {calendarCells.map((day, idx) => {
                  const formattedCell =
                    day !== null
                      ? `${String(day).padStart(2, '0')}/${String(
                          viewMonth + 1
                        ).padStart(2, '0')}/${viewYear}`
                      : '';
                  const isSelected = day !== null && value === formattedCell;

                  return (
                    <View
                      key={idx}
                      className="w-[14.28%] h-[30px] items-center justify-center"
                    >
                      {day !== null && (
                        <TouchableOpacity
                          onPress={() => handleSelectDay(day)}
                          className={`w-[26px] h-[26px] rounded-[13px] items-center justify-center ${
                            isSelected ? 'bg-[#F09545]' : ''
                          }`}
                        >
                          <Text
                            className={`text-[12px] ${
                              isSelected
                                ? 'text-white font-bold'
                                : 'text-[#080909]'
                            }`}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      ) : (
        <View className="flex-row items-center justify-center bg-[#F5EDED] border border-[#9E9595] rounded-[22px] h-[42px] px-[16px] relative">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={isFocused ? '' : placeholder}
            placeholderTextColor="#9A9090"
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            underlineColorAndroid="transparent"
            className="flex-1 h-full text-center text-[13px] text-[#080909] tracking-wide py-0 bg-transparent outline-none focus:outline-none border-0"
          />
          {secureTextEntry ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-[16px] outline-none focus:outline-none"
            >
              <Feather
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={16}
                color="#7A7070"
              />
            </TouchableOpacity>
          ) : (
            rightIcon && (
              <View className="absolute right-[16px]">{rightIcon}</View>
            )
          )}
        </View>
      )}
    </View>
  );
}
