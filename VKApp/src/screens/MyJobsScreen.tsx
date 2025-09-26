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
      
      // Here you would typically make an API call to update the job status
      // await DatabaseService.updateJobStatus(jobId, 'confirmed');
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
              
              // Here you would typically make an API call to update the job status
              // await DatabaseService.updateJobStatus(jobId, 'cancelled');
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
      case 'pending': return '#FF9500';
      case 'confirmed': return '#007AFF';
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#8E8E93" />
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.service}>{item.service}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>₹{item.amount.toLocaleString()}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAcceptJob(item.id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDeclineJob(item.id)}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
        <Text style={styles.subtitle}>Manage your photography bookings</Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No jobs yet</Text>
            <Text style={styles.emptySubtitle}>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  service: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  jobDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
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
    backgroundColor: '#007AFF',
  },
  declineButton: {
    backgroundColor: '#f0f0f0',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButtonText: {
    color: '#8E8E93',
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
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MyJobsScreen;
