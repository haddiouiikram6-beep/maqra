import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Animated, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Typography, Card, Button, CircularProgress } from '../../components';
import { theme } from '../../theme';
import { useLibrary } from '../../hooks/useLibrary';
import { BookStatus } from '../../data/books';

type StatusOption = { label: string; value: BookStatus };

const STATUS_OPTIONS: StatusOption[] = [
  { label: 'Reading', value: 'reading' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'To Read', value: 'to_read' },
];

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books, activeSession, updateBookProgress, updateBookStatus, startReadingSession, stopReadingSession } = useLibrary();

  const book = books[id] || Object.values(books)[0];

  const [pageInput, setPageInput] = useState(String(book?.currentPage ?? 0));
  const isSessionActive = activeSession?.bookId === id;

  // Sync input when book progress updates externally
  useEffect(() => {
    if (book) setPageInput(String(book.currentPage));
  }, [book?.currentPage]);

  const fadeAnimHero = useRef(new Animated.Value(0)).current;
  const slideAnimHero = useRef(new Animated.Value(20)).current;
  const fadeAnimMeta = useRef(new Animated.Value(0)).current;
  const slideAnimMeta = useRef(new Animated.Value(20)).current;
  const fadeAnimCards = useRef(new Animated.Value(0)).current;
  const slideAnimCards = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const createAnim = (fade: Animated.Value, slide: Animated.Value) =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]);

    Animated.stagger(150, [
      createAnim(fadeAnimHero, slideAnimHero),
      createAnim(fadeAnimMeta, slideAnimMeta),
      createAnim(fadeAnimCards, slideAnimCards),
    ]).start();
  }, []);

  // Pulse animation when session is active
  useEffect(() => {
    if (isSessionActive) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [isSessionActive]);

  if (!book) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Typography variant="bodyLg">Book not found.</Typography>
      </View>
    );
  }

  const handleStartStop = () => {
    if (isSessionActive) {
      stopReadingSession();
    } else {
      // If another session is active, warn
      if (activeSession) {
        Alert.alert('Session Active', 'Stop the current session first.', [{ text: 'OK' }]);
        return;
      }
      startReadingSession(id);
    }
  };

  const handleUpdatePage = () => {
    const page = parseInt(pageInput, 10);
    if (isNaN(page) || page < 0) {
      Alert.alert('Invalid page', 'Please enter a valid page number.');
      setPageInput(String(book.currentPage));
      return;
    }
    updateBookProgress(id, page);
    if (page >= book.pages) {
      Alert.alert('🎉 Congratulations!', `You've finished "${book.title}"!`, [{ text: 'Awesome!' }]);
    }
  };

  const elapsed = isSessionActive ? (activeSession?.elapsed ?? 0) : 0;
  const totalTime = book.totalReadingTime + elapsed;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Typography variant="labelLg" color="primary">← Back</Typography>
        </TouchableOpacity>
        <Typography variant="titleLg">Details</Typography>
        <View style={{ width: 40 }} />
      </View>

      {/* Book Hero */}
      <Animated.View style={[styles.hero, { opacity: fadeAnimHero, transform: [{ translateY: slideAnimHero }] }]}>
        <Image source={book.coverImage} style={styles.bookCoverLarge} />
        <Typography variant="headlineMd" style={{ marginTop: 16 }}>{book.title}</Typography>
        <Typography variant="bodyLg" color="outline">{book.author}</Typography>
        <View style={styles.rating}>
          <Typography variant="labelLg" color="secondary">{'★'.repeat(Math.round(book.rating))}{'☆'.repeat(5 - Math.round(book.rating))} {book.rating}</Typography>
        </View>
      </Animated.View>

      {/* Metadata */}
      <Animated.View style={[styles.metadataRow, { opacity: fadeAnimMeta, transform: [{ translateY: slideAnimMeta }] }]}>
        <View style={styles.metadataItem}>
          <Typography variant="labelSm" color="outline">LANGUAGE</Typography>
          <Typography variant="bodyLg">{book.language}</Typography>
        </View>
        <View style={styles.metadataItem}>
          <Typography variant="labelSm" color="outline">TOTAL PAGES</Typography>
          <Typography variant="bodyLg">{book.pages}</Typography>
        </View>
        <View style={styles.metadataItem}>
          <Typography variant="labelSm" color="outline">TIME READ</Typography>
          <Typography variant="bodyLg">{Math.round(totalTime / 3600)}h {Math.round((totalTime % 3600) / 60)}m</Typography>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnimCards, transform: [{ translateY: slideAnimCards }] }}>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Typography variant="bodyLg">Reading Progress</Typography>
            <Typography variant="labelSm" color="outline">Page {book.currentPage} of {book.pages}</Typography>
            <View style={styles.progressChip}>
              <Typography variant="labelSm" color="tertiaryContainer">{Math.round(book.progress * 100)}% Complete</Typography>
            </View>
          </View>
          <CircularProgress
            progress={book.progress}
            size={64}
            strokeWidth={6}
            label={`${Math.round(book.progress * 100)}`}
            color={theme.colors.tertiary}
          />
        </Card>

        {/* Update Page */}
        <Card style={styles.updatePageCard}>
          <Typography variant="labelSm" color="outline" style={{ marginBottom: 8 }}>UPDATE CURRENT PAGE</Typography>
          <View style={styles.pageInputRow}>
            <TouchableOpacity
              style={styles.pageBtn}
              onPress={() => {
                const p = Math.max(0, parseInt(pageInput || '0', 10) - 1);
                setPageInput(String(p));
              }}
            >
              <Typography variant="titleLg" color="primary">−</Typography>
            </TouchableOpacity>
            <TextInput
              style={styles.pageInput}
              value={pageInput}
              onChangeText={setPageInput}
              keyboardType="number-pad"
              onBlur={handleUpdatePage}
              onSubmitEditing={handleUpdatePage}
            />
            <TouchableOpacity
              style={styles.pageBtn}
              onPress={() => {
                const p = Math.min(book.pages, parseInt(pageInput || '0', 10) + 1);
                setPageInput(String(p));
              }}
            >
              <Typography variant="titleLg" color="primary">+</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.savePageBtn} onPress={handleUpdatePage}>
              <Typography variant="labelLg" color="onPrimary">Save</Typography>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Reading Session Timer */}
        <Card style={[styles.sessionCard, isSessionActive && styles.sessionCardActive]}>
          <View style={styles.sessionHeader}>
            <Typography variant="labelSm" color="outline">READING SESSION</Typography>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Typography variant="labelLg" color={isSessionActive ? 'primary' : 'outline'} style={styles.timerText}>
                {formatTime(elapsed)}
              </Typography>
            </Animated.View>
          </View>
          {isSessionActive && (
            <Typography variant="labelSm" color="outline" style={{ marginBottom: 12 }}>
              Total session: {formatTime(elapsed)} • Total read: {formatTime(totalTime)}
            </Typography>
          )}
          <View style={styles.sessionActions}>
            <Button
              title={isSessionActive ? '⏹ Stop Session' : '▶ Start Session'}
              style={{ flex: 1, marginRight: isSessionActive ? 0 : 8, backgroundColor: isSessionActive ? theme.colors.error : undefined }}
              onPress={handleStartStop}
            />
          </View>
        </Card>

        {/* Reading Status Segmented Control */}
        <View style={styles.statusSection}>
          <Typography variant="labelSm" color="outline" style={{ marginBottom: 8 }}>READING STATUS</Typography>
          <View style={styles.statusSegmentedControl}>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.statusOption, book.status === opt.value && styles.statusOptionActive]}
                onPress={() => updateBookStatus(id, opt.value)}
              >
                <Typography
                  variant="labelLg"
                  color={book.status === opt.value ? 'onPrimary' : 'onSurfaceVariant'}
                >
                  {opt.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.marginMobile, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackLg,
  },
  hero: { alignItems: 'center', marginBottom: theme.spacing.stackLg },
  bookCoverLarge: {
    width: 140,
    height: 210,
    borderRadius: theme.radius.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  rating: { marginTop: 8 },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.stackLg,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  metadataItem: { alignItems: 'center' },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackLg,
  },
  progressInfo: { flex: 1 },
  progressChip: {
    backgroundColor: theme.colors.tertiaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  updatePageCard: { marginBottom: theme.spacing.stackLg },
  pageInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pageBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.DEFAULT,
  },
  pageInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.DEFAULT,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  savePageBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: theme.radius.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionCard: { marginBottom: theme.spacing.stackLg },
  sessionCardActive: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timerText: { fontSize: 20, fontWeight: '700' },
  sessionActions: { flexDirection: 'row' },
  statusSection: { marginBottom: theme.spacing.stackLg },
  statusSegmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    flexWrap: 'wrap',
    gap: 4,
  },
  statusOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius.DEFAULT,
  },
  statusOptionActive: { backgroundColor: theme.colors.primary },
});
