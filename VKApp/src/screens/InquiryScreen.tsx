import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Package } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/supabase';

type InquiryScreenRouteProp = RouteProp<RootStackParamList, 'PackageDetails'>;
type InquiryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PackageDetails'>;

const InquiryScreen = () => {
  const route = useRoute<InquiryScreenRouteProp>();
  const navigation = useNavigation<InquiryScreenNavigationProp>();
  const { user } = useAuth();
  const { packageId } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock package data - replace with actual API call
  const mockPackage: Package = {
    id: packageId,
    pro_id: 'pro1',
    type: 'individual',
    services_included: ['photo'],
    title: 'Wedding Photography',
    description: 'Full day wedding coverage with edited photos',
    base_price: 25000,
    currency: 'INR',
    duration_hours: 8,
    deliverables: ['500+ edited photos', 'Online gallery', 'USB drive'],
    is_active: true,
    created_at: new Date().toISOString(),
  };

  const handleSendInquiry = async () => {
    if (!selectedDate || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please log in to send an inquiry');
      return;
    }

    setLoading(true);
    try {
      const inquiryData = {
        customer_id: user.id,
        pro_id: mockPackage.pro_id,
        package_id: mockPackage.id,
        date: selectedDate,
        location,
        notes,
        status: 'pending',
      };

      // Create inquiry
      const inquiry = await DatabaseService.createInquiry(inquiryData);
      
      Alert.alert(
        'Inquiry Sent!',
        'Your inquiry has been sent to the creator. You will be notified when they respond.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error sending inquiry:', error);
      Alert.alert('Error', 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Package Summary */}
        <View style={styles.packageSummary}>
          <Text style={styles.packageTitle}>{mockPackage.title}</Text>
          <Text style={styles.packageDescription}>{mockPackage.description}</Text>
          <Text style={styles.packagePrice}>₹{mockPackage.base_price.toLocaleString()}</Text>
          <Text style={styles.packageDuration}>{mockPackage.duration_hours} hours</Text>
        </View>

        {/* Inquiry Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          {/* Date Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Date *</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>
                {selectedDate || 'Select Date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event location"
              value={location}
              onChangeText={setLocation}
              multiline
            />
          </View>

          {/* Additional Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any specific requirements or details..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By sending this inquiry, you agree to our terms and conditions. 
              A 30% deposit will be required upon acceptance of your booking.
            </Text>
          </View>

          {/* Send Inquiry Button */}
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendInquiry}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? 'Sending...' : 'Send Inquiry'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  packageSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  packageDuration: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InquiryScreen;
