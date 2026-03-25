/**
 * 🎨 Premium Theme Color System
 * Dark gradient background with premium accents
 * Glassmorphism + Modern design
 */

export const THEME = {
  // ==================
  // BACKGROUNDS
  // ==================
  background: {
    primary: 'rgba(255,255,255,0.08)',      // Card base
    secondary: 'rgba(255,255,255,0.05)',    // Darker cards
    subtle: 'rgba(255,255,255,0.03)',       // Subtle sections
    glass: 'rgba(255,255,255,0.06)',        // Glassmorphism
  },

  // ==================
  // GRADIENTS
  // ==================
  gradient: {
    // Status gradients
    done: ['#0d9488', '#0f766e'],            // Teal
    pending: ['#4f46e5', '#3730a3'],         // Indigo
    important: ['#f97316', '#ea580c'],       // Orange

    // Action gradients
    primary: ['#60a5fa', '#3b82f6'],         // Edit - Blue
    danger: ['#f87171', '#ef4444'],          // Delete - Red
    success: ['#4ade80', '#22c55e'],         // Success - Green
    warning: ['#fbbf24', '#f59e0b'],         // Warning - Amber
  },

  // ==================
  // ACCENT COLORS
  // ==================
  accent: {
    blue: '#60a5fa',
    green: '#4ade80',
    red: '#f87171',
    amber: '#fbbf24',
    purple: '#a78bfa',
    pink: '#f472b6',
  },

  // ==================
  // TEXT COLORS
  // ==================
  text: {
    primary: '#ffffff',              // Main text
    secondary: 'rgba(255,255,255,0.8)',   // Secondary
    tertiary: 'rgba(255,255,255,0.6)',    // Tertiary
    muted: 'rgba(255,255,255,0.4)',       // Muted
  },

  // ==================
  // BORDERS & DIVIDERS
  // ==================
  border: {
    primary: 'rgba(255,255,255,0.15)',     // Strong border
    secondary: 'rgba(255,255,255,0.10)',   // Medium border
    subtle: 'rgba(255,255,255,0.05)',      // Subtle border
  },

  // ==================
  // SHADOWS
  // ==================
  shadow: {
    sm: 'rgba(0,0,0,0.1)',
    md: 'rgba(0,0,0,0.2)',
    lg: 'rgba(0,0,0,0.3)',
  },

  // ==================
  // SEMANTIC COLORS
  // ==================
  semantic: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
};

/**
 * Tailwind-compatible color shortcuts
 */
export const TC = {
  // Card backgrounds
  cardBg: 'bg-white/8',
  cardBgDark: 'bg-white/5',

  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-white/80',
  textTertiary: 'text-white/60',
  textMuted: 'text-white/40',

  // Borders
  borderPrimary: 'border-white/15',
  borderSecondary: 'border-white/10',
  borderSubtle: 'border-white/5',

  // Badges
  badgeBlue: 'bg-blue-500/20 border-blue-400/30',
  badgeGreen: 'bg-green-500/20 border-green-400/30',
  badgeRed: 'bg-red-500/20 border-red-400/30',
  badgeAmber: 'bg-amber-500/20 border-amber-400/30',
};

/**
 * Helper function to get gradient colors based on status
 */
export const getStatusGradient = (status) => {
  return status === 'done' ? THEME.gradient.done : THEME.gradient.pending;
};

/**
 * Helper function to get status color
 */
export const getStatusColor = (status) => {
  return status === 'done' ? '#0d9488' : '#4f46e5';
};
