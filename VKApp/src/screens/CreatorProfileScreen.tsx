import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type CreatorProfileScreenRouteProp = RouteProp<RootStackParamList, 'CreatorProfile'>;

const CreatorProfileScreen = () => {
  const route = useRoute<CreatorProfileScreenRouteProp>();
  const { proId } = route.params;
  
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

  const mockPackages = [
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
  ];

  const mockPortfolio = [
    { id: '1', media_url: 'https://via.placeholder.com/300', media_type: 'image' as const },
    { id: '2', media_url: 'https://via.placeholder.com/300', media_type: 'image' as const },
    { id: '3', media_url: 'https://via.placeholder.com/300', media_type: 'image' as const },
  ];

  const handleInquiry = (packageId: string) => {
    navigation.navigate('Inquiry', { packageId });
  };

  const renderPackage = ({ item }: { item: any }) => (
    <View style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <Text style={styles.packageTitle}>{item.title}</Text>
        <View style={styles.packageTypeTag}>
          <Text style={styles.packageTypeText}>
            {item.type === 'bundle' ? 'Bundle' : 'Individual'}
          </Text>
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
      <TouchableOpacity
        style={styles.inquiryButton}
        onPress={() => handleInquiry(item.id)}
      >
        <Text style={styles.inquiryButtonText}>Send Inquiry</Text>
      </TouchableOpacity>
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
          <FlatList
            data={mockPackages}
            renderItem={renderPackage}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.packagesList}
          />
        )}

        {activeTab === 'reviews' && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.comingSoon}>Reviews coming soon!</Text>
          </View>
        )}
      </View>
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
  inquiryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inquiryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});

export default CreatorProfileScreen;