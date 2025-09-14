# MegaCoop User App

A modern React TypeScript application with authentication, protected routes, and a clean dashboard interface.

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router (Data Mode)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Data Fetching**: TanStack Query

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components (Header, Sidebar, etc.)
│   ├── other files...
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
│   ├── axiosInstance.ts # Axios configuration
│   ├── queryClient.ts   # TanStack Query setup
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── auth/            # Login, Signup pages
│   └── Dashboard.tsx    # Dashboard and other pages
├── store/               # Zustand stores
│   └── authStore.ts     # Authentication state management
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   └── dashboard.ts     # Dashboard types
└── routes.tsx           # Application routing configuration
```

## 🛠️ Setup Instructions

### 1. Clone & Install
```bash
git clone <repository-url>
cd megacoop-user-app
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
# Copy the example below and update the API URL when backend is ready
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```


## 🔐 Authentication Flow

### Current Setup
- **Protected Routes**: Dashboard routes require authentication
- **Auth Store**: Zustand store manages user state (`src/store/authStore.ts`)
- **Route Protection**: Automatic redirect to login for unauthenticated users
- **Loading States**: Prevents flash of content during auth checks

### Implementation Notes
- Auth store is **token-strategy agnostic** (works with Bearer tokens or httpOnly cookies)
- API service ready for integration (`src/lib/axiosInstance.ts`)
- Login/Signup forms need implementation with React Hook Form + Zod

## 🛣️ Routing

Uses React Router's data-mode with `createBrowserRouter`:
- `/` - Redirects to `/dashboard`
- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/dashboard` - Protected dashboard (requires auth)
- `/dashboard/transactions` - Transactions page
- `/dashboard/settings` - Settings page


## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Create feature branch from `main`
2. Follow existing code structure and naming conventions
3. Add types for new features
4. Test your changes locally
5. Submit pull request

---

**Happy coding! 🚀**
