# finePrint

An AI-powered ingredient label scanner that helps users understand what's really in their food and cosmetics. Simply scan any product label and get instant, clear explanations of every ingredient.

## Features

- **Label Scanning** - Upload or capture images of ingredient labels for instant analysis
- **AI-Powered Analysis** - Uses Google Gemini to identify and explain each ingredient
- **Ingredient Breakdown** - Get detailed information including purpose, origin, and safety notes
- **User Dashboard** - Track your scan history and most common ingredients
- **Mobile-First Design** - Optimized for on-the-go scanning at stores

## Tech Stack

**Frontend**
- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Firebase Authentication (Google Sign-in)

**Backend**
- Spring Boot (Java)
- Google Gemini API for ingredient analysis
- Firebase Admin SDK for authentication
- Cloud Firestore for data persistence

**Deployment**
- Frontend: Vercel
- Backend: Render

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Authentication enabled

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Sharan986/finePrint.git
   cd finePrint/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment file
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables (see below)

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Backend API
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── history/         # Scan history
│   │   ├── profile/         # User profile
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ScanSection.tsx  # Main scanning component
│   │   ├── ResultsDisplay.tsx
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Firebase auth context
│   └── lib/                 # Utilities
│       ├── api.ts           # API client
│       ├── firebase.ts      # Firebase config
│       └── utils.ts
├── public/                  # Static assets
└── package.json
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/scan` | Analyze ingredient label image | No |
| GET | `/api/user/profile` | Get user profile | Yes |
| POST | `/api/user/profile` | Update user profile | Yes |
| DELETE | `/api/user/profile` | Delete user account | Yes |
| GET | `/api/user/scan-history` | Get scan history | Yes |
| GET | `/api/user/top-ingredients` | Get most scanned ingredients | Yes |
| GET | `/api/health` | Health check | No |

## Deployment

### Vercel (Frontend)

1. Import the repository on [Vercel](https://vercel.com)
2. Set the root directory to `frontend`
3. Add all environment variables from `.env.local`
4. Deploy

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Add your domains to authorized domains (localhost, your Vercel domain)

## License

MIT

## Author

Sharan - [@Sharan986](https://github.com/Sharan986)
