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
            <Ionicons name="heart" size={16} color="#FF3B30" />
            <Text style={styles.engagementText}>{item.likes}</Text>
          </View>
          <View style={styles.engagementItem}>
            <Ionicons name="chatbubble" size={16} color="#8E8E93" />
            <Text style={styles.engagementText}>{item.comments}</Text>
          </View>
          <Text style={styles.dateText}>{item.createdAt}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#8E8E93" />
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
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Post</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#007AFF" />
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
            <Ionicons name="images-outline" size={64} color="#8E8E93" />
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
                <Ionicons name="close" size={24} color="#666" />
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
                    <Ionicons name="camera" size={32} color="#8E8E93" />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  filterButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  portfolioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  portfolioContent: {
    padding: 12,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  moreButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyActionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Modal Styles
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
  },
  imageSection: {
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
  changeImageButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  changeImageButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
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

export default PortfolioManagerScreen;
