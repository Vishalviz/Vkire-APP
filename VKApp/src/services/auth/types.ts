import { User, UserRole, ProProfile } from '../../types';

export interface IAuthService {
    initialize(): Promise<User | null>;
    signIn(email: string, password: string, name?: string, role?: UserRole): Promise<User>;
    signUp(email: string, password: string, role: UserRole, name?: string, businessName?: string, city?: string, phone?: string): Promise<User>;
    signOut(): Promise<void>;
    updateProfile(userId: string, updates: Partial<User>): Promise<User>;
    markProfileCompleted(userId: string): Promise<User>;
    createProfessionalProfile(userId: string, profile: Partial<ProProfile>): Promise<void>;
}
