# Tharaka University Staff Profile Website

A comprehensive staff profile management system for Tharaka University that allows staff to register, manage their profiles, and display them publicly with full SEO optimization.

## Features

### For Staff Members
- **Google OAuth Registration**: Easy registration using Google accounts
- **Onboarding Wizard**: Guided profile creation process
- **Profile Management**: Update personal and professional information
- **Privacy Controls**: Toggle profile visibility (public/private)
- **SEO Optimized**: Individual profile pages with proper meta tags and structured data

### For Administrators
- **Admin Dashboard**: Comprehensive staff management interface
- **Bulk Operations**: Upload staff details via CSV
- **Profile Moderation**: Control profile visibility and edit staff information
- **Analytics**: View statistics on staff profiles and departments

### Technical Features
- **Responsive Design**: Works on all devices
- **Faculty/Department Organization**: Proper categorization of staff
- **Search & Filtering**: Find staff by name, department, or faculty
- **Database Management**: Prisma ORM with SQLite (easily switchable to PostgreSQL)
- **Authentication**: NextAuth.js with Google OAuth
- **Modern Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS

## Faculties & Departments

### Faculties
- Faculty of Health Sciences
- Faculty of Life Sciences and Natural Resources
- Faculty of Business Studies
- Faculty of Education
- Faculty of Humanities and Social Sciences
- Faculty of Physical Sciences, Engineering and Technology
- Faculty of Law

### Departments
- Department of Dry Land Agriculture and Natural Resources
- Department of Business Administration
- Department of Education
- Department of Humanities
- Department of Social Science
- Department of Basic Sciences
- Department of Computer Science & ICT
- Department of Health Sciences

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tharaka-university-staff-profiles
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.local` and update the following:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth (Get from Google Cloud Console)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Admin credentials
   ADMIN_EMAIL="admin@tharakauniversity.ac.ke"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main site: http://localhost:3000
   - Staff login: http://localhost:3000/auth/signin
   - Admin panel: http://localhost:3000/admin (after logging in as admin)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your `.env.local`

## Admin Setup

The first user with the email specified in `ADMIN_EMAIL` environment variable will automatically be granted admin privileges upon first login.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Update `DATABASE_URL` to use PostgreSQL for production
- Ensure all environment variables are set
- Run `npm run build` to build the application

## Database Schema

The application uses Prisma ORM with the following main models:
- **User**: Authentication and basic user info
- **Profile**: Detailed staff profile information
- **Account/Session**: NextAuth.js authentication tables

## API Endpoints

### Public APIs
- `GET /api/staff` - Get all public staff profiles
- `GET /api/staff/[slug]` - Get specific staff profile

### Authenticated APIs
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update own profile
- `GET /api/profile/me` - Get own profile

### Admin APIs
- `GET /api/admin/profiles` - Get all profiles (admin only)
- `PUT /api/admin/profiles/[id]` - Update any profile (admin only)
- `POST /api/admin/bulk-upload` - Bulk upload staff (admin only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.