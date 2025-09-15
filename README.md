# VK App - Visual Creator Marketplace

A two-sided marketplace for hiring photographers, videographers, and editors in one place.

## Features

### MVP Features (v1.0)
- ✅ User authentication with role selection (Customer/Professional)
- ✅ Professional profiles with gear, services, and packages
- ✅ Portfolio feed with posts, likes, and comments
- ✅ Search and filtering for creators
- ✅ Creator profile pages with packages and portfolio
- ✅ Basic messaging system
- ✅ User profiles and settings

### Coming Soon (v1.1-v1.3)
- 🔄 Complete booking flow with payments
- 🔄 Real-time chat functionality
- 🔄 Review and rating system
- 🔄 Push notifications
- 🔄 Admin dashboard
- 🔄 Advanced search filters
- 🔄 Calendar integration

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Navigation**: React Navigation v6
- **State Management**: React Context
- **Payments**: Stripe + Razorpay
- **Notifications**: Expo Notifications

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VKApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `src/services/supabase.ts` with your credentials:
     ```typescript
     const supabaseUrl = 'YOUR_SUPABASE_URL';
     const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
     ```

4. **Set up the database schema**
   - Run the SQL commands from `database/schema.sql` in your Supabase SQL editor
   - This will create all necessary tables for the app

5. **Configure payments (optional for MVP)**
   - Set up Stripe account and get publishable key
   - Set up Razorpay account and get key ID
   - Update `src/constants/index.ts` with your payment keys

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Database Schema

The app uses the following main tables:

- `users` - User accounts and basic info
- `pro_profiles` - Professional creator profiles
- `packages` - Service packages offered by professionals
- `portfolio_posts` - Creator portfolio items
- `inquiries` - Customer inquiries to professionals
- `bookings` - Confirmed bookings
- `payments` - Payment transactions
- `chats` - Chat conversations
- `messages` - Individual chat messages
- `reviews` - Customer reviews of professionals

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── contexts/           # React contexts (Auth, etc.)
├── services/           # API services (Supabase, etc.)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # App constants and configuration
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

### State Management
- Use React Context for global state (auth, user data)
- Use local state for component-specific data
- Consider Redux Toolkit for complex state management in future

### API Integration
- All database operations go through `DatabaseService`
- Use Supabase client for real-time features
- Implement proper error handling and loading states

## Deployment

### Mobile App Stores
1. **Build for production**
   ```bash
   expo build:android
   expo build:ios
   ```

2. **Submit to stores**
   - Follow Expo's guide for app store submission
   - Ensure all required assets and metadata are included

### Backend
- Supabase handles hosting and scaling automatically
- Configure production environment variables
- Set up proper security rules and RLS policies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@vkapp.com or join our Discord community.

## Roadmap

### Phase 1 (MVP) - 6-8 weeks
- [x] Basic app structure and navigation
- [x] User authentication and profiles
- [x] Portfolio feed and creator profiles
- [ ] Complete booking flow
- [ ] Payment integration
- [ ] Basic chat functionality

### Phase 2 (v1.1) - 4-6 weeks
- [ ] Advanced search and filters
- [ ] Review and rating system
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Performance optimizations

### Phase 3 (v1.2) - 4-6 weeks
- [ ] Calendar integration
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced payment features

### Phase 4 (v1.3) - 6-8 weeks
- [ ] Video calling integration
- [ ] Advanced dispute resolution
- [ ] Enterprise features
- [ ] API for third-party integrations
- [ ] Advanced creator tools
