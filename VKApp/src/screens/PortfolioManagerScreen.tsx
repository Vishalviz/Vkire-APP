import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  // Mock data for demo
  const portfolioPosts: PortfolioPost[] = [
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
  ];

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
        <TouchableOpacity style={styles.addButton}>
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
});

export default PortfolioManagerScreen;
