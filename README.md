# Journey: Gamified Volunteering Platform

## 🌟 Project Overview

Journey is an innovative web application designed to revolutionize volunteer engagement by gamifying the volunteering experience. The platform connects volunteers with meaningful opportunities, tracks their contributions, and rewards their efforts through a badge and achievement system.

## 🚀 Key Features

### User Roles
- **Volunteer**: Explore opportunities, register, earn badges
- **Agency**: Create and manage opportunities
- **Admin**: Manage users, opportunities, and badges

### Core Functionalities
- User Authentication & Authorization
- Opportunity Discovery & Registration
- Personalized Opportunity Recommendations (AI-powered)
- Badge & Achievement System
- User Profile Management
- Responsive Design

## 🛠 Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- NextUI

### Backend
- Firebase Authentication
- Firestore Database
- Firebase Storage

### Additional Technologies
- OpenAI (for recommendations)
- Formik (form management)
- Yup (form validation)
- Framer Motion (animations)

## 🔧 Prerequisites

- Node.js (v18+)
- npm or bun
- Firebase Project
- OpenAI API Key (optional)

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/journey.git
cd journey
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Set up environment variables
   Create a .env.local file with:

```ini
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Optional: OpenAI API Key for Recommendations
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server
```bash
npm run dev
# or
bun dev
```
## 🧪 Testing
Run Tests
```bash
npm test
# or
bun test
```

## 📂 Project Structure
```
journey/
├── public/             # Static assets
├── src/
│   ├── app/
│   │   ├── components/ # Reusable React components
│   │   ├── containers/ # Page-specific components
│   │   ├── context/    # React context
│   │   ├── firebase/   # Firebase configuration
│   │   ├── hooks/      # Custom React hooks
│   │   ├── models/     # TypeScript interfaces and types
│   │   └── utils/      # Utility functions
│   └── styles/         # Global styles
├── tests/              # Test files
└── configuration files
```

## 🔒 Security
- All user data is securely stored using Firebase Authentication
- Passwords are hashed and salted
- Role-based access control implemented
- HTTPS enforced
- 
## 📊 Performance
- Optimized server-side rendering
- Lazy loading of components
- Efficient database queries
- Minimal bundle size
