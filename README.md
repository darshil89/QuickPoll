# QuickPoll Frontend

A modern, real-time opinion polling platform built with Next.js 16, React 19, and TypeScript. This frontend application provides an intuitive interface for creating, managing, and participating in polls with real-time updates.

## 🚀 Features

- **User Authentication**: Secure login with JWT token management
- **Poll Management**: Create, view, and manage polls
- **Real-time Updates**: Live poll results and interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Beautiful components built with Radix UI
- **Type Safety**: Full TypeScript support
- **State Management**: Context-based state management for authentication

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper
- **Notifications**: Sonner
- **File Upload**: React Dropzone

## 📁 Project Structure

```
poll_frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Protected routes group
│   │   │   ├── create_poll/          # Poll creation page
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── polls/                # Polls listing page
│   │   │   ├── profile/              # User profile page
│   │   │   └── layout.tsx            # Protected routes layout
│   │   ├── unauthorized/             # Unauthorized access page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Login page
│   ├── assets/                       # Static assets
│   │   └── logo.png                  # Application logo
│   ├── components/                   # Reusable components
│   │   ├── layout/                   # Layout components
│   │   │   ├── DashboardLayout.tsx   # Main dashboard layout
│   │   │   └── Sidebar.tsx           # Navigation sidebar
│   │   └── ui/                       # UI component library
│   │       ├── badge.tsx             # Badge component
│   │       ├── button.tsx            # Button component
│   │       ├── card.tsx              # Card component
│   │       ├── data-table.tsx        # Data table component
│   │       ├── dialog.tsx            # Modal dialog component
│   │       ├── input.tsx             # Input field component
│   │       ├── radio-group.tsx       # Radio button group
│   │       ├── select.tsx            # Select dropdown component
│   │       ├── table.tsx             # Table component
│   │       └── ...                   # Other UI components
│   ├── contexts/                     # React Context providers
│   │   ├── AuthContext.tsx           # Authentication context
│   │   └── backend.tsx               # API client and types
│   └── lib/
│       └── utils.ts                  # Utility functions
├── public/                           # Public static files
├── components.json                   # shadcn/ui configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend services running (Auth microservice on port 8000, Poll microservice on port 8001)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poll_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   The application expects the following backend services to be running:
   - Auth microservice: `http://localhost:8000`
   - Poll microservice: `http://localhost:8001`
   
   These URLs are configured in `src/contexts/backend.tsx`.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🏗️ Architecture Overview

### Authentication Flow

1. **Login**: Users authenticate via the login page (`/`)
2. **Token Management**: JWT tokens are stored in localStorage
3. **Protected Routes**: All routes under `(main)` require authentication
4. **Auto-redirect**: Unauthenticated users are redirected to login

### API Integration

The application communicates with two microservices:

- **Auth Service** (`localhost:8000`): Handles user authentication
- **Poll Service** (`localhost:8001`): Manages polls, votes, and interactions

### State Management

- **AuthContext**: Manages user authentication state globally
- **Local State**: Component-level state using React hooks
- **API State**: Managed through custom hooks and context

## 🎨 UI Components

The application uses a custom component library built on top of Radix UI primitives:

- **Form Components**: Input, Select, RadioGroup, Checkbox
- **Layout Components**: Card, Dialog, Separator
- **Data Display**: Table, Badge, Progress
- **Feedback**: Toast notifications via Sonner

## 🔧 Configuration

### Backend URLs

Update the API endpoints in `src/contexts/backend.tsx`:

```typescript
const AUTH_API_BASE_URL = 'http://localhost:8000';
const POLL_API_BASE_URL = 'http://localhost:8001';
```

### Styling

The application uses Tailwind CSS with custom configuration. Key files:
- `tailwind.config.js` - Tailwind configuration
- `src/app/globals.css` - Global styles and CSS variables

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Environment Variables

For production deployment, ensure the following environment variables are set:

- `NEXT_PUBLIC_AUTH_API_URL` - Auth service URL
- `NEXT_PUBLIC_POLL_API_URL` - Poll service URL

## 🧪 Development

### Code Structure Guidelines

- **Components**: Place reusable components in `src/components/`
- **Pages**: Use Next.js App Router structure in `src/app/`
- **Contexts**: Global state management in `src/contexts/`
- **Types**: Define TypeScript interfaces in `src/contexts/backend.tsx`

### Adding New Features

1. Create components in appropriate directories
2. Add API functions to `src/contexts/backend.tsx`
3. Update types as needed
4. Test with the development server

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure backend services are running
2. **CORS Issues**: Check backend CORS configuration
3. **Build Errors**: Verify all dependencies are installed
4. **Type Errors**: Run TypeScript compiler to check for type issues

### Debug Mode

Enable debug logging by checking browser console for detailed error messages and API responses.

## 📝 License

This project is part of the QuickPoll microservices architecture.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**QuickPoll Frontend** - Built with ❤️ using Next.js and TypeScript