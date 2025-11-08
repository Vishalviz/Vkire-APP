import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useLocation } from '../contexts/LocationContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useTheme } from '../contexts/AppThemeContext';

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;
type BookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Booking'>;

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const route = useRoute<BookingScreenRouteProp>();
  const { packageDetails, proDetails } = route.params || {};
  const { currentLocation, manualLocation } = useLocation();
  const { colors } = useTheme();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(undefined); // Reset time slot when date changes
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Helper function to calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTimeSlot) {
      Alert.alert('Selection Required', 'Please select both date and time slot to continue.');
      return;
    }

    // Navigate to payment screen
    navigation.navigate('Payment', {
      amount: packageDetails?.price || 0,
      bookingDetails: {
        date: selectedDate,
        time: selectedTimeSlot.time,
        location: proDetails?.location || 'To be discussed',
      },
      packageDetails,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Package Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.packageCard}>
            <Text style={styles.packageTitle}>{packageDetails?.title || 'Package'}</Text>
            <Text style={styles.packageDescription}>{packageDetails?.description || 'No description available'}</Text>
            <View style={styles.packageInfo}>
              <View style={styles.packageInfoRow}>
                <Ionicons name="time-outline" size={16} color={colors.gray600} />
                <Text style={styles.packageInfoText}>{packageDetails?.duration || 0} hours</Text>
              </View>
              <View style={styles.packageInfoRow}>
                <Ionicons name="cash-outline" size={16} color={colors.gray600} />
                <Text style={styles.packageInfoText}>₹{(packageDetails?.price || 0).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Professional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional</Text>
          <View style={styles.proCard}>
            <View style={styles.proInfo}>
              <View style={styles.proAvatar}>
                <Ionicons name="person" size={24} color={colors.gray500} />
              </View>
              <View style={styles.proDetails}>
                <Text style={styles.proName}>{proDetails?.name || 'Professional'}</Text>
                <Text style={styles.proLocation}>{proDetails?.location || 'Location not specified'}</Text>
                <View style={styles.proRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{proDetails?.rating || 0}</Text>
                  <Text style={styles.reviewCount}>({proDetails?.reviewCount || 0} reviews)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Location Context */}
        {(currentLocation || manualLocation) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Information</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Your Location</Text>
                  <Text style={styles.locationValue}>
                    {currentLocation?.city || manualLocation || 'Unknown'}
                  </Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="business" size={20} color={colors.warning} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Professional Location</Text>
                  <Text style={styles.locationValue}>
                    {proDetails?.city || proDetails?.location || 'Unknown'}
                  </Text>
                </View>
              </View>
              {currentLocation && proDetails?.latitude && proDetails?.longitude && (
                <View style={styles.locationRow}>
                  <Ionicons name="navigate" size={20} color={colors.success} />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>Distance</Text>
                    <Text style={styles.locationValue}>
                      {calculateDistance(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        proDetails.latitude,
                        proDetails.longitude
                      )}km away
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Availability Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date & Time</Text>
          <AvailabilityCalendar
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
          />
        </View>

        {/* Booking Summary */}
        {selectedDate && selectedTimeSlot && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>{packageDetails?.title || 'Package'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{selectedTimeSlot.time}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{packageDetails?.duration || 0} hours</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{(packageDetails?.price || 0).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedDate || !selectedTimeSlot) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          <Text style={styles.continueButtonText}>
            Continue to Payment
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray200,
    ...Shadows.sm,
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: colors.gray50,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: colors.gray900,
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: colors.gray900,
    marginBottom: Spacing.md,
  },
  packageCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: colors.gray100,
  },
  packageTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: colors.gray900,
    marginBottom: Spacing.sm,
  },
  packageDescription: {
    fontSize: Typography.fontSize.base,
    color: colors.gray600,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  packageInfo: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  packageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  packageInfoText: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
  },
  proCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: colors.gray100,
  },
  proInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  proDetails: {
    flex: 1,
  },
  proName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: colors.gray900,
    marginBottom: 2,
  },
  proLocation: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: Spacing.xs,
  },
  proRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: colors.gray900,
  },
  reviewCount: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: colors.gray100,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
    color: colors.gray600,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: colors.gray900,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: colors.gray900,
  },
  totalValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: colors.primary,
  },
  footer: {
    padding: Spacing.xl,
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: colors.gray200,
    ...Shadows.lg,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  continueButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    marginRight: Spacing.sm,
  },
  locationCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...Shadows.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  locationLabel: {
    fontSize: Typography.fontSize.sm,
    color: colors.gray600,
    fontWeight: Typography.fontWeight.medium,
  },
  locationValue: {
    fontSize: Typography.fontSize.base,
    color: colors.gray900,
    fontWeight: Typography.fontWeight.semiBold,
    marginTop: 2,
  },
});

export default BookingScreen;
