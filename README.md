# Open Workouts

Open source workout tracking web app focused on simplicity and progress visualization.

## 🎯 Overview

Open Workouts is a modern, open-source fitness tracking application built with cutting-edge web technologies. Our mission is to provide a clean, intuitive platform for users to track their workout progress without the complexity and clutter found in traditional fitness apps.

### ✨ Key Principles
- **Simplicity First**: Clean, distraction-free interface
- **Progress Focused**: Meaningful visualizations of your fitness journey
- **Open Source**: Transparent development and community-driven features
- **Privacy Conscious**: Your data belongs to you

## 🏗️ Monorepo Structure

This project uses a monorepo structure managed with pnpm workspaces:

```
open-workout/
├── apps/
│   └── web-app/              # Next.js 15 web application
├── shared/                   # Shared packages and utilities (future)
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json             # Root package scripts
```

### 📁 Applications

- **`apps/web-app/`** - Main Next.js web application
  - Next.js 15 with App Router & Turbopack
  - React 19 + TypeScript + Tailwind CSS v4
  - Supabase authentication & database
  - shadcn/ui components (New York style)
  - Dark mode by default

### 📦 Shared Packages (Planned)

- **`shared/types/`** - Shared TypeScript definitions
- **`shared/utils/`** - Common utility functions
- **`shared/ui/`** - Reusable UI components
- **`shared/config/`** - Configuration presets

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** (Node 18 reached EOL April 2025)
- **pnpm** package manager
- **Supabase account** for authentication & database

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd open-workout
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment** (see apps/web-app/README.md for details):
```bash
cd apps/web-app
cp .env.local.example .env.local
# Add your Supabase credentials
```

4. **Start development**:
```bash
# From root directory
pnpm dev

# This will start all applications
```

### 📋 Available Scripts

```bash
# Development
pnpm dev          # Start all applications in development mode
pnpm build        # Build all applications for production

# Individual app commands
cd apps/web-app
pnpm dev          # Start only the web app
pnpm build        # Build only the web app
pnpm lint         # Run ESLint
```

## 🎯 Current Features

### ✅ Implemented (v0.1.0)
- **User Authentication**
  - Email/password registration with verification
  - Secure login with session management
  - Route protection and middleware
  - Sign out with proper redirect
- **Modern UI/UX**
  - Dark mode by default
  - Responsive design (mobile-first)
  - Loading states and error handling
  - Sonner toast notifications
- **Developer Experience**
  - TypeScript throughout
  - Philosophy of Software Design principles
  - Comprehensive documentation
  - Form validation with React Hook Form + Zod

### 🔄 Coming Soon (v0.2.0)
- Password reset functionality
- User profile management
- Basic workout logging
- Dashboard improvements

### 🎯 Roadmap (Future Versions)
- **Workout Management**
  - Custom workout creation
  - Exercise library
  - Set and rep tracking
- **Progress Visualization**
  - Charts and graphs
  - Progress photos
  - Personal records tracking
- **Social Features**
  - Workout sharing
  - Community challenges
  - Achievement system

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (New York style)
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner

### Backend & Database
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase subscriptions
- **Storage**: Supabase Storage (planned)

### Development Tools
- **Package Manager**: pnpm (workspace support)
- **Linting**: ESLint (Next.js config)
- **Type Checking**: TypeScript strict mode
- **Code Quality**: Philosophy of Software Design principles

## 📚 Documentation

- **[Web App README](./apps/web-app/README.md)** - Detailed setup and development guide
- **[Architecture Guide](./apps/web-app/docs/)** - System design and patterns
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant development guidelines

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Code Quality**: Follow the Philosophy of Software Design principles
2. **Documentation**: Include comprehensive comments and documentation
3. **Testing**: Write tests for new features (when testing is set up)
4. **Type Safety**: Maintain strict TypeScript usage
5. **Design**: Follow the established patterns and UI guidelines

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Submit a pull request with detailed description

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) and [React](https://react.dev)
- Authentication powered by [Supabase](https://supabase.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Design principles from [Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php)

---

**Open Workouts** - Making fitness tracking simple, transparent, and effective. 💪