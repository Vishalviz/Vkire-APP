import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private permissionStatus: LocationPermissionStatus | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permission from the user
   */
  async requestPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      this.permissionStatus = {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status,
      };

      return this.permissionStatus;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return {
        granted: false,
        canAskAgain: true,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Check current location permission status
   */
  async checkPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      this.permissionStatus = {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status,
      };

      return this.permissionStatus;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return {
        granted: false,
        canAskAgain: true,
        status: Location.PermissionStatus.DENIED,
      };
    }
  }

  /**
   * Get current GPS location
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const permission = await this.checkPermission();
      
      if (!permission.granted) {
        const requestResult = await this.requestPermission();
        if (!requestResult.granted) {
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 100,
      });

      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      
      this.currentLocation = {
        latitude,
        longitude,
        address: this.formatAddress(address),
        city: (address?.city || address?.subregion) ?? undefined,
        region: address?.region ?? undefined,
        country: address?.country ?? undefined,
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Get last known location (cached)
   */
  getLastKnownLocation(): LocationData | null {
    return this.currentLocation;
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Sort professionals by proximity to user location
   */
  sortProfessionalsByDistance(
    professionals: any[],
    userLocation: LocationData
  ): any[] {
    return professionals
      .map((professional) => ({
        ...professional,
        distance: professional.latitude && professional.longitude
          ? this.calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              professional.latitude,
              professional.longitude
            )
          : null,
      }))
      .sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }

  /**
   * Show location permission prompt with explanation
   */
  showLocationPermissionPrompt(): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        'Location Permission',
        'Vkire needs access to your location to show nearby professionals and provide better service recommendations. Your location data is kept private and secure.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Allow',
            onPress: async () => {
              const permission = await this.requestPermission();
              resolve(permission.granted);
            },
          },
        ]
      );
    });
  }

  /**
   * Get location settings URL for manual permission management
   */
  async getLocationSettingsURL(): Promise<string> {
    return 'app-settings:location';
  }

  /**
   * Private helper methods
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private formatAddress(address: any): string {
    if (!address) return '';
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  }
}

export default LocationService.getInstance();
