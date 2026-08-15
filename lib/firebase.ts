// Firebase setup with TypeScript support & local fallback mode
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { RhymeEntry } from "@/types/rhyme";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "YOUR_PROJECT_ID"
);

let app: FirebaseApp | null = null;
let db: Firestore | any = null;
let storage: FirebaseStorage | any = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn(
    "⚠️ Firebase configuration missing in environment variables. Running in local fallback preview mode."
  );
}

export { db, storage, isFirebaseConfigured };

// Scraped & Curated Authentic Collection of Nigerian Rhymes, Riddles & Proverbs
export const MOCK_RHYMES: RhymeEntry[] = [
  // RHYMES & SONGS
  {
    id: "mock-1",
    category: "Rhyme / Song",
    name: "Amina B.",
    language: "English",
    type: "Assembly / march-in chant",
    text: "Parents listen to your children,\nWe are the leaders of tomorrow,\nTry and pay our school fees,\nAnd buy us books to read!\nWhen we grow up, we will remember,\nThe good things you have done for us!",
    learnedWhere: "School assembly",
    locationGrewUp: "Enugu & Lagos",
    schoolType: "Public / Government Primary",
    era: "1990s",
    region: "Enugu / Lagos",
    hasMorals: "Yes",
    moralsStrength: 5,
    moralDescription: "Teaches parental responsibility, importance of education, and filial gratitude.",
    goingExtinct: "Yes",
    extinctStrength: 4,
    extinctReason: "Modern schools use digital chimes instead of assembly marching chants.",
    audioURL: null,
    createdAt: new Date("2024-01-15"),
    likesCount: 38,
  },
  {
    id: "mock-2",
    category: "Rhyme / Song",
    name: "Tunde O.",
    language: "Yoruba",
    type: "Nursery rhyme",
    text: "Bata mi a dun koker,\nTi n ba lo si ile iwe,\nBata mi a dun koker,\nTi n ba lo si ile iwe!\nEwi eyin omo lanke,\nE wa wo bata aladun koker!",
    learnedWhere: "Home / Grandparents",
    locationGrewUp: "Ibadan, Oyo State",
    schoolType: "Public / Government Primary",
    era: "Before 1990",
    region: "Ibadan, Oyo State",
    hasMorals: "Yes",
    moralsStrength: 4,
    moralDescription: "Inspires joy in schooling, pride in neatness, and self-confidence.",
    goingExtinct: "Yes",
    extinctStrength: 5,
    extinctReason: "Younger kids are singing Cocomelon songs instead of traditional Yoruba nursery rhymes.",
    audioURL: null,
    createdAt: new Date("2024-02-10"),
    likesCount: 52,
  },
  // RIDDLES (Alo / Gwamaye / Nwanyi)
  {
    id: "mock-riddle-1",
    category: "Riddle",
    name: "Aunty Folake",
    language: "Yoruba",
    type: "Word riddle / Puzzle",
    text: "Alo o! Alo!\nKini kan n lo si ilu, ko fi oju si ile?\n(What goes to town without looking back at home?)",
    riddleAnswer: "Ejo (Snake)",
    learnedWhere: "Moonlight tales",
    locationGrewUp: "Oyo State",
    schoolType: "Community / Village School",
    era: "Before 1990",
    region: "Oyo State",
    hasMorals: "Yes",
    moralsStrength: 4,
    moralDescription: "Sharpening observational intelligence and nature awareness.",
    goingExtinct: "Yes",
    extinctStrength: 5,
    extinctReason: "Moonlight riddle games (Alo Apagbe) are almost vanished in modern cities.",
    audioURL: null,
    createdAt: new Date("2024-02-14"),
    likesCount: 47,
  },
  {
    id: "mock-riddle-2",
    category: "Riddle",
    name: "Chukwudi N.",
    language: "Igbo",
    type: "Word riddle / Puzzle",
    text: "Gwam gwam gwam!\nGwam ihe nwere ihu mana o nweghiro anya, nwere aka mana o nweghiro mkpisi aka?",
    riddleAnswer: "Ekwu / Elekere (Clock)",
    learnedWhere: "Home / Grandparents",
    locationGrewUp: "Enugu",
    schoolType: "Public / Government Primary",
    era: "1990s",
    region: "Enugu State",
    hasMorals: "Yes",
    moralsStrength: 3,
    moralDescription: "Teaches riddles as a traditional memory and reasoning puzzle.",
    goingExtinct: "Yes",
    extinctStrength: 4,
    extinctReason: "Igbo language riddles are rarely played among young pupils.",
    audioURL: null,
    createdAt: new Date("2024-02-22"),
    likesCount: 39,
  },
  // PROVERBS / ADAGES (Owe / Ilu / Magana)
  {
    id: "mock-proverb-1",
    category: "Proverb / Adage",
    name: "Elder Gbadamosi",
    language: "Yoruba",
    type: "Moral / Wisdom proverb",
    text: "Ile la ti n ko eso re ode.",
    proverbMeaning: "Good character and discipline begin at home before showing them off to the world.",
    learnedWhere: "Home / Grandparents",
    locationGrewUp: "Lagos / Abeokuta",
    schoolType: "Boarding School",
    era: "Before 1990",
    region: "Ogun / Lagos",
    hasMorals: "Yes",
    moralsStrength: 5,
    moralDescription: "Family upbringing forms the cornerstone of societal integrity.",
    goingExtinct: "Yes",
    extinctStrength: 3,
    extinctReason: "Proverbs are less used in daily youth conversations.",
    audioURL: null,
    createdAt: new Date("2024-03-02"),
    likesCount: 71,
  },
  {
    id: "mock-proverb-2",
    category: "Proverb / Adage",
    name: "Mazi Okonkwo",
    language: "Igbo",
    type: "Moral / Wisdom proverb",
    text: "Onye kulu chukwu aka, chukwu anaghi anya anya.",
    proverbMeaning: "Whoever trusts completely in God will never be abandoned or put to shame.",
    learnedWhere: "Church or Sunday school",
    locationGrewUp: "Asaba / Onitsha",
    schoolType: "Mission / Convent / Islamic",
    era: "1990s",
    region: "Anambra State",
    hasMorals: "Yes",
    moralsStrength: 5,
    moralDescription: "Faith, perseverance, and patience in divine providence.",
    goingExtinct: "Yes",
    extinctStrength: 4,
    extinctReason: "Proverbial Igbo expressions are often replaced with literal English.",
    audioURL: null,
    createdAt: new Date("2024-03-10"),
    likesCount: 58,
  }
];
