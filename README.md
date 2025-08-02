# AstroAnon - AI-Powered Astrology Readings

A modern web application that generates personalized astrology readings using AI. Users can input their birth data and receive detailed, personalized astrological insights.

## 🌟 Features

- **Personalized Birth Chart Analysis**: Generate detailed astrological readings based on birth data
- **AI-Powered Insights**: Advanced AI generates unique, personalized content for each reading
- **Multiple Reading Types**: Core Self, Chart Ruler, Inner Warrior, and Self Belief readings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Session Management**: Secure session handling with data persistence
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules with custom design system
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date/Time**: Luxon
- **AI Integration**: OpenAI GPT-4 for reading generation
- **Astrology API**: Professional astrology chart calculation

## 📁 Project Structure

```
AstroAnon/
├── app/                          # Next.js app directory
│   ├── (main)/                   # Main application routes
│   │   ├── birth-form/          # Birth data collection
│   │   ├── intro/               # Landing page
│   │   ├── qualified-readings/  # Reading selection
│   │   └── results/             # Reading display
│   ├── api/                     # API routes
│   ├── components/              # Shared components
│   ├── lib/                     # Utilities and services
│   └── styles/                  # Global styles
├── public/                      # Static assets
├── docs/                        # Documentation
└── scripts/                     # Build and analysis scripts
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Astrology API
ASTROLOGY_API_USER_ID=your_astrology_api_user_id
ASTROLOGY_API_KEY=your_astrology_api_key

# TimeZoneDB API (optional)
TIMEZONEDB_API_KEY=your_timezonedb_api_key
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd AstroAnon
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (see above)

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size
- `npm run performance:check` - Run Lighthouse performance audit

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **API Key Security**: All API keys are stored in environment variables
- **Security Headers**: Comprehensive security headers including CSP, X-Frame-Options
- **Error Boundaries**: React error boundaries prevent app crashes
- **Rate Limiting**: Built-in rate limiting for API calls

## 🎨 Design System

The application uses a custom design system with:
- Consistent color palette and typography
- Responsive breakpoints for all devices
- Accessible components with proper ARIA labels
- Loading states and error handling
- Progressive enhancement

## 📱 Responsive Design

- **Desktop**: Full-featured experience with all interactions
- **Tablet**: Optimized layout for touch interactions
- **Mobile**: Streamlined interface with large touch targets

## 🚀 Performance

- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Non-critical components loaded on demand
- **Bundle Analysis**: Built-in bundle analysis tools
- **Performance Monitoring**: Core Web Vitals tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ using Next.js and AI** 