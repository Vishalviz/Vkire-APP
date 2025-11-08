import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../contexts/AppThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, Typography, Shadows } from '../constants/designSystem';
import { useNavigation } from '@react-navigation/native';
import { LightColors } from '../constants/designSystem';

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
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.primary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Price List</Text>
      </View>
      <ScrollView style={styles.scrollViewContent}>
        {prices.map(item => (
          <View key={item.id} style={styles.serviceCard}>
            <Text style={styles.serviceName}>{item.service}</Text>
            <TextInput
              value={item.price.toString()}
              onChangeText={(v) => handlePriceChange(item.id, v)}
              keyboardType="numeric"
              style={styles.priceInput}
              placeholder="Enter price"
              placeholderTextColor={LightColors.gray500}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PriceListEditorScreen;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.md,
    backgroundColor: LightColors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: LightColors.gray200,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: LightColors.gray900,
    marginLeft: Spacing.md,
  },
  scrollViewContent: {
    flex: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  serviceCard: {
    backgroundColor: LightColors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  serviceName: {
    color: LightColors.gray700,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.md,
  },
  priceInput: {
    backgroundColor: LightColors.gray100,
    borderColor: LightColors.gray300,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: LightColors.gray900,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: LightColors.surface,
    borderTopWidth: 0.5,
    borderTopColor: LightColors.gray200,
  },
  saveButton: {
    backgroundColor: LightColors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },
  saveButtonText: {
    color: LightColors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
