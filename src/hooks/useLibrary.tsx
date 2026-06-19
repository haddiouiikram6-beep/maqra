import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookStatus, ReadingSession, ActivityEntry, initialBooks, Genre } from '../data/books';

const STORAGE_KEY = '@maqra_library';
const ACTIVITY_KEY = '@maqra_activity';
const SETTINGS_KEY = '@maqra_settings';

export interface LibraryStats {
  totalBooks: number;
  pagesRead: number;
  readingTimeHours: number;
  finishedBooks: number;
  yearlyGoal: number;
  yearlyCompleted: number;
  currentStreak: number;
}

export interface UserSettings {
  readingGoal: number;
  notificationsEnabled: boolean;
  language: string;
  theme: string;
}

interface ActiveSession {
  bookId: string;
  startTime: number;
  elapsed: number; // seconds
}

interface LibraryContextType {
  books: Record<string, Book>;
  activity: ActivityEntry[];
  settings: UserSettings;
  activeSession: ActiveSession | null;
  stats: LibraryStats;
  isLoaded: boolean;

  // Book actions
  updateBookProgress: (bookId: string, currentPage: number) => void;
  updateBookStatus: (bookId: string, status: BookStatus) => void;
  addBookToLibrary: (book: Book) => void;
  removeBook: (bookId: string) => void;
  isBookInLibrary: (bookId: string, title: string) => boolean;

  // Session actions
  startReadingSession: (bookId: string) => void;
  stopReadingSession: () => void;

  // Settings actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  clearAllData: () => void;

  // Filters
  getBooksByStatus: (status: BookStatus) => Book[];
  searchBooks: (query: string) => Book[];
  filterByStatusAndSearch: (status: BookStatus | 'all', query: string) => Book[];
}

const LibraryContext = createContext<LibraryContextType | null>(null);

