import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

interface AvailabilityCalendarProps {
  onDateSelect: (date: Date) => void;
  onTimeSelect: (timeSlot: TimeSlot) => void;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTimeSlot,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock availability data - in a real app, this would come from the professional's schedule
  const getAvailabilityStatus = (date: Date): AvailabilityStatus => {
    const day = date.getDate();
    const month = date.getMonth();
    
    // Mock logic for demonstration
    if (day % 7 === 0) return 'unavailable'; // Every 7th day is unavailable
    if (day % 3 === 0) return 'busy'; // Every 3rd day is busy
    return 'available'; // Rest are available
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < new Date();
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const availabilityStatus = getAvailabilityStatus(date);
      
      days.push({
        date,
        day,
        isPast,
        isToday,
        isSelected,
        availabilityStatus,
      });
    }

    return days;
  };

  // Get time slots based on selected date availability
  const getTimeSlots = (date?: Date): TimeSlot[] => {
    if (!date) return [];
    
    const availabilityStatus = getAvailabilityStatus(date);
    
    if (availabilityStatus === 'unavailable') {
      return [];
    }
    
    if (availabilityStatus === 'available') {
      // All slots available
      return [
        { id: '1', time: '09:00 AM', available: true },
        { id: '2', time: '10:00 AM', available: true },
        { id: '3', time: '11:00 AM', available: true },
        { id: '4', time: '12:00 PM', available: true },
        { id: '5', time: '01:00 PM', available: true },
        { id: '6', time: '02:00 PM', available: true },
        { id: '7', time: '03:00 PM', available: true },
        { id: '8', time: '04:00 PM', available: true },
        { id: '9', time: '05:00 PM', available: true },
      ];
    }
    
    // Busy day - limited slots available
    return [
      { id: '1', time: '09:00 AM', available: true },
      { id: '2', time: '10:00 AM', available: false },
      { id: '3', time: '11:00 AM', available: false },
      { id: '4', time: '12:00 PM', available: true },
      { id: '5', time: '01:00 PM', available: false },
      { id: '6', time: '02:00 PM', available: false },
      { id: '7', time: '03:00 PM', available: true },
      { id: '8', time: '04:00 PM', available: false },
      { id: '9', time: '05:00 PM', available: true },
    ];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Day Names */}
      <View style={styles.dayNamesRow}>
        {dayNames.map((day) => (
          <Text key={day} style={styles.dayName}>
            {day}
          </Text>
        ))}
      </View>

      {/* Status Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.availableDot]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.busyDot]} />
          <Text style={styles.legendText}>Limited Slots</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.unavailableDot]} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {generateCalendarDays().map((day, index) => {
          if (!day) {
            return <View key={index} style={styles.dayCell} />;
          }

          const isDisabled = day.isPast || day.availabilityStatus === 'unavailable';
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.isToday && styles.todayCell,
                day.isSelected && styles.selectedCell,
                day.isPast && styles.pastCell,
                isDisabled && styles.disabledCell,
              ]}
              onPress={() => !isDisabled && onDateSelect(day.date)}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.dayText,
                  day.isToday && styles.todayText,
                  day.isSelected && styles.selectedText,
                  day.isPast && styles.pastText,
                  isDisabled && styles.disabledText,
                ]}
              >
                {day.day}
              </Text>
              {/* Status dot */}
              {!day.isPast && (
                <View
                  style={[
                    styles.statusDot,
                    day.availabilityStatus === 'available' && styles.availableDot,
                    day.availabilityStatus === 'busy' && styles.busyDot,
                    day.availabilityStatus === 'unavailable' && styles.unavailableDot,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Time Slots */}
      {selectedDate && getTimeSlots(selectedDate).length > 0 && (
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeSlotsRow}>
              {getTimeSlots(selectedDate).map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.unavailableSlot,
                    selectedTimeSlot?.id === slot.id && styles.selectedTimeSlot,
                  ]}
                  onPress={() => slot.available && onTimeSelect(slot)}
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      !slot.available && styles.unavailableSlotText,
                      selectedTimeSlot?.id === slot.id && styles.selectedTimeSlotText,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
      
      {/* Unavailable date message */}
      {selectedDate && getTimeSlots(selectedDate).length === 0 && (
        <View style={styles.unavailableMessage}>
          <Ionicons name="calendar-outline" size={24} color={Colors.gray500} />
          <Text style={styles.unavailableText}>No time slots available for this date</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 0.5,
    borderColor: Colors.gray100,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  navButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray50,
  },
  monthYear: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray600,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray600,
    fontWeight: Typography.fontWeight.medium,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md, // Reduced margin to fix gap
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  todayCell: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.lg,
  },
  selectedCell: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  pastCell: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray900,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  selectedText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semiBold,
  },
  pastText: {
    color: Colors.gray400,
  },
  disabledCell: {
    opacity: 0.3,
  },
  disabledText: {
    color: Colors.gray400,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availableDot: {
    backgroundColor: Colors.success,
  },
  busyDot: {
    backgroundColor: Colors.warning,
  },
  unavailableDot: {
    backgroundColor: Colors.error,
  },
  timeSlotsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.lg,
  },
  timeSlotsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  unavailableSlot: {
    backgroundColor: Colors.gray100,
    borderColor: Colors.gray300,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray900,
  },
  unavailableSlotText: {
    color: Colors.gray400,
  },
  selectedTimeSlotText: {
    color: Colors.white,
  },
  unavailableMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  unavailableText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
    textAlign: 'center',
  },
});

export default AvailabilityCalendar;
