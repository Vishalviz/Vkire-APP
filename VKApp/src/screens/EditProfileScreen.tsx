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
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import ImagePickerModal from '../components/ImagePickerModal';
import { useTheme } from '../contexts/AppThemeContext';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user, updateProfile } = useAuth();
  const { colors } = useTheme();
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
        avatar_url: formData.avatar || '', // Map avatar to avatar_url, ensure it's string
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
        <View style={[styles.header, {backgroundColor: colors.surface, borderBottomColor: colors.gray200}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.gray900}]}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, {color: colors.primary}]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={[styles.avatarSection, {backgroundColor: colors.surface}]}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowImagePicker(true)}
            >
              {formData.avatar ? (
                <Image source={{ uri: formData.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, {backgroundColor: colors.gray100}]}>
                  <Ionicons name="person" size={40} color={colors.gray400} />
                </View>
              )}
              <View style={[styles.avatarEditIcon, {backgroundColor: colors.primary, borderColor: colors.surface}]}>
                <Ionicons name="camera" size={16} color={colors.white} />
              </View>
            </TouchableOpacity>
            <Text style={[styles.avatarLabel, {color: colors.gray600}]}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Basic Information */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: colors.gray900}]}>Basic Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor={colors.gray500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Email *</Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.gray500}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Location</Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
                placeholder="Enter your location"
                placeholderTextColor={colors.gray500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.bio}
                onChangeText={(value) => updateField('bio', value)}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Social Links */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: colors.gray900}]}>Social Links</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Website</Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.website}
                onChangeText={(value) => updateField('website', value)}
                placeholder="https://yourwebsite.com"
                placeholderTextColor={colors.gray500}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, {color: colors.gray700}]}>Instagram</Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.surface, borderColor: colors.gray200, color: colors.gray900}]}
                value={formData.instagram}
                onChangeText={(value) => updateField('instagram', value)}
                placeholder="@yourusername"
                placeholderTextColor={colors.gray500}
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>

        {/* Image Picker Modal */}
        <ImagePickerModal
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onImageSelected={handleImageSelect}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Static white
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Static gray50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D1D6', // Static gray200
    backgroundColor: '#FFFFFF', // Static white
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937', // Static gray900
  },
  saveButton: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#007AFF', // Static primary
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: '#FFFFFF', // Static white
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
    backgroundColor: '#F2F2F7', // Static gray100
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
    backgroundColor: '#007AFF', // Static primary
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF', // Static white
  },
  avatarLabel: {
    fontSize: Typography.fontSize.sm,
    color: '#636366', // Static gray600
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
    color: '#1F2937', // Static gray900
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#4B5563', // Static gray700
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: '#FFFFFF', // Static white
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: '#1F2937', // Static gray900
    borderWidth: 1,
    borderColor: '#D1D1D6', // Static gray200
    ...Shadows.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfileScreen;
