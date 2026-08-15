export type ItemCategory = 
  | 'Rhyme / Song'
  | 'Riddle'
  | 'Proverb / Adage';

export type RhymeLanguage = 
  | 'English'
  | 'Yoruba'
  | 'Hausa'
  | 'Igbo'
  | 'Pidgin'
  | 'Efik / Ibibio'
  | 'Edo'
  | 'Other';

export type RhymeCategory = 
  | 'Assembly / march-in chant'
  | 'Nursery rhyme'
  | 'Playground song'
  | 'Folk tale / Lullaby'
  | 'Game / Counting chant'
  | 'Word riddle / Puzzle'
  | 'Picture / Gesture riddle'
  | 'Tricky question'
  | 'Moral / Wisdom proverb'
  | 'Warning / Caution adage'
  | 'Philosophical saying'
  | 'Humorous / Satirical proverb'
  | 'Other';

export type RhymeEra = 
  | 'Before 1990'
  | '1990s'
  | '2000s'
  | '2010s+';

export type LearnedWhere = 
  | 'School assembly'
  | 'Playground'
  | 'Home / Grandparents'
  | 'Church or Sunday school'
  | 'Moonlight tales'
  | 'Other';

export type SchoolType = 
  | 'Public / Government Primary'
  | 'Private / International'
  | 'Mission / Convent / Islamic'
  | 'Boarding School'
  | 'Community / Village School'
  | 'Other';

export interface EditorInfo {
  editorName: string;
  editReason?: string;
  editedAt?: any;
}

export interface RhymeEntry {
  id: string;
  category: ItemCategory;
  name?: string;
  language: RhymeLanguage;
  type: RhymeCategory;
  text?: string;
  riddleAnswer?: string;
  proverbMeaning?: string;
  learnedWhere: LearnedWhere;
  locationGrewUp?: string;
  schoolType?: SchoolType;
  era: RhymeEra;
  region?: string;
  hasMorals: 'Yes' | 'No';
  moralsStrength: number;
  moralDescription?: string;
  goingExtinct: 'Yes' | 'No';
  extinctStrength: number;
  extinctReason?: string;
  audioURL?: string | null;
  audioURLs?: string[];
  createdAt?: any;
  likesCount?: number;
  editors?: EditorInfo[];
}

export interface RhymeEditRequest {
  id: string;
  rhymeId: string;
  rhymeType: string;
  originalText?: string;
  originalAudioURL?: string | null;
  editorName: string;
  proposedText: string;
  proposedAudioURL?: string | null;
  proposedAudioURLs?: string[];
  editReason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface RhymeSubmissionForm {
  category: ItemCategory;
  name: string;
  language: RhymeLanguage;
  type: RhymeCategory;
  text: string;
  riddleAnswer: string;
  proverbMeaning: string;
  learnedWhere: LearnedWhere;
  locationGrewUp: string;
  schoolType: SchoolType | '';
  era: RhymeEra;
  region: string;
  hasMorals: 'Yes' | 'No' | '';
  moralsStrength: number;
  moralDescription: string;
  goingExtinct: 'Yes' | 'No' | '';
  extinctStrength: number;
  extinctReason: string;
}

export type SortOption = 'newest' | 'oldest' | 'moral' | 'extinct';
