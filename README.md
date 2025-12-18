# 🎓 Tharaka University Staff Profile Website

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A modern, comprehensive staff profile management system for Tharaka University that enables staff registration, profile management, and public directory display with full SEO optimization and administrative controls.

## 🌟 Live Demo

- **Public Directory**: [View Staff Profiles](http://localhost:3000)
- **Staff Portal**: [Staff Login](http://localhost:3000/auth/signin)
- **Admin Dashboard**: [Admin Panel](http://localhost:3000/admin)

## 📸 Screenshots

### Public Staff Directory
![Staff Directory](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Staff+Directory+Screenshot)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Admin+Dashboard+Screenshot)

### Staff Profile Page
![Profile Page](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Profile+Page+Screenshot)

## ✨ Features

### 👥 For Staff Members
- 🔐 **Google OAuth Registration** - Seamless registration using institutional Google accounts
- 🎯 **Guided Onboarding** - Step-by-step profile creation wizard
- 📝 **Profile Management** - Comprehensive profile editing with real-time updates
- 📷 **Photo Upload** - Profile picture management with preview
- 🔗 **Professional Links** - LinkedIn, Google Scholar, ORCID, ResearchGate integration
- 👁️ **Privacy Controls** - Toggle profile visibility (public/private)
- 📱 **Responsive Interface** - Mobile-friendly dashboard

### 🛠️ For Administrators
- 📊 **Admin Dashboard** - Comprehensive staff management interface
- 📈 **Analytics Dashboard** - Detailed statistics and insights
- 📤 **Bulk Operations** - CSV import/export with validation
- 🔍 **Advanced Search** - Filter by faculty, department, position
- ✏️ **Profile Moderation** - Edit any staff profile
- 👀 **Visibility Management** - Control profile publication status

### 🌐 Public Features
- 🏛️ **Staff Directory** - Beautifully organized public profiles
- 🔍 **Smart Search** - Real-time filtering and search
- 🏫 **Faculty Organization** - Browse by faculty and department
- 📱 **SEO Optimized** - Rich meta tags and structured data
- 🔗 **Social Integration** - Direct links to professional profiles

### 🚀 Technical Features
- ⚡ **Next.js 14** - Latest React framework with App Router
- 🎨 **Tailwind CSS** - Modern, responsive design system
- 🔒 **NextAuth.js** - Secure authentication with Google OAuth
- 🗃️ **Prisma ORM** - Type-safe database operations
- ✅ **Form Validation** - Zod schema validation with React Hook Form
- 📱 **Responsive Design** - Mobile-first approach
- 🔔 **Toast Notifications** - User-friendly feedback system
- 🎯 **TypeScript** - Full type safety throughout the application

## 🏛️ University Structure

### 📚 Faculties
- 🏥 **Faculty of Health Sciences**
- 🌱 **Faculty of Life Sciences and Natural Resources**
- 💼 **Faculty of Business Studies**
- 🎓 **Faculty of Education**
- 📖 **Faculty of Humanities and Social Sciences**
- 🔬 **Faculty of Physical Sciences, Engineering and Technology**
- ⚖️ **Faculty of Law**

### 🏢 Departments
- 🌾 **Department of Dry Land Agriculture and Natural Resources**
- 💼 **Department of Business Administration**
- 🎓 **Department of Education**
- 📚 **Department of Humanities**
- 👥 **Department of Social Science**
- 🧪 **Department of Basic Sciences**
- 💻 **Department of Computer Science & ICT**
- 🏥 **Department of Health Sciences**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account (for OAuth)

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/tharaka-university-staff-profiles.git
cd tharaka-university-staff-profiles
npm install
```

### 2️⃣ Environment Setup
Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Configuration
ADMIN_EMAIL="admin@tharakauniversity.ac.ke"
```

### 3️⃣ Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create and sync database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4️⃣ Start Development Server
```bash
npm run dev
```

### 5️⃣ Access the Application
- 🏠 **Homepage**: http://localhost:3000
- 👤 **Staff Login**: http://localhost:3000/auth/signin
- 🛠️ **Admin Panel**: http://localhost:3000/admin

## 🔐 Google OAuth Setup

### Step-by-Step Configuration

1. **Create Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API

2. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External" user type
   - Fill in application details:
     - App name: "Tharaka University Staff Profiles"
     - User support email: Your email
     - Developer contact: Your email

3. **Create OAuth 2.0 Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Tharaka University Staff Profiles"
   
4. **Add Authorized Redirect URIs**
   ```
   Development: http://localhost:3000/api/auth/callback/google
   Production:  https://yourdomain.com/api/auth/callback/google
   ```

5. **Update Environment Variables**
   - Copy Client ID and Client Secret to your `.env.local`
   - Ensure NEXTAUTH_URL matches your domain

## 👨‍💼 Admin Configuration

### Automatic Admin Assignment
The first user signing in with the email specified in `ADMIN_EMAIL` environment variable will automatically receive admin privileges.

### 🛠️ Admin Capabilities
| Feature | URL | Description |
|---------|-----|-------------|
| 📊 **Dashboard** | `/admin` | Manage all staff profiles with search/filter |
| 📈 **Analytics** | `/admin/stats` | View detailed statistics and distributions |
| 📤 **Bulk Upload** | `/admin/bulk-upload` | Import multiple profiles via CSV |
| 📥 **Export Data** | `/admin` | Download all staff data as CSV |
| ✏️ **Profile Editor** | `/admin/edit/[id]` | Edit any staff member's profile |
| 👁️ **Visibility Control** | `/admin` | Show/hide profiles from public directory |

### 👤 Staff Capabilities
| Feature | URL | Description |
|---------|-----|-------------|
| 🎯 **Onboarding** | `/onboarding` | Complete profile creation wizard |
| ✏️ **Profile Editor** | `/dashboard/edit` | Update personal information and photos |
| 🔒 **Privacy Settings** | `/dashboard` | Toggle profile visibility |
| 🔗 **Social Links** | `/dashboard/edit` | Add professional social media profiles |

## 🚀 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tharaka-university-staff-profiles)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables for Production**
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="your-production-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ADMIN_EMAIL="admin@tharakauniversity.ac.ke"
   ```

### Alternative Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **Railway**: Connect GitHub repo and add environment variables
- **DigitalOcean**: Use App Platform with GitHub integration

### Database Migration for Production
```bash
# For PostgreSQL production database
npx prisma migrate deploy
npx prisma generate
```

## 🗃️ Database Schema

### Core Models
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  role          String    @default("STAFF")
  accounts      Account[]
  sessions      Session[]
  profile       Profile?
}

model Profile {
  id                String   @id @default(cuid())
  userId            String   @unique
  firstName         String
  lastName          String
  title             String?
  position          String
  department        String
  faculty           String
  email             String
  phone             String?
  biography         String?
  qualifications    String?
  researchInterests String?
  linkedinUrl       String?
  googleScholarUrl  String?
  orcidUrl          String?
  researchgateUrl   String?
  websiteUrl        String?
  profileImage      String?
  isPublic          Boolean  @default(true)
  slug              String   @unique
  user              User     @relation(fields: [userId], references: [id])
}
```

### Supported Databases
- **Development**: SQLite (default)
- **Production**: PostgreSQL (recommended)
- **Alternative**: MySQL, SQL Server

## 🔌 API Reference

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/staff` | Get all public staff profiles | ❌ |
| `GET` | `/api/staff/[slug]` | Get specific staff profile | ❌ |

### Staff Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/profile` | Create new profile | ✅ Staff |
| `PUT` | `/api/profile` | Update own profile | ✅ Staff |
| `GET` | `/api/profile/me` | Get own profile | ✅ Staff |

### Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/profiles` | Get all profiles | ✅ Admin |
| `GET` | `/api/admin/profiles/[id]` | Get specific profile | ✅ Admin |
| `PUT` | `/api/admin/profiles/[id]` | Update any profile | ✅ Admin |
| `POST` | `/api/admin/bulk-upload` | Bulk upload via CSV | ✅ Admin |
| `GET` | `/api/admin/export` | Export all data as CSV | ✅ Admin |
| `GET` | `/api/admin/stats` | Get analytics data | ✅ Admin |

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js handlers |
| `GET` | `/api/auth/signin` | Sign in page |
| `GET` | `/api/auth/signout` | Sign out |

## 🛠️ Development

### Project Structure
```
tharaka-university-staff-profiles/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Staff dashboard
│   ├── faculty/           # Faculty pages
│   ├── onboarding/        # Profile creation wizard
│   └── staff/             # Public profile pages
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI
- **Icons**: Heroicons

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add proper error handling
- Include JSDoc comments for functions
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/tharaka-university-staff-profiles/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tharaka-university-staff-profiles/discussions)
- **Email**: support@tharakauniversity.ac.ke

## 🙏 Acknowledgments

- [Tharaka University](https://tharakauniversity.ac.ke) for the project requirements
- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Prisma](https://www.prisma.io/) for the excellent ORM

---

<div align="center">
  <p>Built with ❤️ for Tharaka University</p>
  <p>
    <a href="#-tharaka-university-staff-profile-website">Back to Top</a>
  </p>
</div>