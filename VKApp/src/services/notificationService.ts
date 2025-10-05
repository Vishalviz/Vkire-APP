import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Schedule a local notification
  static async scheduleNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Notification permissions not granted');
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null, // Send immediately if no trigger
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  // Send immediate notification
  static async sendNotification(title: string, body: string, data?: any): Promise<string> {
    return this.scheduleNotification(title, body, data);
  }

  // Cancel a notification
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Show in-app notification (Alert for now, can be replaced with custom modal)
  static showInAppNotification(title: string, message: string): void {
    Alert.alert(title, message);
  }

  // Notification types for different events
  static async notifyJobAccepted(customerName: string, service: string): Promise<void> {
    await this.sendNotification(
      'Job Accepted!',
      `${customerName} has accepted your ${service} booking request.`,
      { type: 'job_accepted' }
    );
  }

  static async notifyJobDeclined(customerName: string, service: string): Promise<void> {
    await this.sendNotification(
      'Job Declined',
      `${customerName} has declined your ${service} booking request.`,
      { type: 'job_declined' }
    );
  }

  static async notifyNewMessage(senderName: string, message: string): Promise<void> {
    await this.sendNotification(
      `New message from ${senderName}`,
      message.length > 50 ? `${message.substring(0, 50)}...` : message,
      { type: 'new_message' }
    );
  }

  static async notifyNewBooking(customerName: string, service: string): Promise<void> {
    await this.sendNotification(
      'New Booking Request',
      `${customerName} has requested your ${service} services.`,
      { type: 'new_booking' }
    );
  }

  static async notifyBookingConfirmed(proName: string, service: string, date: string): Promise<void> {
    await this.sendNotification(
      'Booking Confirmed!',
      `Your ${service} booking with ${proName} is confirmed for ${date}.`,
      { type: 'booking_confirmed' }
    );
  }

  static async notifyReviewReceived(customerName: string, rating: number): Promise<void> {
    await this.sendNotification(
      'New Review Received',
      `${customerName} left you a ${rating}-star review!`,
      { type: 'new_review' }
    );
  }

  static async notifyPaymentReceived(amount: number, customerName: string): Promise<void> {
    await this.sendNotification(
      'Payment Received',
      `You received ₹${amount.toLocaleString()} from ${customerName}.`,
      { type: 'payment_received' }
    );
  }
}

export default NotificationService;
