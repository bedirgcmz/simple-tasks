import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme/themeColors';

/**
 * 🎨 Premium Card Component
 * Glassmorphism design with optional gradient border
 *
 * @param {Array} bgGradient - Optional gradient colors [from, to]
 * @param {boolean} isGlass - Enable glassmorphism effect (default: true)
 * @param {string} borderColor - Border color from THEME
 * @param {string} className - Tailwind classes
 * @param {ReactNode} children - Card content
 */
export const PremiumCard = ({
  bgGradient = null,
  isGlass = true,
  borderColor = 'rgba(255,255,255,0.10)',
  noPadding = false,
  className = '',
  children,
  ...props
}) => {
  const padContent = noPadding ? '' : 'p-4';

  if (bgGradient) {
    // Gradient card (for status bars, etc)
    return (
      <LinearGradient
        colors={bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`rounded-2xl shadow-lg ${className}`}
        {...props}
      >
        <View className={padContent}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  // Glass card (standard)
  return (
    <View
      className={`
        rounded-2xl
        border
        overflow-hidden
        shadow-lg
        backdrop-blur-lg
        ${isGlass ? 'bg-white/8' : 'bg-white/12'}
        ${className}
      `}
      style={{
        borderColor: borderColor,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.55,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
      }}
      {...props}
    >
      <View className={padContent}>
        {children}
      </View>
    </View>
  );
};

/**
 * Variant: InfographicsCard
 * Card with icon/label header + content
 */
export const InfoCard = ({
  icon: IconComponent,
  iconColor = '#60a5fa',
  label,
  value,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { label: 'text-xs', value: 'text-sm', padding: 'p-2' },
    md: { label: 'text-xs', value: 'text-base', padding: 'p-3' },
    lg: { label: 'text-sm', value: 'text-lg', padding: 'p-4' },
  };

  const sizes = sizeMap[size];

  return (
    <PremiumCard className={`${className}`}>
      <View className="flex-row items-start mb-2">
        {IconComponent && (
          <View style={{ marginRight: 8 }}>
            {IconComponent}
          </View>
        )}
        <Text className={`${sizes.label} text-white/60 uppercase tracking-wider`}>
          {label}
        </Text>
      </View>
      <Text className={`${sizes.value} text-white font-semibold ${IconComponent ? 'ml-6' : ''}`}>
        {value}
      </Text>
    </PremiumCard>
  );
};

export default PremiumCard;
