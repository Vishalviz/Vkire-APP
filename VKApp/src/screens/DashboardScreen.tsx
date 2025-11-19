import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/AppThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { LightColors } from '../constants/designSystem';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const DashboardScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  // Mock data for demo
  const stats = {
    totalEarnings: 125000,
    completedJobs: 8,
    pendingInquiries: 3,
    rating: 4.8,
  };
  const recentInquiries = [
    { id: '1', customerName: 'Priya Sharma', service: 'Wedding Photography', date: '2024-10-15', amount: 25000, status: 'pending' },
    { id: '2', customerName: 'Amit Kumar', service: 'Portfolio Shoot', date: '2024-10-20', amount: 15000, status: 'pending' },
  ];
  const getStatusColor = (status: string) => (status === 'pending' ? colors.warning : colors.success);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.gray200 }]}>
        <Text style={[styles.title, { color: colors.gray900 }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.gray600 }]}>Your photography business overview</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIcon}>
              <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.gray900 }]}>₹{stats.totalEarnings.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Total Earnings</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.gray900 }]}>{stats.completedJobs}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Completed Jobs</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.gray900 }]}>{stats.pendingInquiries}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Pending Inquiries</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIcon}>
              <Ionicons name="star-outline" size={24} color="#FFD700" />
            </View>
            <Text style={[styles.statValue, { color: colors.gray900 }]}>{stats.rating}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Rating</Text>
          </View>
        </View>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.gray900 }]}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('PortfolioManager')}
            >
              <Ionicons name="images-outline" size={32} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.gray900 }]}>Manage Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate('PriceListEditor')}>
              <Ionicons name="settings-outline" size={32} color={colors.gray500} />
              <Text style={[styles.actionText, { color: colors.gray900 }]}>Update Pricing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface }]} onPress={() => setAnalyticsVisible(true)}>
              <Ionicons name="analytics-outline" size={32} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.gray900 }]}>View Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Recent Inquiries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.gray900 }]}>Recent Inquiries</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentInquiries.map((inquiry) => (
            <TouchableOpacity key={inquiry.id} style={[styles.inquiryCard, { backgroundColor: colors.surface }]}>
              <View style={styles.inquiryHeader}>
                <View style={styles.inquiryInfo}>
                  <Text style={[styles.customerName, { color: colors.gray900 }]}>{inquiry.customerName}</Text>
                  <Text style={[styles.service, { color: colors.gray600 }]}>{inquiry.service}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inquiry.status) }]}>
                  <Text style={styles.statusText}>{inquiry.status.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.inquiryDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.gray500} />
                  <Text style={[styles.detailText, { color: colors.gray500 }]}>{inquiry.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="card-outline" size={16} color={colors.gray500} />
                  <Text style={[styles.detailText, { color: colors.gray500 }]}>₹{inquiry.amount.toLocaleString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Analytics Modal */}
      <Modal
        visible={analyticsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAnalyticsVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.black + '55', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 24, width: 340, maxWidth: '95%', ...Shadows.lg }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.gray900, marginBottom: 12 }}>Analytics Overview</Text>
            <Text style={{ color: colors.gray600, marginBottom: 16 }}>
              Your recent business performance at-a-glance
            </Text>
            <View style={{ gap: 12, marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="wallet-outline" size={22} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, color: colors.gray900, fontWeight: '600' }}>Total Earnings:</Text>
                <Text style={{ color: colors.success, fontWeight: '700', fontSize: 16 }}>₹{stats.totalEarnings.toLocaleString()}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="checkmark-circle-outline" size={22} color={colors.success} style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, color: colors.gray900, fontWeight: '600' }}>Completed Jobs:</Text>
                <Text style={{ color: colors.gray900, fontWeight: '700', fontSize: 16 }}>{stats.completedJobs}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="time-outline" size={22} color={colors.warning} style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, color: colors.gray900, fontWeight: '600' }}>Pending Inquiries:</Text>
                <Text style={{ color: colors.warning, fontWeight: '700', fontSize: 16 }}>{stats.pendingInquiries}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star-outline" size={22} color="#FFD700" style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, color: colors.gray900, fontWeight: '600' }}>Rating:</Text>
                <Text style={{ color: colors.gray900, fontWeight: '700', fontSize: 16 }}>{stats.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 10, marginTop: 4 }} onPress={() => setAnalyticsVisible(false)}>
              <Text style={{ color: colors.white, fontWeight: '600', textAlign: 'center', fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: 60,
    backgroundColor: LightColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: LightColors.gray200,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: LightColors.gray900,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: LightColors.gray600,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    backgroundColor: LightColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    ...Shadows.md,
  },
  statIcon: {
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: LightColors.gray900,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: LightColors.gray600,
    textAlign: 'center',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: LightColors.gray900,
  },
  seeAllText: {
    fontSize: Typography.fontSize.base,
    color: LightColors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionCard: {
    backgroundColor: LightColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    flex: 1,
    ...Shadows.md,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: LightColors.gray900,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  inquiryCard: {
    backgroundColor: LightColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  inquiryInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: LightColors.gray900,
    marginBottom: Spacing.xs,
  },
  service: {
    fontSize: Typography.fontSize.sm,
    color: LightColors.gray600,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: LightColors.white,
  },
  inquiryDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: LightColors.gray600,
  },
});

export default DashboardScreen;
