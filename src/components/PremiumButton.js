import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../theme/themeColors';

/**
 * 🎨 Premium Button Component
 * Flexible button with gradient, icon support, and loading state
 *
 * @param {string} variant - 'primary' | 'danger' | 'success' | 'secondary'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} label - Button text
 * @param {Function} onPress - Handler
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {ReactNode} leftIcon - Icon on left
 * @param {ReactNode} rightIcon - Icon on right (or default arrow)
 * @param {boolean} fullWidth - 100% width
 */
export const PremiumButton = ({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  showArrow = true,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Variant gradients
  const variantMap = {
    primary: THEME.gradient.primary,    // Blue
    danger: THEME.gradient.danger,      // Red
    success: THEME.gradient.success,    // Green
    warning: THEME.gradient.warning,    // Amber
    secondary: [THEME.background.glass, THEME.background.glass],
  };

  // Size map
  const sizeMap = {
    sm: { px: 'px-3', py: 'py-1', text: 'text-sm', gap: 'gap-1' },
    md: { px: 'px-4', py: 'py-2', text: 'text-base', gap: 'gap-2' },
    lg: { px: 'px-6', py: 'py-3', text: 'text-lg', gap: 'gap-3' },
  };

  const sizeConfig = sizeMap[size];
  const gradientColors = variantMap[variant];
  const isDisabled = disabled || loading;
  const width = fullWidth ? 'w-full' : '';

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`
        rounded-xl
        overflow-hidden
        shadow-lg
        ${width}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        className={`
          flex-row
          items-center
          justify-center
          ${sizeConfig.px}
          ${sizeConfig.py}
          ${sizeConfig.gap}
        `}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View>
            {leftIcon}
          </View>
        )}

        {/* Loading Indicator or Label */}
        {loading ? (
          <View className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <Text className={`${sizeConfig.text} text-white font-semibold tracking-tight`}>
            {label}
          </Text>
        )}

        {/* Right Icon */}
        {(rightIcon || (showArrow && !loading)) && (
          <View>
            {rightIcon}
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

/**
 * Variant: Icon Button (circular)
 */
export const IconButton = ({
  icon,
  onPress,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const gradientColors = {
    primary: THEME.gradient.primary,
    danger: THEME.gradient.danger,
    success: THEME.gradient.success,
  }[variant];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`${sizeMap[size]} rounded-full overflow-hidden shadow-lg ${className}`}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        className="flex-1 items-center justify-center"
      >
        {icon}
      </TouchableOpacity>
    </LinearGradient>
  );
};

/**
 * Variant: Glass Button (secondary style)
 */
export const GlassButton = ({
  label,
  onPress,
  leftIcon = null,
  rightIcon = null,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { px: 'px-2', py: 'py-1', text: 'text-xs' },
    md: { px: 'px-3', py: 'py-2', text: 'text-sm' },
    lg: { px: 'px-4', py: 'py-3', text: 'text-base' },
  };

  const sizeConfig = sizeMap[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className={`
        flex-row
        items-center
        gap-2
        ${sizeConfig.px}
        ${sizeConfig.py}
        rounded-lg
        border
        border-white/15
        bg-white/8
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {leftIcon && <View>{leftIcon}</View>}
      <Text className={`${sizeConfig.text} text-white font-semibold`}>
        {label}
      </Text>
      {rightIcon && <View>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

export default PremiumButton;
