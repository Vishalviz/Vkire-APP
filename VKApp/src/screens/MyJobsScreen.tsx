import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { DatabaseService } from '../services/supabase';
import NotificationService from '../services/notificationService';
import { useTheme } from '../contexts/AppThemeContext';

interface Job {
  id: string;
  customerName: string;
  service: string;
  date: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  customerAvatar?: string;
}

const MyJobsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      customerName: 'Priya Sharma',
      service: 'Wedding Photography',
      date: '2024-10-15',
      location: 'Delhi',
      status: 'confirmed',
      amount: 25000,
    },
    {
      id: '2',
      customerName: 'Amit Kumar',
      service: 'Portfolio Shoot',
      date: '2024-09-20',
      location: 'Mumbai',
      status: 'completed',
      amount: 15000,
    },
    {
      id: '3',
      customerName: 'Sneha Patel',
      service: 'Fashion Photography',
      date: '2024-11-05',
      location: 'Bangalore',
      status: 'pending',
      amount: 12000,
    },
  ]);

  const handleAcceptJob = async (jobId: string) => {
    try {
      // Update job status to confirmed
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, status: 'confirmed' as const }
            : job
        )
      );
      
      Alert.alert(
        'Job Accepted!', 
        'You have successfully accepted this booking. The customer will be notified.',
        [{ text: 'OK' }]
      );
      
      // Update job status in database
      await DatabaseService.updateJobStatus(jobId, 'confirmed');
      
      // Send notification to customer
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        await NotificationService.notifyJobAccepted(job.customerName, job.service);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to accept the job. Please try again.');
    }
  };

  const handleDeclineJob = async (jobId: string) => {
    Alert.alert(
      'Decline Job',
      'Are you sure you want to decline this booking? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update job status to cancelled
              setJobs(prevJobs => 
                prevJobs.map(job => 
                  job.id === jobId 
                    ? { ...job, status: 'cancelled' as const }
                    : job
                )
              );
              
              Alert.alert(
                'Job Declined', 
                'The booking has been declined and the customer will be notified.',
                [{ text: 'OK' }]
              );
              
              // Update job status in database
              await DatabaseService.updateJobStatus(jobId, 'cancelled');
              
              // Send notification to customer
              const job = jobs.find(j => j.id === jobId);
              if (job) {
                await NotificationService.notifyJobDeclined(job.customerName, job.service);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to decline the job. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (job: Job) => {
    Alert.alert(
      'Job Details',
      `Customer: ${job.customerName}\nService: ${job.service}\nDate: ${job.date}\nLocation: ${job.location}\nAmount: ₹${job.amount.toLocaleString()}\nStatus: ${job.status}`,
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.primary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.gray500;
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={[styles.jobCard, { backgroundColor: colors.white }]}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.customerInfo}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.gray100, borderColor: colors.gray200 }]}>
            <Ionicons name="person" size={24} color={colors.gray500} />
          </View>
          <View style={styles.customerDetails}>
            <Text style={[styles.customerName, { color: colors.gray900 }]}>{item.customerName}</Text>
            <Text style={[styles.service, { color: colors.gray600 }]}>{item.service}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.gray600} />
          <Text style={[styles.detailText, { color: colors.gray600 }]}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={colors.gray600} />
          <Text style={[styles.detailText, { color: colors.gray600 }]}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color={colors.gray600} />
          <Text style={[styles.detailText, { color: colors.gray600 }]}>₹{item.amount.toLocaleString()}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAcceptJob(item.id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton, { backgroundColor: colors.gray100 }]}
            onPress={() => handleDeclineJob(item.id)}
          >
            <Text style={[styles.declineButtonText, { color: colors.gray600 }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.gray50 }]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.gray200 }]}>
        <Text style={[styles.title, { color: colors.primary }]}>My Jobs</Text>
        <Text style={[styles.subtitle, { color: colors.gray600 }]}>Manage your photography bookings</Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={colors.gray600} />
            <Text style={[styles.emptyTitle, { color: colors.gray600 }]}>No jobs yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.gray600 }]}>
              Start posting your work to get discovered by customers
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0', // Static gray200 border
    backgroundColor: '#FFFFFF', // Static white background
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: '#666666', // Static gray600 color
  },
  listContainer: {
    padding: Spacing.md,
  },
  jobCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.md,
    backgroundColor: '#FFFFFF', // Static white background
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F3F4F6', // Static gray100 background
    borderColor: '#E5E7EB', // Static gray200 border
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: '#1F2937', // Static gray900 color
  },
  service: {
    fontSize: 14,
    color: '#4B5563', // Static gray600 color
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF', // Static white color
  },
  jobDetails: {
    gap: 8,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563', // Static gray600 color
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#007AFF', // Static primary background
  },
  declineButton: {
    backgroundColor: '#F3F4F6', // Static gray100 background
  },
  acceptButtonText: {
    color: '#FFFFFF', // Static white color
    fontWeight: '600',
    fontSize: 14,
  },
  declineButtonText: {
    color: '#4B5563', // Static gray600 color
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#4B5563', // Static gray600 color
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    color: '#4B5563', // Static gray600 color
  },
});

export default MyJobsScreen;
