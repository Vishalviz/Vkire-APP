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
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type ProfessionalOnboardingRouteProp = RouteProp<RootStackParamList, 'ProfessionalOnboarding'>;
type ProfessionalOnboardingNavigationProp = StackNavigationProp<RootStackParamList, 'ProfessionalOnboarding'>;

const ProfessionalOnboardingScreen = () => {
  const navigation = useNavigation<ProfessionalOnboardingNavigationProp>();
  const { user, updateProfile, createProfessionalProfile, markProfileCompleted } = useAuth();
  const { colors } = useTheme(); // FIXED: Added useTheme hook

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
    city: user?.city || '',
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
      if (user?.role === 'pro') {
        navigation.navigate('Main');
      } else {
        navigation.goBack();
      }
    }
  };

  const handleComplete = async () => {
    try {
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

      if (createProfessionalProfile) {
        await createProfessionalProfile(proProfile);
      }

      await updateProfile({
        bio: formData.bio,
      });

      await markProfileCompleted();
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
      <Text style={[styles.stepTitle, { color: colors.gray900 }]}>Tell us about yourself</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Business Name</Text>
        <TextInput
          ref={businessNameRef}
          style={[styles.input, { borderColor: colors.gray300, color: colors.gray900, backgroundColor: colors.surface }]}
          placeholder="Enter your business name"
          placeholderTextColor={colors.gray500}
          value={formData.businessName}
          onChangeText={(text) => setFormData({ ...formData, businessName: text })}
          onSubmitEditing={() => bioRef.current?.focus()}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Bio</Text>
        <TextInput
          ref={bioRef}
          style={[styles.input, styles.textArea, { borderColor: colors.gray300, color: colors.gray900, backgroundColor: colors.surface }]}
          placeholder="Tell us about your photography/videography experience"
          placeholderTextColor={colors.gray500}
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Years of Experience</Text>
        <TextInput
          ref={experienceRef}
          style={[styles.input, { borderColor: colors.gray300, color: colors.gray900, backgroundColor: colors.surface }]}
          placeholder="e.g., 5"
          placeholderTextColor={colors.gray500}
          value={formData.experienceYears}
          onChangeText={(text) => setFormData({ ...formData, experienceYears: text })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.gray900 }]}>Your Equipment & Style</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Main Camera</Text>
        <TextInput
          ref={mainCameraRef}
          style={[styles.input, { borderColor: colors.gray300, color: colors.gray900, backgroundColor: colors.surface }]}
          placeholder="e.g., Canon EOS R5"
          placeholderTextColor={colors.gray500}
          value={formData.mainCamera}
          onChangeText={(text) => setFormData({ ...formData, mainCamera: text })}
          onSubmitEditing={() => secondaryCameraRef.current?.focus()}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Secondary Camera</Text>
        <TextInput
          ref={secondaryCameraRef}
          style={[styles.input, { borderColor: colors.gray300, color: colors.gray900, backgroundColor: colors.surface }]}
          placeholder="e.g., Sony A7III"
          placeholderTextColor={colors.gray500}
          value={formData.secondaryCamera}
          onChangeText={(text) => setFormData({ ...formData, secondaryCamera: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Equipment</Text>
        <View style={styles.tagContainer}>
          {equipmentOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                { backgroundColor: colors.gray100, borderColor: colors.gray300 },
                formData.equipment.includes(item) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.equipment, item, (items) => 
                setFormData({ ...formData, equipment: items })
              )}
            >
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.equipment.includes(item) && { color: colors.white }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Photography Styles</Text>
        <View style={styles.tagContainer}>
          {photographyStyles.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                { backgroundColor: colors.gray100, borderColor: colors.gray300 },
                formData.photographyStyle.includes(item) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.photographyStyle, item, (items) => 
                setFormData({ ...formData, photographyStyle: items })
              )}
            >
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.photographyStyle.includes(item) && { color: colors.white }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Video Styles</Text>
        <View style={styles.tagContainer}>
          {videoStyles.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                { backgroundColor: colors.gray100, borderColor: colors.gray300 },
                formData.videoStyle.includes(item) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.videoStyle, item, (items) => 
                setFormData({ ...formData, videoStyle: items })
              )}
            >
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.videoStyle.includes(item) && { color: colors.white }
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
      <Text style={[styles.stepTitle, { color: colors.gray900 }]}>Services & Availability</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Editing Software</Text>
        <View style={styles.tagContainer}>
          {editingSoftware.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                { backgroundColor: colors.gray100, borderColor: colors.gray300 },
                formData.editingSoftware.includes(item) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.editingSoftware, item, (items) => 
                setFormData({ ...formData, editingSoftware: items })
              )}
            >
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.editingSoftware.includes(item) && { color: colors.white }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Service Areas</Text>
        <View style={styles.tagContainer}>
          {serviceAreas.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tag,
                { backgroundColor: colors.gray100, borderColor: colors.gray300 },
                formData.serviceAreas.includes(item) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.serviceAreas, item, (items) => 
                setFormData({ ...formData, serviceAreas: items })
              )}
            >
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.serviceAreas.includes(item) && { color: colors.white }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray900 }]}>Travel Radius (km)</Text>
        <TextInput
          ref={travelRadiusRef}
          style={[styles.input, { borderColor: colors.gray300, color: colors.gray900, backgroundColor: colors.surface }]}
          placeholder="e.g., 100"
          placeholderTextColor={colors.gray500}
          value={formData.travelRadius}
          onChangeText={(text) => setFormData({ ...formData, travelRadius: text })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.gray200 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Logo size="small" />
          <Text style={[styles.headerTitle, { color: colors.gray900 }]}>Professional Setup</Text>
        </View>
        
        <View style={[styles.stepIndicator, { backgroundColor: colors.gray200 }]}>
          <Text style={[styles.stepText, { color: colors.gray700 }]}>Step {currentStep} of 3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.gray200 }]}>
        <View style={[styles.progressBar, { width: `${(currentStep / 3) * 100}%`, backgroundColor: colors.primary }]} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.gray200 }]}>
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={handleNext}>
          <Text style={[styles.nextButtonText, { color: colors.white }]}>
            {currentStep === 3 ? 'Complete Setup' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    ...Shadows.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.fontSize.sm,
    marginLeft: Spacing.xs,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: Spacing.md,
  },
  stepIndicator: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  stepText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  progressContainer: {
    height: 4,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
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
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.md,
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
    borderWidth: 1,
  },
  tagText: {
    fontSize: Typography.fontSize.sm,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    marginRight: Spacing.sm,
  },
});

export default ProfessionalOnboardingScreen;