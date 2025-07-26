# Open Workouts - Web App

Open source workout tracking web app focused on simplicity and progress visualization.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript
- **UI**: React 19 + shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4 (Dark mode default)
- **Authentication**: Supabase Auth with server-side integration
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner toasts
- **Package Manager**: pnpm

## 🎯 Features

### ✅ Implemented
- **Authentication System**
  - User registration with email verification
  - Email/password login
  - Session management with automatic refresh
  - Route protection via Next.js middleware
  - Sign out with redirect to home
- **Modern UI/UX**
  - Dark mode by default
  - Responsive design for mobile/desktop
  - Clean, intuitive interface
  - Loading states and error handling
- **Developer Experience**
  - TypeScript throughout
  - Comprehensive form validation
  - Philosophy of Software Design principles
  - Extensive code documentation

### 🔄 Coming Soon
- Password reset functionality
- Workout tracking and logging
- Progress visualization
- Custom workout plans
- Social features

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+ (Node 18 reached EOL April 2025)
- pnpm package manager
- Supabase account and project

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd open-workout/apps/web-app
pnpm install
```

2. **Environment setup**:
```bash
# Copy environment template
cp .env.local.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run development server**:
```bash
pnpm dev
```

4. **Open your browser**: [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🏗️ Project Structure

```
apps/web-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Protected dashboard
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/            # React components
│   │   ├── auth/             # Authentication forms
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   │   └── use-auth.tsx      # Authentication state management
│   ├── lib/                  # Utility libraries
│   │   └── auth/             # Authentication services
│   ├── types/                # TypeScript type definitions
│   └── middleware.ts         # Next.js middleware for route protection
├── public/                   # Static assets
└── docs/                     # Project documentation
```

## 🔐 Authentication Architecture

The authentication system follows interface-based design principles:

- **Client/Server Separation**: Separate Supabase clients for browser and server contexts
- **Session Management**: Automatic token refresh and validation
- **Route Protection**: Server-side middleware guards protected routes
- **Error Handling**: Comprehensive error mapping and user feedback
- **Type Safety**: Full TypeScript integration with generated types

## 🎨 UI Components

Built with shadcn/ui components following the New York style:

- **Form Components**: Input, Button, Card, Label with validation
- **Feedback**: Sonner toasts for notifications
- **Loading States**: Spinners and skeleton loaders
- **Dark Theme**: Default dark mode with proper contrast
- **Responsive**: Mobile-first design approach

## 📚 Development Guidelines

This project follows the **Philosophy of Software Design** principles:

- **Deep Modules**: Simple interfaces hiding complex implementations
- **Information Hiding**: Proper encapsulation and abstraction
- **Strategic Programming**: Long-term maintainability over shortcuts
- **Comprehensive Documentation**: Interface comments and design decisions
- **Error Prevention**: Type safety and validation to prevent runtime errors

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Configure authentication settings
3. Set up email templates
4. Add your domain to allowed redirect URLs

### Development Tools
- **ESLint**: Next.js configuration with TypeScript support
- **TypeScript**: Strict mode with comprehensive type checking
- **Tailwind CSS**: v4 with dark mode and custom design system

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php)

## 🤝 Contributing

Contributions are welcome! Please ensure your code follows the established patterns and includes appropriate documentation.

## 📄 License

MIT License - see LICENSE file for details.