const defaultSettings: UserSettings = {
  readingGoal: 12,
  notificationsEnabled: true,
  language: 'English',
  theme: 'Light',
};

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Record<string, Book>>(initialBooks);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadData = async () => {
    try {
      const [booksData, activityData, settingsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ACTIVITY_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
      ]);

      if (booksData) {
        const parsed = JSON.parse(booksData) as Record<string, Book>;
        // Re-attach cover images (can't serialize require())
        const withImages: Record<string, Book> = {};
        for (const [id, book] of Object.entries(parsed)) {
          const initialBook = initialBooks[id];
          withImages[id] = {
            ...book,
            coverImage: initialBook?.coverImage || book.coverImage,
          };
        }
        setBooks(withImages);
      }
      if (activityData) setActivity(JSON.parse(activityData));
      if (settingsData) setSettings({ ...defaultSettings, ...JSON.parse(settingsData) });
    } catch (e) {
      console.warn('Failed to load library data:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  // Persist books
  const saveBooks = useCallback(async (updatedBooks: Record<string, Book>) => {
    try {
      // Strip coverImage before saving (not serializable as require())
      const serializable: Record<string, any> = {};
      for (const [id, book] of Object.entries(updatedBooks)) {
        serializable[id] = { ...book, coverImage: undefined };
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.warn('Failed to save books:', e);
    }
  }, []);

  // Persist activity
  const saveActivity = useCallback(async (updatedActivity: ActivityEntry[]) => {
    try {
      await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(updatedActivity));
    } catch (e) {
      console.warn('Failed to save activity:', e);
    }
  }, []);

  // Add activity entry
  const addActivityEntry = useCallback((bookId: string, type: ActivityEntry['type'], details?: string) => {
    const entry: ActivityEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      bookId,
      type,
      timestamp: Date.now(),
      details,
    };
    setActivity(prev => {
      const updated = [entry, ...prev].slice(0, 50); // keep last 50
      saveActivity(updated);
      return updated;
    });
  }, [saveActivity]);

  // Update book progress
  const updateBookProgress = useCallback((bookId: string, currentPage: number) => {
    setBooks(prev => {
      const book = prev[bookId];
      if (!book) return prev;
      const clampedPage = Math.max(0, Math.min(currentPage, book.pages));
      const progress = book.pages > 0 ? clampedPage / book.pages : 0;
      const newStatus: BookStatus = progress >= 1 ? 'completed' : progress > 0 ? 'reading' : book.status;
      const updated = {
        ...prev,
        [bookId]: { ...book, currentPage: clampedPage, progress, status: newStatus },
      };
      saveBooks(updated);
      if (progress >= 1 && book.progress < 1) {
        addActivityEntry(bookId, 'finished', `Finished ${book.title}`);
      } else {
        addActivityEntry(bookId, 'progress', `Read to page ${clampedPage} of ${book.title}`);
      }
      return updated;
    });
  }, [saveBooks, addActivityEntry]);

  // Update book status
  const updateBookStatus = useCallback((bookId: string, status: BookStatus) => {
    setBooks(prev => {
      const book = prev[bookId];
      if (!book) return prev;
      const updates: Partial<Book> = { status };
      if (status === 'completed') {
        updates.progress = 1;
        updates.currentPage = book.pages;
      }
      const updated = { ...prev, [bookId]: { ...book, ...updates } };
      saveBooks(updated);
      if (status === 'completed' && book.status !== 'completed') {
        addActivityEntry(bookId, 'finished', `Finished ${book.title}`);
      } else if (status === 'reading' && book.status !== 'reading') {
        addActivityEntry(bookId, 'started', `Started reading ${book.title}`);
      }
      return updated;
    });
  }, [saveBooks, addActivityEntry]);

  // Add book to library
  const addBookToLibrary = useCallback((book: Book) => {
    const newId = `book_${Date.now()}`;
    const newBook: Book = { ...book, id: newId, status: 'to_read', progress: 0, currentPage: 0, dateAdded: Date.now() };
    setBooks(prev => {
      const updated = { ...prev, [newId]: newBook };
      saveBooks(updated);
      return updated;
    });
    addActivityEntry(newId, 'added', `Added "${book.title}" to library`);
  }, [saveBooks, addActivityEntry]);

  // Remove book
  const removeBook = useCallback((bookId: string) => {
    setBooks(prev => {
      const { [bookId]: _, ...rest } = prev;
      saveBooks(rest);
      return rest;
    });
  }, [saveBooks]);

  // Check if a book is already in library (by title match)
  const isBookInLibrary = useCallback((bookId: string, title: string): boolean => {
    return Object.values(books).some(b => b.title.toLowerCase() === title.toLowerCase());
  }, [books]);

  // Start reading session
  const startReadingSession = useCallback((bookId: string) => {
    if (activeSession) return; // already in a session
    const session: ActiveSession = {
      bookId,
      startTime: Date.now(),
      elapsed: 0,
    };
    setActiveSession(session);

    // Start timer
    timerRef.current = setInterval(() => {
      setActiveSession(prev => {
        if (!prev) return null;
        return { ...prev, elapsed: Math.floor((Date.now() - prev.startTime) / 1000) };
      });
    }, 1000);
  }, [activeSession]);

  // Stop reading session
  const stopReadingSession = useCallback(() => {
    if (!activeSession) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
    const session: ReadingSession = {
      id: `sess_${Date.now()}`,
      bookId: activeSession.bookId,
      startTime: activeSession.startTime,
      endTime: Date.now(),
      pagesRead: 0,
    };

    // Update book's total reading time
    setBooks(prev => {
      const book = prev[activeSession.bookId];
      if (!book) return prev;
      const updated = {
        ...prev,
        [activeSession.bookId]: {
          ...book,
          totalReadingTime: book.totalReadingTime + elapsed,
          sessions: [...book.sessions, session],
        },
      };
      saveBooks(updated);
      return updated;
    });

    setActiveSession(null);
  }, [activeSession, saveBooks]);

  // Settings
  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)).catch(console.warn);
      return updated;
    });
  }, []);

  // Clear all data
  const clearAllData = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY, ACTIVITY_KEY, SETTINGS_KEY]);
    setBooks(initialBooks);
    setActivity([]);
    setSettings(defaultSettings);
  }, []);

  // Filter helpers
  const getBooksByStatus = useCallback((status: BookStatus): Book[] => {
    return Object.values(books).filter(b => b.status === status);
  }, [books]);

  const searchBooks = useCallback((query: string): Book[] => {
    if (!query.trim()) return Object.values(books);
    const lower = query.toLowerCase();
    return Object.values(books).filter(
      b => b.title.toLowerCase().includes(lower) || b.author.toLowerCase().includes(lower)
    );
  }, [books]);

  const filterByStatusAndSearch = useCallback((status: BookStatus | 'all', query: string): Book[] => {
    let results = Object.values(books);
    if (status !== 'all') {
      results = results.filter(b => b.status === status);
    }
    if (query.trim()) {
      const lower = query.toLowerCase();
      results = results.filter(
        b => b.title.toLowerCase().includes(lower) || b.author.toLowerCase().includes(lower)
      );
    }
    return results;
  }, [books]);

  // Computed stats
  const stats: LibraryStats = React.useMemo(() => {
    const allBooks = Object.values(books);
    const completed = allBooks.filter(b => b.status === 'completed');
    const totalPagesRead = allBooks.reduce((sum, b) => sum + b.currentPage, 0);
    const totalTime = allBooks.reduce((sum, b) => sum + b.totalReadingTime, 0);

    return {
      totalBooks: allBooks.length,
      pagesRead: totalPagesRead,
      readingTimeHours: Math.round(totalTime / 3600),
      finishedBooks: completed.length,
      yearlyGoal: settings.readingGoal,
      yearlyCompleted: completed.length,
      currentStreak: 15, // simplified — would need daily tracking for real streak
    };
  }, [books, settings.readingGoal]);

  const value: LibraryContextType = {
    books,
    activity,
    settings,
    activeSession,
    stats,
    isLoaded,
    updateBookProgress,
    updateBookStatus,
    addBookToLibrary,
    removeBook,
    isBookInLibrary,
    startReadingSession,
    stopReadingSession,
    updateSettings,
    clearAllData,
    getBooksByStatus,
    searchBooks,
    filterByStatusAndSearch,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextType {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
