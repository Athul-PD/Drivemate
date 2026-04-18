# DriveMate

A modern, feature-rich transaction and fleet management application built with React, TypeScript, and Vite. DriveMate provides comprehensive financial analytics, transaction tracking, team member management, and admin controls for organizations.

## 🎯 Overview

DriveMate is designed to streamline financial operations and fleet management. It includes secure authentication, real-time analytics, transaction search and filtering, member management, and customizable settings—all delivered through a responsive, intuitive interface.

## ✨ Features

- **User Authentication** - Secure sign-in/sign-up with Firebase Authentication
- **Dashboard** - Comprehensive overview with key metrics and analytics
- **Analytics** - Real-time financial analytics and reporting
- **Transaction Management** - Search, filter, and manage transactions with ease
- **Member Management** - Add, manage, and monitor team members
- **Admin Controls** - Full administrative settings and configurations
- **Responsive Design** - Mobile-first, accessible UI built with Tailwind CSS
- **Type Safety** - Full TypeScript support for robust development
- **State Management** - Redux Toolkit for predictable state handling
- **Form Validation** - React Hook Form with Yup schema validation

## 🛠 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org)
- **Build Tool**: [Vite 7](https://vitejs.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org)
- **Routing**: [React Router v7](https://www.reactrouter.com)
- **Authentication**: [Firebase](https://firebase.google.com)
- **Form Handling**: [React Hook Form](https://react-hook-form.com) + [Yup](https://github.com/jquense/yup)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons)
- **Code Quality**: [ESLint](https://eslint.org) + [TypeScript ESLint](https://typescript-eslint.io)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── auth/          # Authentication pages (Sign in, Sign up)
│   ├── dashboard/     # Dashboard pages (Analytics, Transactions, Members, etc.)
│   └── home/          # Home/landing pages
├── context/           # React Context (AuthContext)
├── firebase-auth/     # Firebase configuration
├── routes/            # Route protection and definitions
├── services/          # API and external service calls
├── store/             # Redux store configuration
├── styles/            # Global and component-specific styles
├── App.tsx            # Root application component
└── main.tsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DriveMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update Firebase credentials in `src/firebase-auth/firebase.ts`
   - Set up your Firebase project with authentication enabled

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🔐 Authentication

DriveMate uses Firebase Authentication for secure user management:
- Email/password authentication
- Protected routes via `ProtectedRoute` component
- Persistent authentication state in `AuthContext`
- Automatic session management

## 📊 Key Pages

- **Sign In/Sign Up** - User authentication interface
- **Dashboard** - Main application hub with overview metrics
- **Analytics** - Financial and performance analytics
- **Transactions** - Transaction history with search and filtering
- **Members** - Team member management interface
- **Settings** - User and application preferences
- **Admin Panel** - Administrative controls (with appropriate permissions)

## 🎨 Styling & UI

The application uses **Tailwind CSS** for responsive, utility-first styling. Custom styles are located in the `src/styles/` directory for component-specific styling when needed.

Key design principles:
- Mobile-first responsive design
- Accessibility-focused components
- Consistent design system with Tailwind
- Dark/light mode support ready

## 🧪 Code Quality

- **TypeScript** for type safety and developer experience
- **ESLint** for code consistency
- **Vite** for fast development and optimized builds
- Strict TypeScript configuration in `tsconfig.json` and `tsconfig.app.json`

## 📦 Dependencies

Key dependencies and their purposes:
- `react` & `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `@reduxjs/toolkit` & `react-redux` - State management
- `firebase` - Backend services and authentication
- `react-hook-form` - Efficient form state management
- `yup` - Schema validation for forms
- `tailwindcss` - Utility-first CSS framework
- `react-icons` - Icon library

## 🤝 Contributing

1. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues & Improvements

- React Compiler not enabled (for dev/build performance)
- Consider enabling stricter TypeScript ESLint rules for production
- Add unit tests (Jest + React Testing Library)
- Implement E2E testing (Cypress/Playwright)

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository or contact the development team.

---

**Last Updated**: April 2026
