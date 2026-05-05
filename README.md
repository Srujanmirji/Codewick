<div align="center">

# 🔄 SkillSwap

### *A Peer-to-Peer Skill Exchange Marketplace with Trust Bootstrapping*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v4-purple?style=for-the-badge)](https://next-auth.js.org/)

> **Hackathon Project — Problem Statement FS-14**
> Build a decentralized skill-exchange marketplace where users trade skills using a time-credit currency, with a trust bootstrapping system for new users.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

---

</div>

## ✨ Overview

**SkillSwap** is a platform where you can trade what you know for what you want to learn — without money. A **React developer** teaches for 2 hours, earns 2 time-credits, and spends them learning **UI Design** from someone else. No cash. No gatekeeping. Pure knowledge exchange.

The hardest part? **New users have no reputation.** SkillSwap solves this with a trust bootstrapping system that gives every new user a starting trust score and gradually builds it through verified sessions, ratings, and community behavior.

---

## 🎯 Key Features

| Feature | Status |
|---------|--------|
| 🔐 Google OAuth & Credential Login | ✅ Complete |
| 🧭 Multi-step Onboarding Flow | ✅ Complete |
| 👤 Profile with DB-backed Skills & Bio | ✅ Complete |
| 💰 Time-Credit Ledger & Wallet | 🚧 In Progress |
| 🔍 Skill Matching Marketplace | 🚧 In Progress |
| ⭐ Session Tracking & Ratings | 🚧 In Progress |
| ⚖️ AI-powered Dispute Resolution | 🚧 In Progress |
| 🛡️ Anti-Exploitation & Reputation Decay | 🚧 In Progress |

---

## 🖼️ Screenshots

<div align="center">

| Login | Onboarding | Dashboard |
|-------|-----------|-----------|
| Glassmorphism login with Google OAuth | 6-step wizard collecting skills & bio | Live profile with DB data |

</div>

---

## 🏗️ Architecture

```
SkillSwap/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # Credential + Google OAuth login
│   │   │   └── signup/         # New user registration
│   │   ├── onboarding/         # 6-step onboarding wizard
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── profile/        # User profile (DB-backed)
│   │   │   ├── marketplace/    # Skill listings & matching
│   │   │   ├── wallet/         # Time-credit ledger
│   │   │   ├── sessions/       # Session tracking
│   │   │   ├── disputes/       # Dispute resolution
│   │   │   └── messages/       # User messaging
│   │   └── api/
│   │       ├── auth/           # NextAuth.js handlers
│   │       ├── onboarding/     # Save onboarding data
│   │       └── user/profile/   # Profile CRUD
│   ├── models/
│   │   └── User.ts             # Mongoose user schema
│   ├── lib/
│   │   └── mongodb.ts          # DB connection singleton
│   └── components/
│       └── onboarding/
│           └── TagInput.tsx    # Reusable tag input
```

---

## 🔑 Core Concepts

### ⏱️ Time-Credit Currency
Every hour of teaching = 1 time-credit. Credits are earned by providing sessions and spent by requesting them. New users start with **2 free credits** to make their first swap.

### 🧱 Trust Bootstrapping
New users have zero history — so how do you trust them? SkillSwap:
- Gives every new user a **trust score of 50/100** on signup
- Grows trust through completed sessions and positive ratings
- Decays trust for inactivity or unresolved disputes

### 🛡️ Anti-Exploitation Layer
- **Reciprocal farming detection** — blocks the same two users from repeatedly trading with each other to artificially inflate ratings
- **Credit farming prevention** — flags suspicious rapid session patterns

### ⚖️ AI Dispute Mediation
When a session goes wrong, users file a dispute with evidence. **Google Gemini** reads both sides and auto-generates a binding verdict — including credit refunds and trust score adjustments.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials
- (Optional) Gemini API key for AI dispute resolution

### Installation

```bash
# Clone the repository
git clone https://github.com/Srujanmirji/Codewick.git
cd Codewick

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skillswap

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini AI (for dispute resolution)
GEMINI_API_KEY=your-gemini-api-key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | NextAuth.js v4 (Google + Credentials) |
| **Styling** | Vanilla CSS (Glassmorphism / Liquid Glass) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **AI** | Google Gemini API |
| **State** | Zustand |

---

## 🗺️ Roadmap

- [x] Authentication (Google OAuth + Credentials)
- [x] Multi-step onboarding flow
- [x] User profile with real DB data
- [x] Google profile image sync
- [ ] Time-credit wallet & ledger
- [ ] Skill matching marketplace
- [ ] Session scheduling & tracking
- [ ] Rating & review system
- [ ] AI-powered dispute resolution
- [ ] Anti-exploitation fraud detection
- [ ] Reputation decay model
- [ ] Real-time messaging

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ for **Hackathon FS-14** — *Peer-to-Peer Skill Exchange Marketplace with Trust Bootstrapping*

</div>
