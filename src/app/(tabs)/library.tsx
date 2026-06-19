import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Typography, Card, CircularProgress, ProgressBar, Button } from '../../components';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { useLibrary } from '../../hooks/useLibrary';
import { Book, BookStatus } from '../../data/books';

type FilterStatus = 'all' | BookStatus;

const HoverableCard = ({ children, onPress, style }: { children: React.ReactNode, onPress?: () => void, style?: any }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reading', value: 'reading' },
  { label: 'Completed', value: 'completed' },
  { label: 'To Read', value: 'to_read' },
];

export default function LibraryScreen() {
  const { books, stats, filterByStatusAndSearch } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const filteredBooks = filterByStatusAndSearch(activeFilter, searchQuery);
  const readingBooks = filteredBooks.filter(b => b.status === 'reading');
  const completedBooks = filteredBooks.filter(b => b.status === 'completed');
  const toReadBooks = filteredBooks.filter(b => b.status === 'to_read');

  const yearlyProgress = stats.yearlyGoal > 0 ? Math.min(stats.yearlyCompleted / stats.yearlyGoal, 1) : 0;
  const yearlyPercent = Math.round(yearlyProgress * 100);

  const getBadgeStyle = (status: BookStatus) => {
    if (status === 'reading') return styles.bookBadge;
    if (status === 'to_read') return [styles.bookBadge, styles.bookBadgeWantToRead];
    if (status === 'completed') return [styles.bookBadge, styles.bookBadgeCompleted];
    return styles.bookBadge;
  };

  const getBadgeLabel = (status: BookStatus) => {
    if (status === 'reading') return '● Reading';
    if (status === 'to_read') return '📌 To Read';
    if (status === 'completed') return '✓ Done';
    if (status === 'on_hold') return '⏸ On Hold';
    return status;
  };

  const renderBookCard = (book: Book) => (
    <HoverableCard key={book.id} onPress={() => router.push(`/book/${book.id}`)} style={{ marginBottom: theme.spacing.stackMd }}>
      <Card style={styles.bookCard}>
        <Image source={book.coverImage} style={styles.bookCover} />
        <View style={styles.bookInfo}>
          <View style={getBadgeStyle(book.status)}>
            <Typography variant="labelSm" color={book.status === 'to_read' ? 'primary' : 'onPrimary'}>
              {getBadgeLabel(book.status)}
            </Typography>
          </View>
          <Typography variant="labelLg">{book.title}</Typography>
          <Typography variant="labelSm" color="outline">{book.author}</Typography>
          {book.status === 'reading' && (
            <View style={styles.progressContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Typography variant="labelSm" color="outline">Progress</Typography>
                <Typography variant="labelSm" color="primary">{Math.round(book.progress * 100)}%</Typography>
              </View>
              <ProgressBar progress={book.progress} />
            </View>
          )}
          {book.status === 'to_read' && (
            <Typography variant="labelSm" color="outline" style={{ marginTop: 4 }}>{book.pages} pages</Typography>
          )}
        </View>
      </Card>
    </HoverableCard>
  );

  const renderShelfBook = (book: Book) => (
    <HoverableCard key={book.id} onPress={() => router.push(`/book/${book.id}`)} style={{ marginRight: 16 }}>
      <View style={styles.shelfBook}>
        <Image source={book.coverImage} style={styles.shelfCover} />
        <Typography variant="labelSm" style={styles.shelfTitle} numberOfLines={2}>{book.title}</Typography>
        <Typography variant="labelSm" color="outline" numberOfLines={1}>{book.author.split(' ').pop()}</Typography>
        <View style={styles.completedBadge}>
          <Typography variant="labelSm" color="onTertiary">✓</Typography>
        </View>
      </View>
    </HoverableCard>
  );

  const showSections = activeFilter === 'all';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typography variant="headlineLg" color="primary">مكتبتي (Maqra)</Typography>
            <Typography variant="titleLg">Bienvenue</Typography>
          </View>
          <View style={styles.avatar}>
            <Typography variant="labelSm" color="onPrimary">JS</Typography>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your library..."
            placeholderTextColor={theme.colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Typography
                variant="labelLg"
                color={activeFilter === f.value ? 'onPrimary' : 'onSurfaceVariant'}
              >
                {f.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Yearly Progress — only show on "All" tab */}
        {showSections && (
          <Card style={styles.progressCard}>
            <View style={styles.progressText}>
              <Typography variant="labelSm" color="outline">Yearly Progress</Typography>
              <Typography variant="bodyLg" style={{ marginVertical: 4 }}>
                {stats.yearlyCompleted} of {stats.yearlyGoal} books read!
              </Typography>
              <TouchableOpacity>
                <Typography variant="labelSm" color="primary">Adjust goal ↗</Typography>
              </TouchableOpacity>
            </View>
            <CircularProgress progress={yearlyProgress} size={60} strokeWidth={6} label={`${yearlyPercent}%`} color={theme.colors.primary} />
          </Card>
        )}

        {/* Stats Grid — only show on "All" tab */}
        {showSections && (
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Typography variant="labelSm" color="outline">TOTAL BOOKS</Typography>
              <Typography variant="titleLg">{stats.totalBooks}</Typography>
            </Card>
            <Card style={styles.statCard}>
              <Typography variant="labelSm" color="outline">PAGES READ</Typography>
              <Typography variant="titleLg">{stats.pagesRead >= 1000 ? `${(stats.pagesRead / 1000).toFixed(1)}k` : stats.pagesRead}</Typography>
            </Card>
            <Card style={styles.statCard}>
              <Typography variant="labelSm" color="outline">READING TIME</Typography>
              <Typography variant="titleLg">{stats.readingTimeHours}h</Typography>
            </Card>
            <Card style={styles.statCard}>
              <Typography variant="labelSm" color="outline">FINISHED</Typography>
              <Typography variant="titleLg">{stats.finishedBooks}</Typography>
            </Card>
          </View>
        )}

        {/* When filtered: flat list */}
        {!showSections && (
          <>
            {filteredBooks.length === 0 ? (
              <View style={styles.emptyState}>
                <Typography variant="bodyLg" color="outline">No books found.</Typography>
              </View>
            ) : (
              filteredBooks.map(renderBookCard)
            )}
          </>
        )}

        {/* All tab: sectioned lists */}
        {showSections && (
          <>
            {/* Current Reads */}
            {readingBooks.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Typography variant="titleLg">Current Reads</Typography>
                  <TouchableOpacity onPress={() => setActiveFilter('reading')}>
                    <Typography variant="labelLg" color="primary">See all</Typography>
                  </TouchableOpacity>
                </View>
                {readingBooks.map(renderBookCard)}
              </>
            )}

            {/* Completed */}
            {completedBooks.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                  <Typography variant="titleLg">Completed</Typography>
                  <TouchableOpacity onPress={() => setActiveFilter('completed')}>
                    <Typography variant="labelLg" color="primary">See all</Typography>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shelfContainer}>
                  {completedBooks.map(renderShelfBook)}
                </ScrollView>
              </>
            )}

            {/* Want to Read */}
            {toReadBooks.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                  <Typography variant="titleLg">Want to Read</Typography>
                  <TouchableOpacity onPress={() => setActiveFilter('to_read')}>
                    <Typography variant="labelLg" color="primary">See all</Typography>
                  </TouchableOpacity>
                </View>
                {toReadBooks.map(renderBookCard)}
              </>
            )}
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.marginMobile, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackMd,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: theme.spacing.stackMd,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  searchInput: {
    fontFamily: theme.typography.bodyLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    color: theme.colors.onSurface,
  },
  filtersContainer: { flexDirection: 'row', marginBottom: theme.spacing.stackLg },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainerLowest,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackLg,
  },
  progressText: { flex: 1, marginRight: 16 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.stackLg,
  },
  statCard: { width: '48%', marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackMd,
  },
  bookCard: { flexDirection: 'row' },
  bookCover: { width: 70, height: 105, borderRadius: theme.radius.sm, marginRight: 16 },
  bookBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  bookBadgeWantToRead: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  bookBadgeCompleted: {
    backgroundColor: theme.colors.tertiary,
  },
  bookInfo: { flex: 1, justifyContent: 'center' },
  progressContainer: { marginTop: 8 },
  shelfContainer: { flexDirection: 'row', marginBottom: theme.spacing.stackLg },
  shelfBook: { width: 100, position: 'relative' },
  shelfCover: { width: 100, height: 150, borderRadius: theme.radius.md },
  shelfTitle: { marginTop: 6, fontWeight: '600' },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
});
