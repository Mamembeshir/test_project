# Activity Dashboard Frontend

A React-based frontend application that consumes the Django backend APIs for user authentication, profile management, and activity chart visualization.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Profile Management**: View and edit user profile information
- **Activity Charts**: Display activity data with visual charts
- **Responsive Design**: Modern UI with Tailwind CSS
- **Session Storage**: JWT tokens stored in sessionStorage for security

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **JWT** for authentication

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Backend Django server running on `http://localhost:8000`

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create environment file:

   ```bash
   echo "VITE_API_BASE=http://localhost:8000/api" > .env
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── api.ts                 # API utility with axios configuration
├── contexts/
│   └── AuthContext.tsx    # Authentication context provider
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── components/
│   ├── LoginForm.tsx      # Login form component
│   ├── RegisterForm.tsx   # Registration form component
│   ├── Profile.tsx        # Profile management component
│   ├── ActivityChart.tsx  # Activity chart component
│   └── Navigation.tsx     # Navigation component
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## API Endpoints

The frontend consumes the following backend endpoints:

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/profile/` - Get user profile
- `POST /api/profile-update/` - Update user profile
- `GET /api/activity-chart/` - Get activity chart data
- `POST /api/token/refresh/` - Refresh JWT token

## Authentication Flow

1. User registers/logs in
2. JWT tokens (access + refresh) are stored in sessionStorage
3. Axios interceptors automatically add Authorization headers
4. Token refresh happens automatically on 401 responses
5. User is redirected to login on authentication failure

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Environment Variables

- `VITE_API_BASE` - Backend API base URL (default: `http://localhost:8000/api`)

## Development

The application uses a simple client-side router based on `window.location.pathname`. For production, consider using React Router for better navigation handling.

## Security Notes

- JWT tokens are stored in sessionStorage (cleared when browser tab closes)
- Automatic token refresh on 401 responses
- Automatic logout and redirect on refresh failure
