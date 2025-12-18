# Contributing to Tharaka University Staff Profile Website

Thank you for your interest in contributing to the Tharaka University Staff Profile Website! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Google Cloud Console account (for OAuth testing)

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/tharaka-university-staff-profiles.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables (see README.md)
5. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed information about the bug
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide mockups or examples if possible

### Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add Google OAuth integration
fix(profile): resolve image upload issue
docs(readme): update installation instructions
```

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Ensure all tests pass
6. Submit a pull request

#### Code Style Guidelines
- Use TypeScript for all new code
- Follow the existing code style
- Use Tailwind CSS for styling
- Add JSDoc comments for functions
- Use meaningful variable and function names

#### Testing
- Test your changes thoroughly
- Ensure the application works in different browsers
- Test both desktop and mobile views
- Verify admin and staff functionalities

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Staff dashboard
│   ├── faculty/           # Faculty pages
│   ├── onboarding/        # Profile creation wizard
│   └── staff/             # Public profile pages
├── lib/                   # Utility functions
├── prisma/                # Database schema
├── types/                 # TypeScript definitions
└── public/                # Static assets
```

## 🔧 Development Guidelines

### Database Changes
- Always create migrations for schema changes
- Test migrations on a copy of production data
- Update the Prisma schema file
- Run `npx prisma generate` after schema changes

### API Development
- Follow RESTful conventions
- Add proper error handling
- Include input validation
- Document API endpoints

### UI/UX Guidelines
- Follow the existing design system
- Ensure responsive design
- Add loading states
- Include proper error messages
- Test accessibility features

### Security Considerations
- Validate all user inputs
- Use proper authentication checks
- Sanitize data before database operations
- Follow OWASP security guidelines

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

### Tools
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://tailwindcss.com/docs/editor-setup)

## 🤝 Community

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's code of conduct

### Getting Help
- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Join our community channels
- Contact maintainers for urgent issues

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Tharaka University Staff Profile Website! 🎓