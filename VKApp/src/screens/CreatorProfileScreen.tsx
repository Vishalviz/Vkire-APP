import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import PaymentService from '../services/paymentService';
import { Spacing, BorderRadius, Typography, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type CreatorProfileScreenRouteProp = RouteProp<RootStackParamList, 'CreatorProfile'>;
type CreatorProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CreatorProfileScreen = () => {
  const route = useRoute<CreatorProfileScreenRouteProp>();
  const navigation = useNavigation<CreatorProfileScreenNavigationProp>();
  const { user } = useAuth();
  const { currentLocation, manualLocation } = useLocation();
  const { proId } = route.params;
  
  // Check if current user is the profile owner
  const isOwner = user?.id === proId;
  
  const [activeTab, setActiveTab] = useState<'portfolio' | 'packages' | 'reviews'>('portfolio');

  const mockCreator = {
    id: proId,
    name: 'John Photography',
    handle: '@johnphoto',
    city: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    bio: 'Professional photographer specializing in weddings, portraits, and events. 5+ years of experience.',
    rating: 4.8,
    reviewCount: 24,
    services: ['photo', 'video'],
    primaryGear: 'Canon EOS R5',
    travelRadius: 50,
  };

  const [packages, setPackages] = useState([
    {
      id: '1',
      title: 'Wedding Photography',
      description: 'Full day wedding coverage with edited photos',
      price: 25000,
      duration: 8,
      deliverables: ['500+ edited photos', 'Online gallery', 'USB drive'],
      type: 'individual',
    },
    {
      id: '2',
      title: 'Photo + Video Bundle',
      description: 'Complete wedding coverage with photos and video',
      price: 45000,
      duration: 8,
      deliverables: ['500+ edited photos', '5-10 min highlight video', 'Online gallery'],
      type: 'bundle',
    },
  ]);

  const [showCreatePackageModal, setShowCreatePackageModal] = useState(false);
  const [newPackage, setNewPackage] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    deliverables: '',
    type: 'individual',
  });

  const handleCreatePackage = () => {
    setShowCreatePackageModal(true);
  };

  const handleSavePackage = async () => {
    if (!newPackage.title.trim() || !newPackage.description.trim() || !newPackage.price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const packageData = {
        id: Date.now().toString(),
        title: newPackage.title,
        description: newPackage.description,
        price: parseInt(newPackage.price),
        duration: parseInt(newPackage.duration) || 1,
        deliverables: newPackage.deliverables.split(',').map(item => item.trim()).filter(item => item.length > 0),
        type: newPackage.type as 'individual' | 'bundle',
      };

      setPackages(prevPackages => [...prevPackages, packageData]);
      
      // Reset form
      setNewPackage({
        title: '',
        description: '',
        price: '',
        duration: '',
        deliverables: '',
        type: 'individual',
      });
      
      setShowCreatePackageModal(false);
      Alert.alert('Success', 'Package created successfully!');
      
      // Here you would typically make an API call to save the package
      // await DatabaseService.createPackage(packageData);
    } catch (error) {
      Alert.alert('Error', 'Failed to create package. Please try again.');
    }
  };

  const handleDeletePackage = (packageId: string) => {
    Alert.alert(
      'Delete Package',
      'Are you sure you want to delete this package?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== packageId));
            Alert.alert('Success', 'Package deleted successfully!');
            
            // Here you would typically make an API call to delete the package
            // await DatabaseService.deletePackage(packageId);
          },
        },
      ]
    );
  };

  const mockPortfolio = [
    { id: '1', media_url: 'https://via.placeholder.com/300', media_type: 'image' as const },
    { id: '2', media_url: 'https://via.placeholder.com/300', media_type: 'image' as const },
    { id: '3', media_url: 'https://via.placeholder.com/300', media_type: 'image' as const },
  ];

  const handleInquiry = async (packageId: string) => {
    // Only show payment for customers, not for the profile owner
    if (!isOwner) {
      // Check if user has already purchased chat access for this professional
      const hasAccess = await PaymentService.hasPurchasedChatAccess(mockCreator.id);
      
      if (hasAccess) {
        // User already has access, navigate directly to chat
        navigation.navigate('Chat', { 
          professionalId: mockCreator.id,
          professionalName: mockCreator.name,
          packageId: packageId,
          transactionId: 'existing_access'
        });
      } else {
        // User needs to purchase access - include location context
        const locationContext = {
          userLocation: currentLocation ? { city: currentLocation.city || manualLocation || 'Unknown', latitude: currentLocation.latitude, longitude: currentLocation.longitude} : { city: manualLocation || 'Unknown' },
          professionalLocation: mockCreator.city || 'Unknown',
          distance: currentLocation && mockCreator.latitude && mockCreator.longitude 
            ? calculateDistance(currentLocation.latitude, currentLocation.longitude, mockCreator.latitude, mockCreator.longitude)
            : null
        };

        PaymentService.showInquiryPaymentModal(
          mockCreator.id,
          (transactionId) => {
            // Payment successful, navigate directly to chat with location context
            navigation.navigate('Chat', { 
              professionalId: mockCreator.id,
              professionalName: mockCreator.name,
              packageId: packageId,
              transactionId: transactionId,
              locationContext: locationContext
            });
          },
          () => {
            // Payment cancelled
            console.log('Payment cancelled');
          }
        );
      }
    } else {
      // Owner can directly navigate to inquiry
      navigation.navigate('Inquiry', { packageId });
    }
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

  const handleBook = (packageItem: any) => {
    // Navigate to booking screen with package and professional details
    navigation.navigate('Booking', {
      packageDetails: packageItem,
      proDetails: mockCreator,
    });
  };

  const { colors } = useTheme();

  const renderPackage = ({ item }: { item: any }) => (
    <View style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageTitle}>{item.title}</Text>
        <View style={styles.packageActions}>
          <View style={[styles.packageTypeTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.packageTypeText, { color: colors.white }]}>
              {item.type === 'bundle' ? 'Bundle' : 'Individual'}
            </Text>
          </View>
          {isOwner && (
            <TouchableOpacity 
              style={styles.deletePackageButton}
              onPress={() => handleDeletePackage(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={[styles.packageDescription, { color: colors.gray600 }]}>{item.description}</Text>
      <Text style={[styles.packagePrice, { color: colors.gray900 }]}>₹{item.price.toLocaleString()}</Text>
      <Text style={[styles.packageDuration, { color: colors.gray600 }]}>{item.duration} hours</Text>
      <View style={[styles.deliverablesContainer, { marginBottom: Spacing.lg }]}>
        {item.deliverables.map((deliverable: string, index: number) => (
          <Text key={index} style={[styles.deliverable, { color: colors.gray600 }]}>
            • {deliverable}
          </Text>
        ))}
      </View>
      <View style={styles.packageActions}>
        <TouchableOpacity
          style={[styles.inquiryButton, { backgroundColor: colors.gray100, borderColor: colors.gray300 }]}
          onPress={() => handleInquiry(item.id)}
        >
          <Text style={[styles.inquiryButtonText, { color: colors.gray700 }]}>Send Inquiry</Text>
        </TouchableOpacity>
        {!isOwner && (
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={() => handleBook(item)}
          >
            <Text style={[styles.bookButtonText, { color: colors.white }]}>Book</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderPortfolioItem = ({ item }: { item: any }) => (
    <View style={styles.portfolioItem}>
      <Image source={{ uri: item.media_url }} style={[styles.portfolioImage, { backgroundColor: colors.gray100 }]} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={colors.gray600} />
          </View>
        </View>
        <Text style={[styles.creatorName, { color: colors.gray900 }]}>{mockCreator.name}</Text>
        <Text style={[styles.creatorHandle, { color: colors.gray600 }]}>{mockCreator.handle}</Text>
        <Text style={[styles.creatorLocation, { color: colors.gray600 }]}>
          <Ionicons name="location-outline" size={14} color={colors.gray600} />
          {' '}{mockCreator.city}
        </Text>
        
        <View style={[styles.ratingContainer, { marginBottom: Spacing.lg }]}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={[styles.rating, { color: colors.gray900 }]}>{mockCreator.rating}</Text>
          <Text style={[styles.reviewCount, { color: colors.gray600 }]}>({mockCreator.reviewCount} reviews)</Text>
        </View>

        <Text style={[styles.bio, { color: colors.gray600 }]}>{mockCreator.bio}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="camera-outline" size={16} color={colors.gray600} />
            <Text style={[styles.infoText, { color: colors.gray600 }]}>{mockCreator.primaryGear}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="car-outline" size={16} color={colors.gray600} />
            <Text style={[styles.infoText, { color: colors.gray600 }]}>Travels up to {mockCreator.travelRadius}km</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
          onPress={() => setActiveTab('portfolio')}
        >
          <Text style={[styles.tabText, activeTab === 'portfolio' && styles.activeTabText]}>
            Portfolio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'packages' && styles.activeTab]}
          onPress={() => setActiveTab('packages')}
        >
          <Text style={[styles.tabText, activeTab === 'packages' && styles.activeTabText]}>
            Packages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Reviews
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'portfolio' && (
          <FlatList
            data={mockPortfolio}
            renderItem={renderPortfolioItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.portfolioGrid}
          />
        )}

        {activeTab === 'packages' && (
          <View style={styles.packagesContainer}>
            {isOwner && (
              <TouchableOpacity 
                style={[styles.createPackageButton, { backgroundColor: colors.primary }]}
                onPress={handleCreatePackage}
              >
                <Ionicons name="add" size={20} color={colors.white} />
                <Text style={[styles.createPackageButtonText, { color: colors.white }]}>Create New Package</Text>
              </TouchableOpacity>
            )}
            
            <FlatList
              data={packages}
              renderItem={renderPackage}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.packagesList}
            />
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={[styles.reviewsContainer, { backgroundColor: colors.surface, ...Shadows.sm }]}>
            <Text style={[styles.comingSoon, { color: colors.gray600 }]}>Reviews coming soon!</Text>
          </View>
        )}
      </View>

      {/* Create Package Modal */}
      <Modal
        visible={showCreatePackageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreatePackageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, ...Shadows.lg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.gray200 }]}>
              <Text style={[styles.modalTitle, { color: colors.gray900 }]}>Create New Package</Text>
              <TouchableOpacity onPress={() => setShowCreatePackageModal(false)}>
                <Ionicons name="close" size={24} color={colors.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={[styles.modalBody, { maxHeight: 400 }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.gray900 }]}>Package Title *</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: colors.gray300, backgroundColor: colors.gray50 }]}
                  placeholder="e.g., Wedding Photography"
                  value={newPackage.title}
                  onChangeText={(text) => setNewPackage({ ...newPackage, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.gray900 }]}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { borderColor: colors.gray300, backgroundColor: colors.gray50 }]}
                  placeholder="Describe what's included in this package..."
                  value={newPackage.description}
                  onChangeText={(text) => setNewPackage({ ...newPackage, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.gray900 }]}>Price (₹) *</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: colors.gray300, backgroundColor: colors.gray50 }]}
                  placeholder="25000"
                  value={newPackage.price}
                  onChangeText={(text) => setNewPackage({ ...newPackage, price: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.gray900 }]}>Duration (hours)</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: colors.gray300, backgroundColor: colors.gray50 }]}
                  placeholder="8"
                  value={newPackage.duration}
                  onChangeText={(text) => setNewPackage({ ...newPackage, duration: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.gray900 }]}>Deliverables</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { borderColor: colors.gray300, backgroundColor: colors.gray50 }]}
                  placeholder="500+ edited photos, Online gallery, USB drive (comma separated)"
                  value={newPackage.deliverables}
                  onChangeText={(text) => setNewPackage({ ...newPackage, deliverables: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.gray900 }]}>Package Type</Text>
                <View style={styles.typeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newPackage.type === 'individual' && styles.typeButtonSelected
                    ]}
                    onPress={() => setNewPackage({ ...newPackage, type: 'individual' })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      newPackage.type === 'individual' && styles.typeButtonTextSelected
                    ]}>
                      Individual
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newPackage.type === 'bundle' && styles.typeButtonSelected
                    ]}
                    onPress={() => setNewPackage({ ...newPackage, type: 'bundle' })}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      newPackage.type === 'bundle' && styles.typeButtonTextSelected
                    ]}>
                      Bundle
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: colors.gray200 }]}>
              <TouchableOpacity 
                style={[styles.cancelModalButton, { backgroundColor: colors.gray100 }]}
                onPress={() => setShowCreatePackageModal(false)}
              >
                <Text style={[styles.cancelModalButtonText, { color: colors.gray600 }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveModalButton, { backgroundColor: colors.primary }]}
                onPress={handleSavePackage}
              >
                <Text style={[styles.saveModalButtonText, { color: colors.white }]}>Create Package</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' }, // Static background
  header: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    marginBottom: Spacing.xl,
    backgroundColor: '#FFFFFF', // Static white
    ...Shadows.sm,
  },
  avatarContainer: { marginBottom: Spacing.lg },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' // Static gray200
  },
  creatorName: {
    fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.semiBold, marginBottom: Spacing.xs, color: '#1F2937' // Static gray900
  },
  creatorHandle: {
    fontSize: Typography.fontSize.md, marginBottom: Spacing.sm, color: '#4B5563' // Static gray600
  },
  creatorLocation: {
    fontSize: Typography.fontSize.base, marginBottom: Spacing.md, color: '#4B5563' // Static gray600
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  rating: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, marginLeft: Spacing.xs, color: '#1F2937' }, // Static gray900
  reviewCount: { fontSize: Typography.fontSize.base, marginLeft: Spacing.xs, color: '#4B5563' }, // Static gray600
  bio: {
    fontSize: Typography.fontSize.base, textAlign: 'center', lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base, marginBottom: Spacing.lg, color: '#4B5563' // Static gray600
  },
  infoContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: Spacing.xl },
  infoItem: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  infoText: { fontSize: Typography.fontSize.sm, marginLeft: Spacing.xs, textAlign: 'center', color: '#4B5563' }, // Static gray600
  tabContainer: { flexDirection: 'row', marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.xl, padding: Spacing.xs, backgroundColor: '#E5E7EB', ...Shadows.sm }, // Static gray200
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: BorderRadius.md, backgroundColor: '#E5E7EB' }, // Static gray200
  activeTab: { backgroundColor: '#FFFFFF' }, // Static white
  tabText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.medium, color: '#4B5563' }, // Static gray600
  activeTabText: { color: '#1F2937' }, // Static gray900
  tabContent: { paddingHorizontal: Spacing.lg },
  portfolioGrid: { paddingBottom: Spacing.xl },
  portfolioItem: { flex: 1, margin: Spacing.xs, aspectRatio: 1 },
  portfolioImage: { width: '100%', height: '100%', borderRadius: BorderRadius.md, backgroundColor: '#E5E7EB' }, // Static gray100
  packagesList: { paddingBottom: Spacing.xl },
  packageCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, backgroundColor: '#FFFFFF', ...Shadows.md }, // Static white
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  packageTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, flex: 1, color: '#1F2937' }, // Static gray900
  packageTypeTag: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: '#007AFF' }, // Static primary
  packageTypeText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.medium, color: '#FFFFFF' }, // Static white
  packageDescription: { fontSize: Typography.fontSize.base, marginBottom: Spacing.sm, color: '#4B5563' }, // Static gray600
  packagePrice: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.semiBold, marginBottom: Spacing.xs, color: '#1F2937' }, // Static gray900
  packageDuration: { fontSize: Typography.fontSize.base, marginBottom: Spacing.md, color: '#4B5563' }, // Static gray600
  deliverablesContainer: { marginBottom: Spacing.lg },
  deliverable: { fontSize: Typography.fontSize.base, marginBottom: Spacing.xs, color: '#4B5563' }, // Static gray600
  packageActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  inquiryButton: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: '#C7C7CC', backgroundColor: '#F2F2F7' }, // Static gray300, gray100
  inquiryButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semiBold, color: '#4B5563' }, // Static gray700
  bookButton: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', backgroundColor: '#007AFF' }, // Static primary
  bookButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semiBold, color: '#FFFFFF' }, // Static white
  reviewsContainer: { borderRadius: BorderRadius.lg, padding: Spacing['3xl'], alignItems: 'center', backgroundColor: '#FFFFFF', ...Shadows.sm }, // Static white
  comingSoon: { fontSize: Typography.fontSize.md, color: '#4B5563' }, // Static gray600
  packagesContainer: { padding: Spacing.lg },
  createPackageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.lg, backgroundColor: '#007AFF', ...Shadows.sm }, // Static primary
  createPackageButtonText: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, marginLeft: Spacing.sm, color: '#FFFFFF' }, // Static white
  deletePackageButton: { padding: Spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: BorderRadius.lg, width: '90%', maxWidth: 500, maxHeight: '80%', backgroundColor: '#FFFFFF', ...Shadows.lg }, // Static white
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl, borderBottomWidth: 1, borderColor: '#D1D1D6' }, // Static gray200
  modalTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semiBold, color: '#1F2937' }, // Static gray900
  modalBody: { padding: Spacing.xl, maxHeight: 400 },
  inputGroup: { marginBottom: Spacing.xl },
  inputLabel: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.medium, marginBottom: Spacing.sm, color: '#1F2937' }, // Static gray900
  textInput: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: Typography.fontSize.md, borderColor: '#C7C7CC', backgroundColor: '#F2F2F7' }, // Static gray300, gray50
  textArea: { height: 80, textAlignVertical: 'top' },
  typeButtons: { flexDirection: 'row', gap: Spacing.md },
  typeButton: { flex: 1, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: '#D1D1D6', backgroundColor: '#F2F2F7' }, // Static gray200, gray50
  typeButtonSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' }, // Static primary
  typeButtonText: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.medium, color: '#4B5563' }, // Static gray600
  typeButtonTextSelected: { color: '#FFFFFF' }, // Static white
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.xl, borderTopWidth: 1, borderColor: '#D1D1D6', gap: Spacing.md }, // Static gray200
  cancelModalButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', backgroundColor: '#E5E7EB' }, // Static gray100
  cancelModalButtonText: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.medium, color: '#4B5563' }, // Static gray600
  saveModalButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', backgroundColor: '#007AFF' }, // Static primary
  saveModalButtonText: { fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semiBold, color: '#FFFFFF' }, // Static white
});

export default CreatorProfileScreen;