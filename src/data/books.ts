export type BookStatus = 'reading' | 'completed' | 'to_read' | 'on_hold';

export type Genre = 'Fiction' | 'History' | 'Poetry' | 'Science' | 'Arabic Lit' | 'Philosophy' | 'Art' | 'Sci-Fi' | 'Classics';

export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: number; // timestamp
  endTime: number;   // timestamp
  pagesRead: number;
}

export interface ActivityEntry {
  id: string;
  bookId: string;
  type: 'started' | 'finished' | 'progress' | 'added';
  timestamp: number;
  details?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: any;
  rating: number;
  language: string;
  pages: number;
  progress: number; // 0..1
  status: BookStatus;
  genre: Genre;
  currentPage: number;
  totalReadingTime: number; // in seconds
  sessions: ReadingSession[];
  dateAdded: number; // timestamp
}

// Cover image map for require() calls (can't be dynamic in RN)
export const coverImages: Record<string, any> = {
  alchemist: require('../../assets/book_cover_alchemist.png'),
  le_petit_prince: require('../../assets/book_cover_le_petit_prince.png'),
  dune: require('../../assets/book_cover_dune.png'),
  '1984': require('../../assets/book_cover_1984.png'),
  muqaddimah: require('../../assets/book_cover_muqaddimah.png'),
  season_of_migration: require('../../assets/book_cover_season_of_migration.png'),
};

export const initialBooks: Record<string, Book> = {
  '1': {
    id: '1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    coverImage: coverImages.alchemist,
    rating: 4.7,
    language: 'English',
    pages: 163,
    progress: 0.75,
    status: 'reading',
    genre: 'Fiction',
    currentPage: 122,
    totalReadingTime: 14400,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 30,
  },
  '2': {
    id: '2',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    coverImage: coverImages.le_petit_prince,
    rating: 4.8,
    language: 'French',
    pages: 96,
    progress: 0.30,
    status: 'reading',
    genre: 'Fiction',
    currentPage: 29,
    totalReadingTime: 5400,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 20,
  },
  '3': {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    coverImage: coverImages.dune,
    rating: 4.9,
    language: 'English',
    pages: 412,
    progress: 0.45,
    status: 'reading',
    genre: 'Sci-Fi',
    currentPage: 185,
    totalReadingTime: 28800,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 15,
  },
  '4': {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    coverImage: coverImages['1984'],
    rating: 4.6,
    language: 'English',
    pages: 328,
    progress: 1.0,
    status: 'completed',
    genre: 'Classics',
    currentPage: 328,
    totalReadingTime: 43200,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 60,
  },
  '5': {
    id: '5',
    title: 'Le Petit Prince (2nd read)',
    author: 'Antoine de Saint-Exupéry',
    coverImage: coverImages.le_petit_prince,
    rating: 4.8,
    language: 'French',
    pages: 96,
    progress: 1.0,
    status: 'completed',
    genre: 'Fiction',
    currentPage: 96,
    totalReadingTime: 7200,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 90,
  },
  '6': {
    id: '6',
    title: 'موسم الهجرة إلى الشمال',
    author: 'الطيب صالح (Tayeb Salih)',
    coverImage: coverImages.season_of_migration,
    rating: 4.8,
    language: 'Arabic',
    pages: 169,
    progress: 1.0,
    status: 'completed',
    genre: 'Arabic Lit',
    currentPage: 169,
    totalReadingTime: 18000,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 45,
  },
  '7': {
    id: '7',
    title: '1984 (reread)',
    author: 'George Orwell',
    coverImage: coverImages['1984'],
    rating: 4.6,
    language: 'English',
    pages: 328,
    progress: 0,
    status: 'to_read',
    genre: 'Classics',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 5,
  },
  '8': {
    id: '8',
    title: 'Dune Messiah',
    author: 'Frank Herbert',
    coverImage: coverImages.dune,
    rating: 4.3,
    language: 'English',
    pages: 272,
    progress: 0,
    status: 'to_read',
    genre: 'Sci-Fi',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 3,
  },
  '9': {
    id: '9',
    title: 'المقدمة',
    author: 'ابن خلدون',
    coverImage: coverImages.muqaddimah,
    rating: 4.9,
    language: 'Arabic',
    pages: 840,
    progress: 0,
    status: 'to_read',
    genre: 'History',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: Date.now() - 86400000 * 1,
  },
};

// Explore catalog — books that can be added to library
export const exploreCatalog: Book[] = [
  {
    id: 'explore_1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: coverImages.alchemist,
    rating: 4.2,
    language: 'English',
    pages: 304,
    progress: 0,
    status: 'to_read',
    genre: 'Fiction',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: 0,
  },
  {
    id: 'explore_2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    coverImage: coverImages.le_petit_prince,
    rating: 4.9,
    language: 'English',
    pages: 254,
    progress: 0,
    status: 'to_read',
    genre: 'Philosophy',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: 0,
  },
  {
    id: 'explore_3',
    title: 'المقدمة (Al-Muqaddimah)',
    author: 'ابن خلدون (Ibn Khaldun)',
    coverImage: coverImages.muqaddimah,
    rating: 4.9,
    language: 'Arabic',
    pages: 840,
    progress: 0,
    status: 'to_read',
    genre: 'History',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: 0,
  },
  {
    id: 'explore_4',
    title: 'Dune Messiah',
    author: 'Frank Herbert',
    coverImage: coverImages.dune,
    rating: 4.5,
    language: 'English',
    pages: 272,
    progress: 0,
    status: 'to_read',
    genre: 'Sci-Fi',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: 0,
  },
  {
    id: 'explore_5',
    title: 'Animal Farm',
    author: 'George Orwell',
    coverImage: coverImages['1984'],
    rating: 4.7,
    language: 'English',
    pages: 112,
    progress: 0,
    status: 'to_read',
    genre: 'Classics',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: 0,
  },
  {
    id: 'explore_6',
    title: 'موسم الهجرة إلى الشمال',
    author: 'الطيب صالح (Tayeb Salih)',
    coverImage: coverImages.season_of_migration,
    rating: 4.8,
    language: 'Arabic',
    pages: 169,
    progress: 0,
    status: 'to_read',
    genre: 'Arabic Lit',
    currentPage: 0,
    totalReadingTime: 0,
    sessions: [],
    dateAdded: 0,
  },
];
