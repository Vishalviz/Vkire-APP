import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, Typography, Shadows } from '../constants/designSystem';
import { useNavigation } from '@react-navigation/native';

const mockServices = [
  { id: 1, service: 'Wedding Photography', price: 25000 },
  { id: 2, service: 'Event Videography', price: 20000 },
  { id: 3, service: 'Portrait Session', price: 8000 },
  { id: 4, service: 'Corporate Headshot', price: 4000 },
];

const PriceListEditorScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [prices, setPrices] = useState(() => mockServices.map(s => ({ ...s })));
  const handlePriceChange = (id, value) => {
    setPrices(prev => prev.map(p => p.id === id ? { ...p, price: parseInt(value, 10) || 0 } : p));
  };
  const handleSave = () => {
    // Save logic here
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing['2xl'], paddingBottom: Spacing.md, backgroundColor: colors.surface, borderBottomWidth: 0.5, borderBottomColor: colors.gray200 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.primary} /></TouchableOpacity>
        <Text style={{ fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: colors.gray900, marginLeft: Spacing.md }}>Edit Price List</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: Spacing.lg }} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        {prices.map(item => (
          <View key={item.id} style={{ backgroundColor: colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, ...Shadows.md }}>
            <Text style={{ color: colors.gray700, fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semiBold, marginBottom: Spacing.md }}>{item.service}</Text>
            <TextInput
              value={item.price.toString()}
              onChangeText={(v) => handlePriceChange(item.id, v)}
              keyboardType="numeric"
              style={{ backgroundColor: colors.gray100, borderColor: colors.gray300, borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: Typography.fontSize.base, color: colors.gray900 }}
              placeholder="Enter price"
              placeholderTextColor={colors.gray500}
            />
          </View>
        ))}
      </ScrollView>
      <View style={{ padding: Spacing.lg, backgroundColor: colors.surface, borderTopWidth: 0.5, borderTopColor: colors.gray200 }}>
        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: colors.primary, padding: Spacing.lg, borderRadius: BorderRadius.xl, alignItems: 'center', ...Shadows.sm }}>
          <Text style={{ color: colors.white, fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semiBold }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PriceListEditorScreen;
