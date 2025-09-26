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
import PaymentService from '../services/paymentService';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/designSystem';

type CreatorProfileScreenRouteProp = RouteProp<RootStackParamList, 'CreatorProfile'>;
type CreatorProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CreatorProfileScreen = () => {
  const route = useRoute<CreatorProfileScreenRouteProp>();
  const navigation = useNavigation<CreatorProfileScreenNavigationProp>();
  const { user } = useAuth();
  const { proId } = route.params;
  
  // Check if current user is the profile owner
  const isOwner = user?.id === proId;
  
  const [activeTab, setActiveTab] = useState<'portfolio' | 'packages' | 'reviews'>('portfolio');

  const mockCreator = {
    id: proId,
    name: 'John Photography',
    handle: '@johnphoto',
    city: 'Mumbai',
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

  const handleInquiry = (packageId: string) => {
    // Only show payment for customers, not for the profile owner
    if (!isOwner) {
      PaymentService.showInquiryPaymentModal(
        (transactionId) => {
          // Payment successful, navigate to inquiry
          navigation.navigate('Inquiry', { packageId });
        },
        () => {
          // Payment cancelled
          console.log('Payment cancelled');
        }
      );
    } else {
      // Owner can directly navigate to inquiry
      navigation.navigate('Inquiry', { packageId });
    }
  };

  const handleBook = (packageItem: any) => {
    // Navigate to booking screen with package and professional details
    navigation.navigate('Booking', {
      packageDetails: packageItem,
      proDetails: mockCreator,
    });
  };

  const renderPackage = ({ item }: { item: any }) => (
    <View style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageTitle}>{item.title}</Text>
        <View style={styles.packageActions}>
          <View style={styles.packageTypeTag}>
            <Text style={styles.packageTypeText}>
              {item.type === 'bundle' ? 'Bundle' : 'Individual'}
            </Text>
          </View>
          {isOwner && (
            <TouchableOpacity 
              style={styles.deletePackageButton}
              onPress={() => handleDeletePackage(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.packageDescription}>{item.description}</Text>
      <Text style={styles.packagePrice}>₹{item.price.toLocaleString()}</Text>
      <Text style={styles.packageDuration}>{item.duration} hours</Text>
      <View style={styles.deliverablesContainer}>
        {item.deliverables.map((deliverable: string, index: number) => (
          <Text key={index} style={styles.deliverable}>
            • {deliverable}
          </Text>
        ))}
      </View>
      <View style={styles.packageActions}>
        <TouchableOpacity
          style={styles.inquiryButton}
          onPress={() => handleInquiry(item.id)}
        >
          <Text style={styles.inquiryButtonText}>Send Inquiry</Text>
        </TouchableOpacity>
        {!isOwner && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBook(item)}
          >
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderPortfolioItem = ({ item }: { item: any }) => (
    <View style={styles.portfolioItem}>
      <Image source={{ uri: item.media_url }} style={styles.portfolioImage} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
        </View>
        <Text style={styles.creatorName}>{mockCreator.name}</Text>
        <Text style={styles.creatorHandle}>{mockCreator.handle}</Text>
        <Text style={styles.creatorLocation}>
          <Ionicons name="location-outline" size={14} color="#666" />
          {' '}{mockCreator.city}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{mockCreator.rating}</Text>
          <Text style={styles.reviewCount}>({mockCreator.reviewCount} reviews)</Text>
        </View>

        <Text style={styles.bio}>{mockCreator.bio}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="camera-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{mockCreator.primaryGear}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="car-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Travels up to {mockCreator.travelRadius}km</Text>
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
                style={styles.createPackageButton}
                onPress={handleCreatePackage}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.createPackageButtonText}>Create New Package</Text>
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
          <View style={styles.reviewsContainer}>
            <Text style={styles.comingSoon}>Reviews coming soon!</Text>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Package</Text>
              <TouchableOpacity onPress={() => setShowCreatePackageModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Package Title *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Wedding Photography"
                  value={newPackage.title}
                  onChangeText={(text) => setNewPackage({ ...newPackage, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Describe what's included in this package..."
                  value={newPackage.description}
                  onChangeText={(text) => setNewPackage({ ...newPackage, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price (₹) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="25000"
                  value={newPackage.price}
                  onChangeText={(text) => setNewPackage({ ...newPackage, price: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (hours)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="8"
                  value={newPackage.duration}
                  onChangeText={(text) => setNewPackage({ ...newPackage, duration: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Deliverables</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="500+ edited photos, Online gallery, USB drive (comma separated)"
                  value={newPackage.deliverables}
                  onChangeText={(text) => setNewPackage({ ...newPackage, deliverables: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Package Type</Text>
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

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowCreatePackageModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveModalButton}
                onPress={handleSavePackage}
              >
                <Text style={styles.saveModalButtonText}>Create Package</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  creatorHandle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  creatorLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  portfolioGrid: {
    paddingBottom: 20,
  },
  portfolioItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  packagesList: {
    paddingBottom: 20,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  packageTypeTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  packageTypeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  packageDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  deliverablesContainer: {
    marginBottom: 16,
  },
  deliverable: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  packageActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  inquiryButton: {
    flex: 1,
    backgroundColor: Colors.gray100,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  inquiryButtonText: {
    color: Colors.gray700,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  bookButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  reviewsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
  },
  // New styles for package creation
  packagesContainer: {
    padding: 16,
  },
  createPackageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  createPackageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deletePackageButton: {
    padding: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveModalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CreatorProfileScreen;