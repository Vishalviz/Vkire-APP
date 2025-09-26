import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import ImagePickerModal from '../components/ImagePickerModal';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user, updateProfile } = useAuth();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    instagram: user?.instagram || '',
    avatar: user?.avatar_url || null,
  });

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }

      if (formData.name.trim().length < 2) {
        Alert.alert('Error', 'Name must be at least 2 characters long');
        return;
      }

      if (!formData.email.trim()) {
        Alert.alert('Error', 'Email is required');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      // Validate phone number if provided
      if (formData.phone && formData.phone.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          Alert.alert('Error', 'Please enter a valid phone number');
          return;
        }
      }

      // Validate website URL if provided
      if (formData.website && formData.website.trim()) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(formData.website)) {
          Alert.alert('Error', 'Website must start with http:// or https://');
          return;
        }
      }

      // Validate Instagram handle if provided
      if (formData.instagram && formData.instagram.trim()) {
        const instagramRegex = /^@?[a-zA-Z0-9._]+$/;
        if (!instagramRegex.test(formData.instagram)) {
          Alert.alert('Error', 'Instagram handle can only contain letters, numbers, dots, and underscores');
          return;
        }
      }

      // Update user data
      await updateProfile({
        ...formData,
        avatar_url: formData.avatar, // Map avatar to avatar_url
      });
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleImageSelect = (imageUri: string) => {
    setFormData(prev => ({ ...prev, avatar: imageUri }));
    setShowImagePicker(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowImagePicker(true)}
            >
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={Colors.gray400} />
                </View>
              )}
              <View style={styles.avatarEditIcon}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Basic Information */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.gray500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Enter your email"
                placeholderTextColor={Colors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.gray500}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
                placeholder="Enter your location"
                placeholderTextColor={Colors.gray500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.bio}
                onChangeText={(value) => updateField('bio', value)}
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.gray500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Social Links */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Social Links</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                style={styles.textInput}
                value={formData.website}
                onChangeText={(value) => updateField('website', value)}
                placeholder="https://yourwebsite.com"
                placeholderTextColor={Colors.gray500}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instagram</Text>
              <TextInput
                style={styles.textInput}
                value={formData.instagram}
                onChangeText={(value) => updateField('instagram', value)}
                placeholder="@yourusername"
                placeholderTextColor={Colors.gray500}
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>

        {/* Image Picker Modal */}
        <ImagePickerModal
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onImageSelect={handleImageSelect}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  saveButton: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  avatarLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  formSection: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.gray900,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfileScreen;
