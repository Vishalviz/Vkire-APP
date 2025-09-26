import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/designSystem';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentMethods'>;

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

const PaymentMethodsScreen = () => {
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa •••• 4242',
      details: 'Expires 12/25',
      isDefault: true,
      icon: 'card',
    },
    {
      id: '2',
      type: 'upi',
      name: 'UPI ID',
      details: 'user@paytm',
      isDefault: false,
      icon: 'phone-portrait',
    },
  ]);

  const handleAddMethod = (type: 'card' | 'upi' | 'wallet') => {
    setShowAddMethodModal(false);
    Alert.alert(
      'Add Payment Method',
      `Add ${type} functionality would be implemented here with proper payment gateway integration.`,
      [{ text: 'OK' }]
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    Alert.alert('Success', 'Default payment method updated!');
  };

  const handleDeleteMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
            Alert.alert('Success', 'Payment method deleted!');
          }
        },
      ]
    );
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return 'card-outline';
      case 'upi': return 'phone-portrait-outline';
      case 'wallet': return 'wallet-outline';
      default: return 'card-outline';
    }
  };

  const getMethodColor = (type: string) => {
    switch (type) {
      case 'card': return Colors.primary;
      case 'upi': return Colors.success;
      case 'wallet': return Colors.warning;
      default: return Colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <TouchableOpacity onPress={() => setShowAddMethodModal(true)}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Default Payment Method */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Default Payment Method</Text>
            <Text style={styles.sectionSubtitle}>This will be used for all transactions</Text>
          </View>

          {paymentMethods.filter(method => method.isDefault).map((method) => (
            <View key={method.id} style={[styles.paymentCard, styles.defaultCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <View style={[styles.cardIcon, { backgroundColor: getMethodColor(method.type) + '20' }]}>
                    <Ionicons name={getMethodIcon(method.type) as any} size={24} color={getMethodColor(method.type)} />
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardName}>{method.name}</Text>
                    <Text style={styles.cardSubtitle}>{method.details}</Text>
                  </View>
                </View>
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Other Payment Methods */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Other Payment Methods</Text>
          </View>

          {paymentMethods.filter(method => !method.isDefault).map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <View style={[styles.cardIcon, { backgroundColor: getMethodColor(method.type) + '20' }]}>
                    <Ionicons name={getMethodIcon(method.type) as any} size={24} color={getMethodColor(method.type)} />
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardName}>{method.name}</Text>
                    <Text style={styles.cardSubtitle}>{method.details}</Text>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Text style={styles.actionButtonText}>Set Default</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteMethod(method.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Add New Method Button */}
          <TouchableOpacity 
            style={styles.addMethodButton}
            onPress={() => setShowAddMethodModal(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.addMethodText}>Add New Payment Method</Text>
          </TouchableOpacity>

          {/* Payment Security Info */}
          <View style={styles.securityInfo}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
              <Text style={styles.securityTitle}>Secure Payments</Text>
            </View>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
            </Text>
          </View>
        </ScrollView>

        {/* Add Method Modal */}
        <Modal
          visible={showAddMethodModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddMethodModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Payment Method</Text>
                <TouchableOpacity onPress={() => setShowAddMethodModal(false)}>
                  <Ionicons name="close" size={24} color={Colors.gray600} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.methodOptions}>
                <TouchableOpacity 
                  style={styles.methodOption}
                  onPress={() => handleAddMethod('card')}
                >
                  <View style={[styles.methodIcon, { backgroundColor: Colors.primary + '20' }]}>
                    <Ionicons name="card" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>Credit/Debit Card</Text>
                    <Text style={styles.methodDescription}>Add a new card</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.methodOption}
                  onPress={() => handleAddMethod('upi')}
                >
                  <View style={[styles.methodIcon, { backgroundColor: Colors.success + '20' }]}>
                    <Ionicons name="phone-portrait" size={24} color={Colors.success} />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>UPI</Text>
                    <Text style={styles.methodDescription}>Add UPI ID</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.methodOption}
                  onPress={() => handleAddMethod('wallet')}
                >
                  <View style={[styles.methodIcon, { backgroundColor: Colors.warning + '20' }]}>
                    <Ionicons name="wallet" size={24} color={Colors.warning} />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>Digital Wallet</Text>
                    <Text style={styles.methodDescription}>Add wallet account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  paymentCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  defaultCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  defaultBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '20',
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error + '20',
    padding: Spacing.sm,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addMethodText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  securityInfo: {
    backgroundColor: Colors.success + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  securityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  securityText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray700,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
  },
  methodOptions: {
    gap: Spacing.md,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  methodDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
});

export default PaymentMethodsScreen;
