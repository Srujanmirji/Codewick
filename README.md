<div align="center">

# 🔄 SkillSwap

### *A Premium Peer-to-Peer Skill Exchange Marketplace with Trust Bootstrapping*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v4-purple?style=for-the-badge)](https://next-auth.js.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge)](https://web.dev/progressive-web-apps/)

> **The Future of Learning — Hackathon Project FS-14**
> Build a decentralized skill-exchange marketplace where users trade skills using a time-credit currency, with a trust bootstrapping system for new users.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

---

</div>

## ✨ Overview

**SkillSwap** is a high-performance, mobile-first platform where you can trade what you know for what you want to learn — without money. Using a **Liquid Glass UI**, it provides a cinematic experience for peer-to-peer knowledge exchange. 

A **React developer** teaches for 2 hours, earns 2 time-credits, and spends them learning **UI Design** from someone else. No cash. No gatekeeping. Pure knowledge exchange.

The platform solves the "cold start" problem for new users through a **Trust Bootstrapping** system that provides every new member a starting reputation and grows it through verified interactions.

---

## 💎 Premium UI/UX: Aurora Glass

SkillSwap features a state-of-the-art **Aurora Glass** design system:
- **Dynamic Glows**: Animated background orbs that react to user focus.
- **Glassmorphism**: High-blur, translucent panels for a modern depth feel.
- **Micro-interactions**: Framer Motion powered transitions and spring-loaded UI elements.
- **PWA Optimized**: Native-app feel with "Install to Home Screen" support, standalone display mode, and mobile-first navigation.

---

## 🎯 Key Features

| Feature | Status |
|---------|--------|
| 🔐 Google OAuth & Secure Login | ✅ Complete |
| 🧭 7-Step Animated Onboarding | ✅ Complete |
| 👤 Intelligent User Profiles | ✅ Complete |
| 💰 Time-Credit Wallet & History | ✅ Complete |
| 🛒 Marketplace with Category Filtering | ✅ Complete |
| 🔍 Universal Global Search | ✅ Complete |
| 💬 Real-Time Messaging Hub | ✅ Complete |
| 🛡️ Admin "God Mode" Panel | ✅ Complete |
| 📱 PWA Support (Offline Ready) | ✅ Complete |
| ⚖️ AI Dispute Mediation | ✅ Complete |

---

## 🏗️ Architecture

```
SkillSwap/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Signup flows
│   │   ├── onboarding/         # Animated skill selection
│   │   ├── dashboard/          # The core experience
│   │   │   ├── marketplace/    # Discovery engine
│   │   │   ├── messages/       # Mobile-optimized chat
│   │   │   ├── admin/          # God Mode management
│   │   │   └── ...             # Profile, Wallet, etc.
│   │   └── api/                # Full-stack API routes
│   ├── components/             # Reusable UI components
│   ├── models/                 # Mongoose/MongoDB Schemas
│   ├── lib/                    # Shared utilities & DB config
│   └── store/                  # Zustand global state
```

---

## 🔑 Core Concepts

### ⏱️ Time-Credit Currency
Every hour of teaching = 1 time-credit. Credits are earned by providing sessions and spent by requesting them. New users start with **2 free credits** to make their first swap.

### 🧱 Trust Bootstrapping
New users have zero history — SkillSwap:
- Gives every new user a **trust score of 50/100** on signup.
- Grows trust through completed sessions and positive ratings.
- Features **Trust Levels**: Newbie → Verified → Trusted → Elite.

### 🛡️ God Mode (Admin)
Full-access panel for administrators to monitor sessions, handle disputes, manage users, and view platform-wide analytics. Access is granted via `isAdmin` flag or the `ADMIN_EMAIL` env variable.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials

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

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAIL=your-email@example.com
```

### Run
```bash
npm run dev
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth.js (Google + Credentials)
- **Styling**: Tailwind CSS + Vanilla CSS (Liquid Glass)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand

---

<div align="center">

Built with ❤️ for **Hackathon FS-14** — *The future of skill exchange.*

</div>
