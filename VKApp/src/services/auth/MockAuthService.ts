import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, ProProfile } from '../../types';
import { IAuthService } from './types';

const MOCK_USER_STORAGE_KEY = 'mock_auth_user';

export class MockAuthService implements IAuthService {
    async initialize(): Promise<User | null> {
        try {
            const storedUser = await AsyncStorage.getItem(MOCK_USER_STORAGE_KEY);
            if (storedUser) {
                return JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('MockAuthService: Failed to restore session', error);
        }
        return null;
    }

    async signIn(email: string, password: string, name?: string, role?: UserRole): Promise<User> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userRole = role || 'customer';
        const mockUser: User = {
            id: 'demo-user-1',
            role: userRole,
            name: name || email.split('@')[0],
            email,
            created_at: new Date().toISOString(),
            profileCompleted: userRole === 'customer', // Customers don't need onboarding
        };

        await AsyncStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
        return mockUser;
    }

    async signUp(email: string, password: string, role: UserRole, name?: string, businessName?: string, city?: string, phone?: string): Promise<User> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: `demo-user-${Date.now()}`,
            role,
            name: name || email.split('@')[0],
            email,
            city: city || 'Delhi',
            phone: phone,
            created_at: new Date().toISOString(),
            profileCompleted: role === 'customer',
        };

        await AsyncStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
        return mockUser;
    }

    async signOut(): Promise<void> {
        await AsyncStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }

    async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
        const currentUser = await this.initialize();
        if (!currentUser || currentUser.id !== userId) {
            throw new Error('User not found or unauthorized');
        }

        const updatedUser = { ...currentUser, ...updates };
        await AsyncStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    }

    async markProfileCompleted(userId: string): Promise<User> {
        return this.updateProfile(userId, { profileCompleted: true });
    }

    async createProfessionalProfile(userId: string, profile: Partial<ProProfile>): Promise<void> {
        // In a real app, this would save to a separate table
        // For mock, we just acknowledge it
        console.log('MockAuthService: Created professional profile for', userId, profile);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
