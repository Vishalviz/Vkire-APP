import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker'; // Not used directly, handled by ImagePickerModal
import ImagePickerModal from '../components/ImagePickerModal';
import { useTheme } from '../contexts/AppThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

interface PortfolioPost {
  id: string;
  mediaUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

const PortfolioManagerScreen: React.FC = () => {
  const { colors } = useTheme();
  const [portfolioPosts, setPortfolioPosts] = useState<PortfolioPost[]>([
    {
      id: '1',
      mediaUrl: 'https://via.placeholder.com/300x300',
      caption: 'Beautiful wedding photography in Delhi',
      tags: ['wedding', 'photography', 'delhi'],
      likes: 45,
      comments: 8,
      createdAt: '2024-09-15',
    },
    {
      id: '2',
      mediaUrl: 'https://via.placeholder.com/300x300',
      caption: 'Fashion portfolio shoot for model',
      tags: ['fashion', 'portfolio', 'model'],
      likes: 32,
      comments: 5,
      createdAt: '2024-09-10',
    },
    {
      id: '3',
      mediaUrl: 'https://via.placeholder.com/300x300',
      caption: 'Corporate headshots for business',
      tags: ['corporate', 'headshots', 'business'],
      likes: 28,
      comments: 3,
      createdAt: '2024-09-05',
    },
  ]);

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handleAddPost = () => {
    setShowAddPostModal(true);
  };

  const handleImageSelected = (uri: string) => {
    setSelectedImageUri(uri);
    setShowImagePicker(false);
  };

  const handleSavePost = async () => {
    if (!selectedImageUri || !newPostCaption.trim()) {
      Alert.alert('Error', 'Please select an image and add a caption.');
      return;
    }

    try {
      const newPost: PortfolioPost = {
        id: Date.now().toString(),
        mediaUrl: selectedImageUri,
        caption: newPostCaption,
        tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setPortfolioPosts(prevPosts => [newPost, ...prevPosts]);
      
      // Reset form
      setSelectedImageUri(null);
      setNewPostCaption('');
      setNewPostTags('');
      setShowAddPostModal(false);
      
      Alert.alert('Success', 'Portfolio post added successfully!');
      
      // Here you would typically make an API call to save the post
      // await DatabaseService.createPortfolioPost(newPost);
    } catch (error) {
      Alert.alert('Error', 'Failed to add portfolio post. Please try again.');
    }
  };

  // TODO: Implement delete functionality when needed
  // const handleDeletePost = (postId: string) => {
  //   Alert.alert(
  //     'Delete Post',
  //     'Are you sure you want to delete this portfolio post?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: () => {
  //           setPortfolioPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  //           Alert.alert('Success', 'Portfolio post deleted successfully!');
  //           
  //           // Here you would typically make an API call to delete the post
  //           // await DatabaseService.deletePortfolioPost(postId);
  //         },
  //       },
  //     ]
  //   );
  // };

  const renderPortfolioItem = ({ item }: { item: PortfolioPost }) => (
    <TouchableOpacity style={styles.portfolioCard}>
      <Image source={{ uri: item.mediaUrl }} style={styles.portfolioImage} />
      
      <View style={styles.portfolioContent}>
        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.engagementRow}>
          <View style={styles.engagementItem}>
            <Ionicons name="heart" size={16} color={colors.primary} />
            <Text style={styles.engagementText}>{item.likes}</Text>
          </View>
          <View style={styles.engagementItem}>
            <Ionicons name="chatbubble" size={16} color={colors.gray500} />
            <Text style={styles.engagementText}>{item.comments}</Text>
          </View>
          <Text style={styles.dateText}>{item.createdAt}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.gray500} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio Manager</Text>
        <Text style={styles.subtitle}>Manage your photography portfolio</Text>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add Post</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={portfolioPosts}
        renderItem={renderPortfolioItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={colors.gray500} />
            <Text style={styles.emptyTitle}>No portfolio posts yet</Text>
            <Text style={styles.emptySubtitle}>
              Start building your portfolio by adding your best work
            </Text>
            <TouchableOpacity style={styles.emptyActionButton}>
              <Text style={styles.emptyActionButtonText}>Add Your First Post</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add Post Modal */}
      <Modal
        visible={showAddPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddPostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Portfolio Post</Text>
              <TouchableOpacity onPress={() => setShowAddPostModal(false)}>
                <Ionicons name="close" size={24} color={colors.gray500} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Image Selection */}
              <View style={styles.imageSection}>
                {selectedImageUri ? (
                  <Image source={{ uri: selectedImageUri }} style={styles.selectedImage} />
                ) : (
                  <TouchableOpacity 
                    style={styles.imagePlaceholder}
                    onPress={() => setShowImagePicker(true)}
                  >
                    <Ionicons name="camera" size={32} color={colors.gray500} />
                    <Text style={styles.imagePlaceholderText}>Select Image</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={() => setShowImagePicker(true)}
                >
                  <Text style={styles.changeImageButtonText}>
                    {selectedImageUri ? 'Change Image' : 'Select Image'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Caption Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Caption *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Describe your work..."
                  value={newPostCaption}
                  onChangeText={setNewPostCaption}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Tags Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="wedding, photography, delhi (comma separated)"
                  value={newPostTags}
                  onChangeText={setNewPostTags}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowAddPostModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveModalButton}
                onPress={handleSavePost}
              >
                <Text style={styles.saveModalButtonText}>Save Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Static gray50
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing['3xl'],
    backgroundColor: '#FFFFFF', // Static white
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB', // Static gray200
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#1F2937', // Static gray900
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: '#636366', // Static gray600
  },
  actionBar: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007AFF', // Static primary
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  addButtonText: {
    color: '#FFFFFF', // Static white
    fontWeight: Typography.fontWeight.semiBold,
    fontSize: Typography.fontSize.base,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#007AFF', // Static primary
    gap: Spacing.xs,
  },
  filterButtonText: {
    color: '#007AFF', // Static primary
    fontWeight: Typography.fontWeight.semiBold,
    fontSize: Typography.fontSize.base,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
  portfolioCard: {
    backgroundColor: '#FFFFFF', // Static white
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    width: '48%',
    ...Shadows.md,
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
  },
  portfolioContent: {
    padding: Spacing.md,
  },
  caption: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#1F2937', // Static gray900
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: '#F2F2F7', // Static gray100
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    color: '#636366', // Static gray600
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  engagementText: {
    fontSize: Typography.fontSize.xs,
    color: '#636366', // Static gray600
  },
  dateText: {
    fontSize: Typography.fontSize.xs,
    color: '#636366', // Static gray600
  },
  moreButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    width: '100%',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#636366', // Static gray600
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: '#636366', // Static gray600
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.xl,
  },
  emptyActionButton: {
    backgroundColor: '#007AFF', // Static primary
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  emptyActionButtonText: {
    color: '#FFFFFF', // Static white
    fontWeight: Typography.fontWeight.semiBold,
    fontSize: Typography.fontSize.base,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // Static white
    borderRadius: BorderRadius.lg,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Static gray200
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#1F2937', // Static gray900
  },
  modalBody: {
    padding: Spacing.lg,
  },
  imageSection: {
    marginBottom: Spacing.lg,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F8F9FA', // Static gray50
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF', // Static gray200
    borderStyle: 'dashed',
    marginBottom: Spacing.sm,
  },
  imagePlaceholderText: {
    fontSize: Typography.fontSize.base,
    color: '#636366', // Static gray600
    marginTop: Spacing.sm,
  },
  changeImageButton: {
    backgroundColor: '#F2F2F7', // Static gray100
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignSelf: 'center',
  },
  changeImageButtonText: {
    color: '#007AFF', // Static primary
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: '#1F2937', // Static gray900
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#C7C7CC', // Static gray300
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    backgroundColor: '#F8F9FA', // Static background
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // Static gray200
    gap: Spacing.md,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F2F2F7', // Static gray100
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: Typography.fontSize.base,
    color: '#636366', // Static gray600
    fontWeight: Typography.fontWeight.medium,
  },
  saveModalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#007AFF', // Static primary
    alignItems: 'center',
  },
  saveModalButtonText: {
    fontSize: Typography.fontSize.base,
    color: '#FFFFFF', // Static white
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default PortfolioManagerScreen;
