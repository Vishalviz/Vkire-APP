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
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ProProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

type ProfessionalOnboardingNavigationProp = StackNavigationProp<RootStackParamList, 'ProfessionalOnboarding'>;

const ProfessionalOnboardingScreen = () => {
  const navigation = useNavigation<ProfessionalOnboardingNavigationProp>();
  const { user, updateProfile, createProfessionalProfile, markProfileCompleted } = useAuth();
  const { colors } = useTheme();

  const [currentStep, setCurrentStep] = useState(1);
  const progressAnim = useRef(new Animated.Value(1 / 3)).current;

  // Refs for auto-advancing between fields
  const businessNameRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);
  const mainCameraRef = useRef<TextInput>(null);
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

  const equipmentOptions = [
    { id: 'DSLR Camera', icon: 'camera' },
    { id: 'Mirrorless Camera', icon: 'camera-outline' },
    { id: 'Lens Kit', icon: 'aperture' },
    { id: 'Lighting Equipment', icon: 'bulb' },
    { id: 'Tripod', icon: 'construct' },
    { id: 'Drone', icon: 'airplane' },
    { id: 'Gimbal', icon: 'phone-portrait' },
    { id: 'External Mic', icon: 'mic' },
  ];

  const photographyStyles = [
    { id: 'Portrait', icon: 'person' },
    { id: 'Wedding', icon: 'heart' },
    { id: 'Event', icon: 'calendar' },
    { id: 'Commercial', icon: 'business' },
    { id: 'Fashion', icon: 'shirt' },
    { id: 'Street', icon: 'walk' },
    { id: 'Nature', icon: 'leaf' },
    { id: 'Architecture', icon: 'business' },
  ];

  const videoStyles = [
    { id: 'Cinematic', icon: 'film' },
    { id: 'Documentary', icon: 'videocam' },
    { id: 'Commercial', icon: 'megaphone' },
    { id: 'Social Media', icon: 'logo-instagram' },
    { id: 'Event Coverage', icon: 'people' },
    { id: 'Interview', icon: 'chatbubbles' },
    { id: 'Music Video', icon: 'musical-notes' },
    { id: 'Real Estate', icon: 'home' },
  ];

  const editingSoftware = [
    { id: 'Adobe Photoshop', icon: 'image' },
    { id: 'Adobe Lightroom', icon: 'contrast' },
    { id: 'Adobe Premiere Pro', icon: 'film' },
    { id: 'Final Cut Pro', icon: 'cut' },
    { id: 'DaVinci Resolve', icon: 'color-palette' },
    { id: 'Adobe After Effects', icon: 'layers' },
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.businessName.trim()) {
          Alert.alert('Required Field', 'Please enter your business name');
          return false;
        }
        if (!formData.bio.trim()) {
          Alert.alert('Required Field', 'Please tell us about yourself');
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
        return true;
      case 2:
        if (!formData.mainCamera.trim()) {
          Alert.alert('Required Field', 'Please enter your main camera');
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
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      Animated.spring(progressAnim, {
        toValue: nextStep / 3,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      Animated.spring(progressAnim, {
        toValue: prevStep / 3,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      navigation.goBack();
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
        editing_software: formData.editingSoftware.map(s => s),
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
      <View style={[styles.stepIconContainer, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name="person" size={32} color={colors.primary} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.gray900 }]}>Tell us about yourself</Text>
      <Text style={[styles.stepDescription, { color: colors.gray600 }]}>
        Help customers know who you are and what makes you unique
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Business Name *</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="briefcase-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
          <TextInput
            ref={businessNameRef}
            style={[styles.input, { color: colors.gray900 }]}
            placeholder="Enter your business name"
            placeholderTextColor={colors.gray400}
            value={formData.businessName}
            onChangeText={(text) => setFormData({ ...formData, businessName: text })}
            onSubmitEditing={() => bioRef.current?.focus()}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Bio *</Text>
        <View style={[styles.inputWrapper, styles.textAreaWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            ref={bioRef}
            style={[styles.input, styles.textArea, { color: colors.gray900 }]}
            placeholder="Tell us about your photography/videography experience..."
            placeholderTextColor={colors.gray400}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
            onSubmitEditing={() => experienceRef.current?.focus()}
          />
        </View>
        <Text style={[styles.helperText, { color: colors.gray500 }]}>
          Share your passion, experience, and what makes your work special
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Years of Experience *</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="time-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
          <TextInput
            ref={experienceRef}
            style={[styles.input, { color: colors.gray900 }]}
            placeholder="e.g., 5"
            placeholderTextColor={colors.gray400}
            value={formData.experienceYears}
            onChangeText={(text) => setFormData({ ...formData, experienceYears: text })}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.stepIconContainer, { backgroundColor: colors.success + '15' }]}>
        <Ionicons name="camera" size={32} color={colors.success} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.gray900 }]}>Your Equipment & Style</Text>
      <Text style={[styles.stepDescription, { color: colors.gray600 }]}>
        Showcase your gear and creative specialties
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Main Camera *</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="camera-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
          <TextInput
            ref={mainCameraRef}
            style={[styles.input, { color: colors.gray900 }]}
            placeholder="e.g., Canon EOS R5"
            placeholderTextColor={colors.gray400}
            value={formData.mainCamera}
            onChangeText={(text) => setFormData({ ...formData, mainCamera: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Secondary Camera (Optional)</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="camera-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.gray900 }]}
            placeholder="e.g., Sony A7III"
            placeholderTextColor={colors.gray400}
            value={formData.secondaryCamera}
            onChangeText={(text) => setFormData({ ...formData, secondaryCamera: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Equipment (Optional)</Text>
        <View style={styles.tagContainer}>
          {equipmentOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tag,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                formData.equipment.includes(item.id) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.equipment, item.id, (items) =>
                setFormData({ ...formData, equipment: items })
              )}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={formData.equipment.includes(item.id) ? colors.white : colors.gray600}
              />
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.equipment.includes(item.id) && { color: colors.white }
              ]}>
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Photography Styles *</Text>
        <View style={styles.tagContainer}>
          {photographyStyles.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tag,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                formData.photographyStyle.includes(item.id) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.photographyStyle, item.id, (items) =>
                setFormData({ ...formData, photographyStyle: items })
              )}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={formData.photographyStyle.includes(item.id) ? colors.white : colors.gray600}
              />
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.photographyStyle.includes(item.id) && { color: colors.white }
              ]}>
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Video Styles (Optional)</Text>
        <View style={styles.tagContainer}>
          {videoStyles.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tag,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                formData.videoStyle.includes(item.id) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.videoStyle, item.id, (items) =>
                setFormData({ ...formData, videoStyle: items })
              )}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={formData.videoStyle.includes(item.id) ? colors.white : colors.gray600}
              />
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.videoStyle.includes(item.id) && { color: colors.white }
              ]}>
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.stepIconContainer, { backgroundColor: colors.warning + '15' }]}>
        <Ionicons name="location" size={32} color={colors.warning} />
      </View>
      <Text style={[styles.stepTitle, { color: colors.gray900 }]}>Services & Availability</Text>
      <Text style={[styles.stepDescription, { color: colors.gray600 }]}>
        Let customers know where you work and what tools you use
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Editing Software (Optional)</Text>
        <View style={styles.tagContainer}>
          {editingSoftware.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tag,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                formData.editingSoftware.includes(item.id) && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => toggleArrayItem(formData.editingSoftware, item.id, (items) =>
                setFormData({ ...formData, editingSoftware: items })
              )}
            >
              <Ionicons
                name={item.icon as any}
                size={16}
                color={formData.editingSoftware.includes(item.id) ? colors.white : colors.gray600}
              />
              <Text style={[
                styles.tagText,
                { color: colors.gray700 },
                formData.editingSoftware.includes(item.id) && { color: colors.white }
              ]}>
                {item.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.gray700 }]}>Travel Radius (km) *</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="navigate-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
          <TextInput
            ref={travelRadiusRef}
            style={[styles.input, { color: colors.gray900 }]}
            placeholder="e.g., 100"
            placeholderTextColor={colors.gray400}
            value={formData.travelRadius}
            onChangeText={(text) => setFormData({ ...formData, travelRadius: text })}
            keyboardType="numeric"
          />
        </View>
        <Text style={[styles.helperText, { color: colors.gray500 }]}>
          How far are you willing to travel for projects?
        </Text>
      </View>
    </View>
  );

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.gray600} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Logo size="small" />
          <Text style={[styles.headerTitle, { color: colors.gray900 }]}>Professional Setup</Text>
        </View>

        <View style={[styles.stepIndicator, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.stepText, { color: colors.primary }]}>{currentStep}/3</Text>
        </View>
      </View>

      {/* Animated Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.gray200 }]}>
        <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: colors.primary }]} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[styles.nextButtonText, { color: colors.white }]}>
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Text>
          <Ionicons name={currentStep === 3 ? "checkmark" : "arrow-forward"} size={20} color={colors.white} />
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
  },
  backButton: {
    padding: Spacing.xs,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: Spacing.sm,
  },
  stepIndicator: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  progressContainer: {
    height: 4,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 200,
  },
  stepContainer: {
    flex: 1,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  stepTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  tagText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
});

export default ProfessionalOnboardingScreen;