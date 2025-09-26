import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ProProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type ProfessionalOnboardingRouteProp = RouteProp<RootStackParamList, 'ProfessionalOnboarding'>;
type ProfessionalOnboardingNavigationProp = StackNavigationProp<RootStackParamList, 'ProfessionalOnboarding'>;

const ProfessionalOnboardingScreen = () => {
  const navigation = useNavigation<ProfessionalOnboardingNavigationProp>();
  // const route = useRoute<ProfessionalOnboardingRouteProp>();
  const { user, updateProfile, createProfessionalProfile, markProfileCompleted } = useAuth();
  // const { role } = route.params;

  const [currentStep, setCurrentStep] = useState(1);
  
  // Refs for auto-advancing between fields
  const businessNameRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);
  const mainCameraRef = useRef<TextInput>(null);
  const secondaryCameraRef = useRef<TextInput>(null);
  const experienceRef = useRef<TextInput>(null);
  const travelRadiusRef = useRef<TextInput>(null);
  
  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    mainCamera: '',
    secondaryCamera: '',
    equipment: [] as string[],
    experienceYears: '',
    photographyStyle: [] as string[],
    videoStyle: [] as string[],
    editingSoftware: [] as string[],
    serviceAreas: [] as string[],
    travelRadius: '',
    city: '',
  });

  const equipmentOptions = ['DSLR Camera', 'Mirrorless Camera', 'Lens Kit', 'Lighting Equipment', 'Tripod', 'Drone', 'Gimbal', 'External Mic'];
  const photographyStyles = ['Portrait', 'Wedding', 'Event', 'Commercial', 'Fashion', 'Street', 'Nature', 'Architecture'];
  const videoStyles = ['Cinematic', 'Documentary', 'Commercial', 'Social Media', 'Event Coverage', 'Interview', 'Music Video', 'Real Estate'];
  const editingSoftware = ['Adobe Photoshop', 'Adobe Lightroom', 'Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Adobe After Effects'];
  const serviceAreas = ['Local (within 50km)', 'Regional (within 200km)', 'National', 'International'];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.businessName.trim()) {
          Alert.alert('Required Field', 'Please enter your business name');
          return false;
        }
        if (!formData.bio.trim()) {
          Alert.alert('Required Field', 'Please enter your bio');
          return false;
        }
        if (formData.bio.length < 50) {
          Alert.alert('Bio Too Short', 'Please write at least 50 characters about yourself');
          return false;
        }
        return true;
      case 2:
        if (!formData.mainCamera.trim()) {
          Alert.alert('Required Field', 'Please enter your main camera');
          return false;
        }
        if (!formData.experienceYears.trim()) {
          Alert.alert('Required Field', 'Please enter your years of experience');
          return false;
        }
        if (isNaN(parseInt(formData.experienceYears)) || parseInt(formData.experienceYears) < 0) {
          Alert.alert('Invalid Experience', 'Please enter a valid number of years');
          return false;
        }
        if (formData.photographyStyle.length === 0 && formData.videoStyle.length === 0) {
          Alert.alert('Required Field', 'Please select at least one photography or video style');
          return false;
        }
        return true;
      case 3:
        if (!formData.city.trim()) {
          Alert.alert('Required Field', 'Please enter your city');
          return false;
        }
        if (!formData.travelRadius.trim()) {
          Alert.alert('Required Field', 'Please enter your travel radius');
          return false;
        }
        if (isNaN(parseInt(formData.travelRadius)) || parseInt(formData.travelRadius) < 1) {
          Alert.alert('Invalid Travel Radius', 'Please enter a valid travel radius in kilometers');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // If on first step, go back to the previous screen
      // For professionals, go to Dashboard (MyJobs) instead of Feed
      if (user?.role === 'pro') {
        navigation.navigate('Main');
      } else {
        navigation.goBack();
      }
    }
  };

  const handleComplete = async () => {
    try {
      // Create professional profile data
      const proProfile: Partial<ProProfile> = {
        business_name: formData.businessName,
        bio: formData.bio,
        main_camera: formData.mainCamera,
        secondary_camera: formData.secondaryCamera,
        equipment: formData.equipment.join(', '),
        experience_years: parseInt(formData.experienceYears, 10) || 0,
        photography_style: formData.photographyStyle,
        video_style: formData.videoStyle,
        editing_software: formData.editingSoftware,
        service_areas: formData.serviceAreas,
        travel_radius_km: parseInt(formData.travelRadius, 10) || 50,
      };

      // Create professional profile
      if (createProfessionalProfile) {
        await createProfessionalProfile(proProfile);
      }

      // Update user profile with professional data
      await updateProfile({
        bio: formData.bio,
        // Add other fields as needed
      });

      // Mark profile as completed
      await markProfileCompleted();

      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput
          ref={businessNameRef}
          style={styles.input}
          placeholder="Enter your business name"
          value={formData.businessName}
          onChangeText={(text) => setFormData({ ...formData, businessName: text })}
          onSubmitEditing={() => bioRef.current?.focus()}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          ref={bioRef}
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about your photography/videography experience"
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          ref={experienceRef}
          style={styles.input}
          placeholder="e.g., 5"
          value={formData.experienceYears}
          onChangeText={(text) => setFormData({ ...formData, experienceYears: text })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Equipment & Style</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Main Camera</Text>
        <TextInput
          ref={mainCameraRef}
          style={styles.input}
          placeholder="e.g., Canon EOS R5"
          value={formData.mainCamera}
          onChangeText={(text) => setFormData({ ...formData, mainCamera: text })}
          onSubmitEditing={() => secondaryCameraRef.current?.focus()}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Secondary Camera</Text>
        <TextInput
          ref={secondaryCameraRef}
          style={styles.input}
          placeholder="e.g., Sony A7III"
          value={formData.secondaryCamera}
          onChangeText={(text) => setFormData({ ...formData, secondaryCamera: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Equipment</Text>
        <View style={styles.tagContainer}>
          {equipmentOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                formData.equipment.includes(item) && styles.tagSelected
              ]}
              onPress={() => toggleArrayItem(formData.equipment, item, (items) => 
                setFormData({ ...formData, equipment: items })
              )}
            >
              <Text style={[
                styles.tagText,
                formData.equipment.includes(item) && styles.tagTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Photography Styles</Text>
        <View style={styles.tagContainer}>
          {photographyStyles.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                formData.photographyStyle.includes(item) && styles.tagSelected
              ]}
              onPress={() => toggleArrayItem(formData.photographyStyle, item, (items) => 
                setFormData({ ...formData, photographyStyle: items })
              )}
            >
              <Text style={[
                styles.tagText,
                formData.photographyStyle.includes(item) && styles.tagTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Video Styles</Text>
        <View style={styles.tagContainer}>
          {videoStyles.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                formData.videoStyle.includes(item) && styles.tagSelected
              ]}
              onPress={() => toggleArrayItem(formData.videoStyle, item, (items) => 
                setFormData({ ...formData, videoStyle: items })
              )}
            >
              <Text style={[
                styles.tagText,
                formData.videoStyle.includes(item) && styles.tagTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Services & Availability</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Editing Software</Text>
        <View style={styles.tagContainer}>
          {editingSoftware.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                formData.editingSoftware.includes(item) && styles.tagSelected
              ]}
              onPress={() => toggleArrayItem(formData.editingSoftware, item, (items) => 
                setFormData({ ...formData, editingSoftware: items })
              )}
            >
              <Text style={[
                styles.tagText,
                formData.editingSoftware.includes(item) && styles.tagTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Areas</Text>
        <View style={styles.tagContainer}>
          {serviceAreas.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                formData.serviceAreas.includes(item) && styles.tagSelected
              ]}
              onPress={() => toggleArrayItem(formData.serviceAreas, item, (items) => 
                setFormData({ ...formData, serviceAreas: items })
              )}
            >
              <Text style={[
                styles.tagText,
                formData.serviceAreas.includes(item) && styles.tagTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Travel Radius (km)</Text>
        <TextInput
          ref={travelRadiusRef}
          style={styles.input}
          placeholder="e.g., 100"
          value={formData.travelRadius}
          onChangeText={(text) => setFormData({ ...formData, travelRadius: text })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={18} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Logo size="small" />
          <Text style={styles.headerTitle}>Professional Setup</Text>
        </View>
        
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step {currentStep} of 3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Complete Setup' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    marginLeft: Spacing.md,
  },
  stepIndicator: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  stepText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray700,
    fontWeight: Typography.fontWeight.medium,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray900,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.gray900,
    backgroundColor: Colors.surface,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  tagSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray700,
  },
  tagTextSelected: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semiBold,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
    marginRight: Spacing.sm,
  },
});

export default ProfessionalOnboardingScreen;
