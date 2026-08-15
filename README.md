# Before We Forget... (Nigerian Oral Heritage Archive)

> **A public cultural preservation initiative dedicated to documenting, recording, and safeguarding traditional assembly march-in songs, nursery rhymes, riddles, proverbs, and street playground chants for future generations.**

---

## Overview

Across Nigeria and the diaspora, generations of children grew up chanting assembly march-in songs (*"Parents listen to your children..."*), solving moonlight riddles (*Àlọ́ Apagbe / Gwam Gwam Gwam*), reciting traditional proverbs (*Òwe / Ìlú / Magana*), and singing playground rhymes (*"Bata mi a dun koker..."*). As modern digital media replaces traditional storytelling, many of these oral treasures risk fading away.

**Before We Forget** is an open-access digital memory box designed to preserve these oral heritage items in text, audio voice recordings, dialect variations, moral lessons, and historical metadata.

---

##  Key Features

### 1.  3-Step Adaptive Submission Wizard
- **Category-Aware Form**: Adapts fields dynamically based on whether you are sharing a **Rhyme / Song**, a **Riddle**, or a **Proverb / Adage**.
- **Contextual Requirements**:
  - **Songs**: Mandatory voice recordings so authentic tunes and rhythms are captured.
  - **Riddles**: Mandatory answer field with hidden-by-default reveal toggle.
  - **Proverbs**: Optional usage meaning and cultural context.
- **Moral & Extinction Scoring**: Tag entries with moral strengths (1–5) and extinction risk levels so endangered chants can be spotlighted.

### 2.  Real-Time Duplicate & Similarity Detection
- Uses **Jaccard Index Text Normalization & Similarity Matching** to compare incoming submissions against stored archive entries in real-time.
- Displays side-by-side comparisons for exact or similar entries and invites contributors to either propose stanzas to existing entries or submit as new.

### 3.  Filterable Public Cultural Gallery
- **Multi-Category Tabs**: Filter by **Rhyme / Song**, **Riddle**, or **Proverb / Adage**.
- **Language & Region Filters**: Explore entries in Yoruba, Igbo, Hausa, Pidgin, Efik/Ibibio, Edo, Urhobo, Tiv, and English.
- **Audio-Only & Search Filter**: Instantly search by lyrics, answers, proverbs, contributor, or region.
- **Surprise Spotlight**: Random memory spotlight to discover hidden cultural gems.

### 4. Interactive Riddle Reveal Box
- Riddle answers are hidden by default in the gallery and revealed smoothly when the user taps *"Tap to Reveal Answer"*.

### 5.  Admin Moderation Queue & Proposed Edits
- Community members can propose stanza additions or corrections to existing archive items.
- Dedicated **Admin Queue (`/admin`)** allowing moderators to review, approve, or reject proposed edits.

### 6.  Real-Time Likes & Clipboard Copying
- **Persisted Likes**: Like counters save directly to Firestore online in real-time.
- **Universal Copy & Share**: Copy full lyrics, riddle answers, or proverb meanings with safe fallback clipboard support.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) (Chalkboard Dark & Exercise Notebook themes) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) |
| **Database & Storage** | [Firebase Firestore](https://firebase.google.com/products/firestore) & [Firebase Storage](https://firebase.google.com/products/storage) |
| **Audio Processing** | Web MediaRecorder API (`audio/webm`) |

---

##  Repository Structure

```text
├── app/
│   ├── admin/               # Admin Moderation Queue page
│   ├── gallery/             # Public Cultural Gallery page
│   ├── globals.css          # Core design system & chalkboard styling
│   ├── layout.tsx           # Root layout wrapper with theme & navbar
│   └── page.tsx             # Main submission wizard orchestrator
├── components/
│   ├── submit/              # Modular submit wizard steps (<= 150 lines per file)
│   │   ├── CategoryStep.tsx # Step 1: Category, language & region selection
│   │   ├── ContentStep.tsx  # Step 2: Content fields, riddles, proverbs & audio recorder
│   │   └── ReflectionsStep.tsx # Step 3: Moral & extinction reflections
│   ├── ui/                  # Reusable atomic UI components (Badge, Button, Card, Input, etc.)
│   ├── Footer.tsx           # Footer component
│   ├── Navbar.tsx           # Header navigation & theme switcher
│   ├── ProposeEditModal.tsx # Propose edit overlay modal
│   ├── RhymeCard.tsx        # Memory card component
│   ├── SimilarityCheckModal.tsx # Duplicate comparison modal
│   └── VoiceRecorder.tsx    # Audio voice recorder component
├── lib/
│   ├── firebase.ts          # Firebase SDK initialization & fallback mock data
│   ├── similarity.ts        # Jaccard text similarity & deduplication engine
│   └── validations/         # Zod schemas for submission validation
├── scripts/
│   ├── cleanDatabaseFields.ts # Firestore database field sanitizer
│   ├── purgeDuplicates.ts   # Fuzzy duplicate cleaner script
│   └── removeDuplicates.ts  # Database deduplicator utility
└── types/
    └── rhyme.ts             # TypeScript interfaces and data models
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or yarn

### 2. Installation
```bash
# Clone repository
git clone https://github.com/Ehm-Ehs/archive.git
cd archive

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules
In your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rhymes/{docId} {
      allow read, create, update, delete: if true;
    }
    match /edit_requests/{docId} {
      allow read, create, update, delete: if true;
    }
  }
}
```

### 5. Running the Application
```bash
# Development mode
npm run dev

# Type checking
npx tsc --noEmit

# Production build
npm run build
```

Open `http://localhost:3000` to view the archive in your browser.

---

##  License

This project is open source and dedicated to the public domain under the **MIT License**. Cultural heritage contents preserved within this repository belong to the collective oral history of the Nigerian people.
