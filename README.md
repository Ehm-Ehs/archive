# Nigerian Rhymes Archive 🎶

A public web application for preserving traditional Nigerian assembly march-in songs, nursery rhymes, and playground chants — as text or voice notes — with a public gallery to browse and listen to them.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **React Hook Form**, **Zod**, and **Firestore**.

---

## 🚀 100% Free Setup Guide (No Credit Card Required)

This project is configured to run completely free without upgrading any cloud services to paid tiers.

### Part 1: Firestore Database (Metadata & Text)

1. **Create a Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com) → Click **Add project**.
   - Name your project (e.g. `nigerian-rhymes`) and disable Analytics.

2. **Register a Web App**
   - Click the **Web (`</>`)** icon to register a web app.
   - Copy the config values provided.

3. **Enable Firestore Database**
   - Navigate to **Build** → **Firestore Database** → Click **Create Database**.
   - Choose **Start in production mode** and pick your region.
   - Go to the **Rules** tab and paste:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /rhymes/{docId} {
           allow read, create: if true;
           allow update, delete: if false;
         }
       }
     }
     ```
   - Click **Publish**.

4. **Set Up `.env.local`**
   - Copy `.env.local.example` to `.env.local` and paste your Firebase keys:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456...
     NEXT_PUBLIC_FIREBASE_APP_ID=1:123456...
     ```

---

### Part 2: Google Drive Audio Storage via Google Apps Script

To avoid Firebase Storage paid billing prompts, voice notes are uploaded directly to a folder in your personal **Google Drive** using a lightweight Google Apps Script.

1. **Open Google Apps Script**
   - Visit [script.google.com](https://script.google.com) → Click **New Project**.
   - Open [`apps-script/Code.gs`](file:///Users/thriveagric/Desktop/untitled%20folder/rhymes/apps-script/Code.gs) in this repo, copy its entire contents, and replace any default code in `Code.gs`.

2. **Deploy as a Web App**
   - Click **Deploy** (top right) → **New deployment**.
   - Select type: **Web app** ⚙️.
   - Set configuration:
     - **Execute as**: `Me` (your Google account)
     - **Who has access**: `Anyone`
   - Click **Deploy** and grant permissions when prompted.

3. **Add Web App URL to `.env.local`**
   - Copy the generated Web App URL (`https://script.google.com/macros/s/...`) and add it to `.env.local`:
     ```env
     NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your_deployment_id/exec
     ```

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Visit `http://localhost:3000` to test submitting rhymes and audio clips!

---

## 📁 Accessing Uploaded Audio Files Later

All uploaded voice notes automatically populate in a folder named **"Nigerian Rhymes Voice Notes"** inside your Google Drive account.

- You can open the folder directly in Google Drive to listen to, organize, or download raw `.webm` audio files anytime.
- Audio files are set to *"Anyone with the link can view"* so they can stream directly inside the public web gallery.
