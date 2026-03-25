import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * 🎨 InfoSection Component
 * Reusable structured information display with icon, label, and value
 * Used in: ToDoDetailsCard, EditTodo, Stats screens, etc.
 *
 * @param {string} icon - Ionicons icon name
 * @param {string} iconColor - Icon color (default: #60a5fa)
 * @param {string} label - Label text (uppercase)
 * @param {string | ReactNode} value - Value or content to display
 * @param {boolean} highlight - Highlight the value in blue (default: false)
 * @param {string} className - Additional Tailwind classes
 */
export const InfoSection = ({
  icon,
  iconColor = '#60a5fa',
  label,
  value,
  highlight = false,
  className = '',
}) => {
  return (
    <View className={`bg-white/5 rounded-lg p-3 border border-white/10 ${className}`}>
      {/* Label with icon */}
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons name={icon} size={14} color={iconColor} />
        <Text className="text-white/60 text-xs uppercase tracking-wider">
          {label}
        </Text>
      </View>

      {/* Value */}
      <Text className={`text-white text-base font-semibold ml-6 ${highlight ? 'text-blue-300' : ''}`}>
        {value}
      </Text>
    </View>
  );
};

/**
 * MultiValue variant for displaying multiple pieces of information
 */
export const MultiValueInfoSection = ({
  icon,
  iconColor = '#60a5fa',
  label,
  values = [], // Array of [label, value] pairs
  className = '',
}) => {
  return (
    <View className={`bg-white/5 rounded-lg p-3 border border-white/10 ${className}`}>
      {/* Header with icon */}
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name={icon} size={14} color={iconColor} />
        <Text className="text-white/60 text-xs uppercase tracking-wider">
          {label}
        </Text>
      </View>

      {/* Values */}
      <View className="ml-6 gap-2">
        {values.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <Text className="text-white/70 text-sm">{item.label}</Text>
            <Text className="text-white font-semibold text-sm">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Compact variant for smaller displays (TodoCard, list items, etc.)
 */
export const CompactInfoSection = ({
  icon,
  iconColor = '#93c5fd',
  label,
  value,
  className = '',
}) => {
  return (
    <View className={`flex-row items-center gap-2 bg-white/5 rounded-lg px-2 py-1 ${className}`}>
      <Ionicons name={icon} size={12} color={iconColor} />
      <View className="flex-1">
        <Text className="text-white/60 text-xs">{label}</Text>
        <Text className="text-white/90 text-xs font-semibold">{value}</Text>
      </View>
    </View>
  );
};

export default InfoSection;
