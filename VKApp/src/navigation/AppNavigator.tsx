import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/AppThemeContext';
import { 
  RootStackParamList, 
  CustomerTabParamList, 
  ProfessionalTabParamList 
} from '../types';
import { Typography, Spacing, ComponentStyles } from '../constants/designSystem';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import FeedScreen from '../screens/FeedScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatorProfileScreen from '../screens/CreatorProfileScreen';
import PackageDetailsScreen from '../screens/PackageDetailsScreen';
import ChatScreen from '../screens/ChatScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import InquiryScreen from '../screens/InquiryScreen';
import ReviewScreen from '../screens/ReviewScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingScreen from '../screens/BookingScreen';

// New role-specific screens
import MyBookingsScreen from '../screens/MyBookingsScreen';
import MyJobsScreen from '../screens/MyJobsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PortfolioManagerScreen from '../screens/PortfolioManagerScreen';
import ProfessionalOnboardingScreen from '../screens/ProfessionalOnboardingScreen';
import InboxScreen from '../screens/InboxScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PriceListEditorScreen from '../screens/PriceListEditorScreen';

const Stack = createStackNavigator<RootStackParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const ProfessionalTab = createBottomTabNavigator<ProfessionalTabParamList>();

// Customer Tab Navigator
const CustomerTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyBookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          if (route.name === 'Feed') label = 'Feed';
          else if (route.name === 'Search') label = 'Search';
          else if (route.name === 'MyBookings') label = 'My Bookings';
          else if (route.name === 'Profile') label = 'Profile';
          
          return (
            <Text style={{
              fontSize: Typography.fontSize.xs,
              fontWeight: focused ? Typography.fontWeight.semiBold : Typography.fontWeight.medium,
              color,
              marginTop: Spacing.xs,
            }}>
              {label}
            </Text>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: ComponentStyles.tabBar,
        headerShown: false,
      })}
    >
      <CustomerTab.Screen name="Feed" component={FeedScreen} />
      <CustomerTab.Screen name="Search" component={SearchScreen} />
      <CustomerTab.Screen name="MyBookings" component={MyBookingsScreen} />
      <CustomerTab.Screen name="Profile" component={ProfileScreen} />
    </CustomerTab.Navigator>
  );
};

// Professional Tab Navigator
const ProfessionalTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <ProfessionalTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Feed') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Dashboard') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'MyJobs') iconName = focused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'PortfolioManager') iconName = focused ? 'images' : 'images-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else iconName = 'help-outline';
          // minimalist: highlight selected icon
          return (
            <View style={{
              backgroundColor: focused ? colors.primary + '1A' : 'transparent',
              borderRadius: 18,
              padding: 5,
            }}>
              <Ionicons name={iconName} size={22} color={focused ? colors.primary : colors.gray500} />
            </View>
          );
        },
        // minimalist: hide labels or show very subtle labels
        tabBarShowLabel: false,
        tabBarStyle: [
          ComponentStyles.tabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.gray200,
            borderRadius: 28,
            marginHorizontal: 12,
            marginBottom: 12,
            height: 64,
            shadowColor: colors.black,
            shadowOpacity: 0.07,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 8,
          },
        ],
        headerShown: false,
      })}
    >
      <ProfessionalTab.Screen name="Feed" component={FeedScreen} />
      <ProfessionalTab.Screen name="Search" component={SearchScreen} />
      <ProfessionalTab.Screen name="Dashboard" component={DashboardScreen} />
      <ProfessionalTab.Screen name="MyJobs" component={MyJobsScreen} />
      <ProfessionalTab.Screen name="PortfolioManager" component={PortfolioManagerScreen} />
      <ProfessionalTab.Screen name="Profile" component={ProfileScreen} />
    </ProfessionalTab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { navigationTheme } = useTheme();
  const [showSplash, setShowSplash] = React.useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (loading || showSplash) {
    return showSplash ? (
      <SplashScreen onAnimationComplete={handleSplashComplete} />
    ) : null;
  }

  // Determine which tab navigator to use based on user role
  const MainNavigator = () => {
    if (!user) return null;
    
    // Check if professional needs onboarding
    if (user.role === 'pro' && !user.profileCompleted) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="ProfessionalOnboarding" 
            component={ProfessionalOnboardingScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
      );
    }
    
    switch (user.role) {
      case 'customer':
        return <CustomerTabNavigator />;
      case 'pro':
        return <ProfessionalTabNavigator />;
      case 'admin':
        // For now, admins use customer navigation
        return <CustomerTabNavigator />;
      default:
        return <CustomerTabNavigator />;
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen 
          name="Inbox" 
          component={InboxScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PostDetail" 
          component={PostDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PaymentMethods" 
          component={PaymentMethodsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="NotificationSettings" 
          component={NotificationSettingsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="HelpSupport" 
          component={HelpSupportScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }} 
        />
            <Stack.Screen 
              name="CreatorProfile" 
              component={CreatorProfileScreen}
              options={{ headerShown: true, title: 'Creator Profile' }}
            />
            <Stack.Screen 
              name="PackageDetails" 
              component={PackageDetailsScreen}
              options={{ headerShown: true, title: 'Package Details' }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{ headerShown: true, title: 'Chat' }}
            />
            <Stack.Screen 
              name="BookingDetails" 
              component={BookingDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Inquiry" 
              component={InquiryScreen}
              options={{ headerShown: true, title: 'Send Inquiry' }}
            />
            <Stack.Screen 
              name="Review" 
              component={ReviewScreen}
              options={{ headerShown: true, title: 'Write Review' }}
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Booking" 
              component={BookingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProfessionalOnboarding" 
              component={ProfessionalOnboardingScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen 
              name="PriceListEditor" 
              component={PriceListEditorScreen}
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;