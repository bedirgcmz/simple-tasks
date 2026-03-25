import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const CATEGORY_COLORS = {
  School:    { bg: 'rgba(167,139,250,0.13)', border: 'rgba(167,139,250,0.38)', text: '#c4b5fd', dot: '#a78bfa' },
  Finance:   { bg: 'rgba(96,165,250,0.13)',  border: 'rgba(96,165,250,0.38)',  text: '#93c5fd', dot: '#60a5fa' },
  Shopping:  { bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.35)',  text: '#86efac', dot: '#4ade80' },
  Family:    { bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.35)',  text: '#fdba74', dot: '#fb923c' },
  Travel:    { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.35)',  text: '#fde68a', dot: '#fbbf24' },
  Health:    { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.35)',  text: '#6ee7b7', dot: '#34d399' },
  Home:      { bg: 'rgba(180,120,80,0.13)',  border: 'rgba(180,120,80,0.35)',  text: '#d4a885', dot: '#b47850' },
  Friends:   { bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.35)', text: '#f9a8d4', dot: '#f472b6' },
  Work:      { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.32)', text: '#cbd5e1', dot: '#94a3b8' },
  Fun:       { bg: 'rgba(103,232,249,0.12)', border: 'rgba(103,232,249,0.35)', text: '#a5f3fc', dot: '#67e8f9' },
  Others:    { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', text: '#fca5a5', dot: '#f87171' },
};

const DEFAULT_COLOR = { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.80)', dot: 'rgba(255,255,255,0.50)' };

const CATEGORY_MAP = {
  Okul: 'School', Finans: 'Finance', Alışveriş: 'Shopping', Aile: 'Family',
  Seyahat: 'Travel', Sağlık: 'Health', Ev: 'Home', Arkadaşlar: 'Friends',
  İş: 'Work', Eğlence: 'Fun', Diğerleri: 'Others',
  Skola: 'School', Ekonomi: 'Finance', Familj: 'Family', Resa: 'Travel',
  Hälsa: 'Health', Hem: 'Home', Vänner: 'Friends', Arbete: 'Work',
  Nöje: 'Fun', Övrigt: 'Others',
  Schule: 'School', Finanzen: 'Finance', Einkaufen: 'Shopping', Familie: 'Family',
  Reisen: 'Travel', Gesundheit: 'Health', Zuhause: 'Home', Freunde: 'Friends',
  Arbeit: 'Work', 'Spaß': 'Fun', Sonstiges: 'Others',
};

const CategoryCard = ({ category, completed, total, percentage }) => {
  const englishKey = CATEGORY_COLORS[category] ? category : (CATEGORY_MAP[category] ?? category);
  const colors = CATEGORY_COLORS[englishKey] ?? DEFAULT_COLOR;

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/filter', params: { from: category } })}
      style={{
        width: 96,
        height: 104,
        marginRight: 10,
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 16,
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      {/* Color dot */}
      <View style={{
        width: 7, height: 7, borderRadius: 4,
        backgroundColor: colors.dot,
        shadowColor: colors.dot,
        shadowOpacity: 0.7,
        shadowRadius: 4,
      }} />

      {/* Category name */}
      <Text
        numberOfLines={2}
        style={{ color: colors.text, fontSize: 12, fontWeight: '700', lineHeight: 16 }}
      >
        {category}
      </Text>

      {/* Stats */}
      <View>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
          {completed}/{total}
        </Text>
        <Text style={{ color: colors.dot, fontSize: 11, fontWeight: '600', marginTop: 1 }}>
          {percentage}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
