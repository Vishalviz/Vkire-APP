import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';
import { useTheme } from '../contexts/AppThemeContext';

// Optional DocumentPicker import with fallback
let DocumentPicker: any = null;
try {
  DocumentPicker = require('expo-document-picker').DocumentPicker;
} catch (error) {
  console.log('DocumentPicker not available');
}

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelected,
}) => {
  const { colors } = useTheme();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to select images.');
      return false;
    }
    return true;
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
      onClose();
      Alert.alert('Success', 'Photo taken successfully!');
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
      onClose();
      Alert.alert('Success', 'Image selected successfully!');
    }
  };

  const pickImageFromFiles = async () => {
    try {
      // Check if DocumentPicker is available
      if (!DocumentPicker) {
        Alert.alert('Not Available', 'File picker is not available on this platform.');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
        onClose();
        Alert.alert('Success', 'Image selected from files!');
      }
    } catch (error) {
      console.error('DocumentPicker error:', error);
      Alert.alert('Error', 'Failed to select image from files. Please try another option.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Drag Indicator */}
          <View style={styles.dragIndicator} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Image</Text>
            <Text style={styles.subtitle}>Choose how you'd like to add your image</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={pickImageFromCamera}>
              <View style={styles.optionIcon}>
                <Ionicons name="camera" size={24} color={colors.primary} />
              </View>
              <Text style={styles.optionText}>Take Photo</Text>
              <Text style={styles.optionSubtext}>Use camera to take a new photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={pickImageFromGallery}>
              <View style={styles.optionIcon}>
                <Ionicons name="images" size={24} color={colors.primary} />
              </View>
              <Text style={styles.optionText}>Choose from Gallery</Text>
              <Text style={styles.optionSubtext}>Select from your photo library</Text>
            </TouchableOpacity>

            {DocumentPicker && (
              <TouchableOpacity style={styles.option} onPress={pickImageFromFiles}>
                <View style={styles.optionIcon}>
                  <Ionicons name="document" size={24} color={colors.primary} />
                </View>
                <Text style={styles.optionText}>Choose from Files</Text>
                <Text style={styles.optionSubtext}>Select from your device files</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF', // Static white background
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? Spacing['3xl'] : Spacing.xl,
    paddingHorizontal: Spacing.xl,
    ...Shadows.lg,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#C7C7CC', // Static gray300 background
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#1A1A1A', // Static black color
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: '#636366', // Static gray600 color
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: Spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#F8F9FA', // Static gray50 background
    marginBottom: Spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#4DA6FF', // Static primaryLight background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937', // Static gray900 color
    marginBottom: Spacing.xs,
  },
  optionSubtext: {
    fontSize: Typography.fontSize.sm,
    color: '#4B5563', // Static gray600 color
  },
  cancelButton: {
    backgroundColor: '#D1D1D6', // Static gray200 background
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#4B5563', // Static gray700 color
  },
});

export default ImagePickerModal;
