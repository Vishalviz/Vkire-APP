import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { 
  RootStackParamList, 
  CustomerTabParamList, 
  ProfessionalTabParamList 
} from '../types';
import { Colors, Typography, Spacing, ComponentStyles } from '../constants/designSystem';

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

// New role-specific screens
import MyBookingsScreen from '../screens/MyBookingsScreen';
import MyJobsScreen from '../screens/MyJobsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PortfolioManagerScreen from '../screens/PortfolioManagerScreen';
import ProfessionalOnboardingScreen from '../screens/ProfessionalOnboardingScreen';

const Stack = createStackNavigator<RootStackParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const ProfessionalTab = createBottomTabNavigator<ProfessionalTabParamList>();

// Customer Tab Navigator
const CustomerTabNavigator = () => {
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
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
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
  return (
    <ProfessionalTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'MyJobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'PortfolioManager') {
            iconName = focused ? 'images' : 'images-outline';
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
          else if (route.name === 'Dashboard') label = 'Dashboard';
          else if (route.name === 'MyJobs') label = 'My Jobs';
          else if (route.name === 'PortfolioManager') label = 'Portfolio';
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
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: ComponentStyles.tabBar,
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
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
              options={{ headerShown: true, title: 'Booking Details' }}
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
              options={{ headerShown: true, title: 'Payment' }}
            />
            <Stack.Screen 
              name="ProfessionalOnboarding" 
              component={ProfessionalOnboardingScreen}
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