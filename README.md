# TaskManager-CRUD

A modern, feature-rich task management application built with React Native. TaskManager-CRUD provides a comprehensive solution for organizing your daily tasks with an intuitive interface, powerful filtering options, and robust data management.

## 🚀 Features

### Core Functionality
- **Create Tasks**: Add new tasks with detailed information including title, description, priority, and time
- **Read Tasks**: View all tasks with comprehensive filtering and search capabilities
- **Update Tasks**: Edit existing tasks and mark them as complete/incomplete
- **Delete Tasks**: Remove tasks you no longer need

### Advanced Features
- **Smart Dashboard**: Real-time progress tracking with key metrics and insights
- **Priority Management**: Categorize tasks as High, Medium, or Low priority
- **Time Management**: Set specific times, dates, and all-day options for tasks
- **Reminders System**: Built-in reminder functionality for important tasks
- **Search & Filter**: Powerful search across all tasks with multiple filter options
- **Dark/Light Theme**: Automatic theme switching based on system preferences

### User Experience
- **Biometric Authentication**: Secure login using fingerprint or face recognition
- **Profile Management**: Complete user profile with avatar, personal information, and settings
- **Multi-language Support**: Built-in country picker for international users
- **Intuitive Navigation**: Tab-based navigation with drawer menu for easy access

### Technical Features
- **Offline Support**: Local storage with AsyncStorage for reliable data persistence
- **Responsive Design**: Optimized for both phones and tablets
- **Performance Optimized**: Smooth animations and efficient rendering
- **Accessibility**: Full accessibility support with proper ARIA labels and navigation

## 🛠️ Tech Stack

### Frontend
- **React Native** 0.83.1 - Cross-platform mobile development
- **React** 19.2.0 - UI component library
- **React Navigation** - Navigation and routing
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions

### State Management & Storage
- **Context API** - State management for tasks and authentication
- **AsyncStorage** - Local data persistence
- **Biometrics** - Secure authentication

### UI & Styling
- **React Native Safe Area Context** - Safe area handling
- **React Native Screens** - Optimized screen rendering
- **React Native SVG** - Vector graphics support

### Development Tools
- **TypeScript** - Type safety and better development experience
- **ESLint** - Code linting and formatting
- **Jest** - Testing framework

## 📦 Installation

### Prerequisites
- Node.js (version 20 or higher)
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskManager-CRUD
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **For iOS development (macOS only)**
   ```bash
   # Install CocoaPods dependencies
   bundle install
   bundle exec pod install
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

## 🚀 Running the Application

### Android
```bash
npm run android
# or
yarn android
```

### iOS
```bash
npm run ios
# or
yarn ios
```

## 📋 Project Structure

```
TaskManager-CRUD/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DashboardCard.jsx
│   │   ├── TaskCard.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── icons/           # Custom icon components
│   ├── context/            # React Context providers
│   │   ├── TasksContext.jsx
│   │   └── AuthContext.jsx
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.jsx
│   │   ├── TabNavigator.jsx
│   │   └── DrawerNavigator.jsx
│   ├── screens/            # Main application screens
│   │   ├── Home.jsx
│   │   ├── Tasks.jsx
│   │   ├── AddTask.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   ├── services/           # API and data services
│   │   └── api.js
│   ├── theme/              # Theme and styling
│   │   ├── colors.js
│   │   ├── spacing.js
│   │   └── typography.js
│   └── animations/         # Animation utilities
│       └── fadeIn.js
├── android/                # Android-specific files
├── ios/                    # iOS-specific files
├── __tests__/              # Test files
└── assets/                 # Static assets
```

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality. The application uses local storage for data persistence.

### Theme Customization
The application supports theme customization through the theme system:

```javascript
// In src/theme/colors.js
export const lightTheme = {
  primary: '#4F46E5',
  background: '#FFFFFF',
  card: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

export const darkTheme = {
  primary: '#818CF8',
  background: '#0B1220',
  card: '#111827',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#1F2937',
};
```

## 🧪 Testing

The project includes Jest for testing:

```bash
# Run all tests
npm test
# or
yarn test

# Run tests with coverage
npm test -- --coverage
```

## 📱 Supported Platforms

- **Android** 5.0 (API level 21) and above
- **iOS** 12.0 and above

## 🔒 Security Features

- **Biometric Authentication**: Secure login using device biometrics
- **Data Encryption**: Sensitive data is encrypted locally
- **Secure Storage**: Uses AsyncStorage with security best practices

## 🌐 Internationalization

The application supports multiple languages and regions:
- Built-in country picker for user preferences
- Date and time formatting based on locale
- RTL language support ready

## 📊 Performance

- **Optimized Rendering**: Uses FlatList for efficient task display
- **Memory Management**: Proper cleanup and state management
- **Smooth Animations**: 60fps animations with React Native Reanimated
- **Offline First**: Works without internet connection

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the [FAQ](#faq) section below**
2. **Search existing issues** on our [GitHub Issues](https://github.com/your-repo/TaskManager-CRUD/issues)
3. **Create a new issue** if you can't find a solution
4. **Join our community** on Discord (link to be added)

## 📞 Contact

For support and inquiries:
- **Email**: lakshaymanchanda574@gmail.com/support@taskmanagercrud.com
- **Website**: [taskmanagercrud.com](https://taskmanagercrud.com) (Under Construction)
- **GitHub**: [@lakshaymanchanda18](https://github.com/lakshaymanchanda18)
- **LinkedIn**: [@Lakshay Manchanda](https://www.linkedin.com/in/lakshay-manchanda-2431a3319/)

## 🤔 FAQ

### How do I reset my password?
Navigate to Settings → Change Password to update your password securely.

### Can I use the app without internet?
Yes! The application works completely offline using local storage.

### How are my tasks backed up?
Tasks are stored locally on your device. For backup, consider using cloud storage solutions.

### Is my data secure?
Yes, all data is stored locally and encrypted. We don't transmit your task data to any servers.

### How do I enable biometric authentication?
Go to Settings → Security and enable biometric login.

## 🔄 Changelog

### Version 1.0.0
- Initial release with core CRUD functionality
- Dashboard with progress tracking
- Task management with priority and time settings
- Biometric authentication
- Dark/light theme support

## 🙏 Acknowledgments

- React Native community for the excellent framework
- All contributors who helped make this project possible
- Users who provided valuable feedback during development

---

**TaskManager-CRUD** - Your reliable companion for task management. 🚀