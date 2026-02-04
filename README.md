# 🚀 CareerShip - AI-Powered Learning Roadmap Platform

<div align="center">

**Your personalized journey to career mastery**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev)

</div>

---

## ✨ Features

### 🎯 Personalized Learning Roadmaps
- **AI-Generated Paths**: Select your career role (Software Developer, Data Scientist, UX Designer, etc.) and skill level
- **Step-by-Step Progression**: Structured learning with clear milestones
- **Topic-Based Resources**: Each step includes curated YouTube videos and learning websites

### 🌍 Multi-Language Support
- **19 Languages**: English, Hindi, Spanish, French, German, Chinese, Japanese, Korean, Tamil, Telugu, and more
- **Language-Aware Content**: YouTube tutorials automatically fetched in your preferred language
- **Real-time Translation**: UI translates dynamically using Gemini AI

### 🎮 Gamification System
- **Points & Levels**: Earn XP for completing steps and quizzes
- **Badges Collection**: Unlock achievements as you progress
- **Daily Check-ins**: Build learning streaks for bonus rewards
- **Leaderboard Ready**: Track your progress against the community

### 🧠 AI-Powered Features
- **Smart Resource Curation**: Gemini AI generates optimized search queries for finding the best tutorials
- **Topic Quizzes**: AI-generated quizzes to test your knowledge
- **Personalized Recommendations**: Content tailored to your learning path

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern frosted-glass card effects
- **Animated Elements**: Floating gradient orbs, hover animations, smooth transitions
- **Responsive Layout**: Beautiful on desktop, tablet, and mobile
- **Premium Typography**: Outfit font family for modern aesthetics

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, Material-UI 7 |
| **Build Tool** | Vite 7 |
| **Authentication** | Firebase Auth |
| **Database** | Firestore |
| **AI Services** | Google Gemini 2.0 Flash |
| **Video API** | YouTube Data API v3 |
| **Styling** | Emotion, CSS-in-JS |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project
- Google Cloud API keys (Gemini & YouTube)

### Installation

```bash
# Clone the repository
git clone https://github.com/SreeManas/career_ship.git
cd career_ship

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
VITE_YOUTUBE_API_KEY=your_youtube_key
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Navigation with auth & language selector
│   ├── RoadmapCard.jsx  # Learning step cards with resources
│   ├── RoleSelector.jsx # Career path & skill level picker
│   ├── ChatBot.jsx      # AI assistant integration
│   └── ...
├── pages/               # Route pages
│   ├── Home.jsx         # Landing with role selection
│   ├── Roadmap.jsx      # Learning path display
│   ├── Dashboard.jsx    # User stats & badges
│   ├── Login.jsx        # Authentication
│   └── CommunityFeed.jsx# Social features
├── context/             # React contexts
│   ├── AuthContext.jsx  # Firebase auth state
│   ├── GamificationContext.jsx # Points, levels, badges
│   └── LanguageContext.jsx     # Multi-language support
├── services/            # API integrations
│   ├── learningResources.js # YouTube & Gemini integration
│   ├── roadmapData.js   # AI roadmap generation
│   ├── translate.js     # Translation service
│   └── gamification.js  # Points & rewards logic
└── theme/
    └── theme.js         # Material-UI theme config
```

---

## 🌟 Key Features Explained

### Language-Aware YouTube Videos
When you switch languages (e.g., to Hindi), the platform:
1. Uses Gemini AI to generate language-specific search queries
2. Calls YouTube API with `relevanceLanguage` parameter
3. Returns tutorials in your preferred language

### Gamification Flow
```
Complete Step → Earn XP → Level Up → Unlock Badge → Display Reward
```

### AI Roadmap Generation
1. User selects role + skill level
2. Gemini AI generates customized learning steps
3. Each step includes topics, duration, difficulty
4. Resources fetched dynamically when expanded

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for learners everywhere**

</div>
