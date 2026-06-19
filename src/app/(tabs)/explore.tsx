import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Typography, Card } from '../../components';
import { theme } from '../../theme';
import { useLibrary } from '../../hooks/useLibrary';
import { exploreCatalog, Book, Genre } from '../../data/books';

const ALL_GENRES: Genre[] = ['Fiction', 'History', 'Poetry', 'Science', 'Arabic Lit', 'Philosophy', 'Art', 'Sci-Fi', 'Classics'];

export default function ExploreScreen() {
  const { isBookInLibrary, addBookToLibrary } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);

  const filteredCatalog = exploreCatalog.filter(book => {
    const matchesSearch = !searchQuery.trim() ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !activeGenre || book.genre === activeGenre;
    return matchesSearch && matchesGenre;
  });

  const trending = exploreCatalog.slice(0, 3);

  const handleAddBook = (book: Book) => {
    if (isBookInLibrary(book.id, book.title)) {
      Alert.alert('Already in Library', `"${book.title}" is already in your library.`, [{ text: 'OK' }]);
      return;
    }
    addBookToLibrary(book);
    Alert.alert('Added! 📚', `"${book.title}" was added to your library.`, [{ text: 'Great!' }]);
  };

  const renderBookCard = (book: Book) => {
    const inLibrary = isBookInLibrary(book.id, book.title);
    return (
      <Card key={book.id} style={styles.bookCard}>
        <Image source={book.coverImage} style={styles.bookCoverPlaceholder} />
        <View style={styles.bookInfo}>
          <Typography variant="labelSm" color="secondary">{book.genre.toUpperCase()}</Typography>
          <Typography variant="titleLg" numberOfLines={2}>{book.title}</Typography>
          <Typography variant="bodyMd" color="outline">{book.author}</Typography>
          <View style={styles.ratingRow}>
            <Typography variant="labelSm" color="tertiary">{'★'.repeat(Math.round(book.rating))} {book.rating}</Typography>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, inLibrary && styles.addBtnDone]}
            onPress={() => handleAddBook(book)}
            disabled={inLibrary}
          >
            <Typography variant="labelLg" color="onPrimary">{inLibrary ? '✓ In Library' : '+ Add to Library'}</Typography>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="headlineLg" color="primary">مكتبتي (Maqra)</Typography>
        <Typography variant="titleLg">Explore</Typography>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for books or authors..."
          placeholderTextColor={theme.colors.outline}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Genre Chips */}
      <View style={styles.sectionHeader}>
        <Typography variant="titleLg">Genres</Typography>
        {activeGenre && (
          <TouchableOpacity onPress={() => setActiveGenre(null)}>
            <Typography variant="labelLg" color="primary">Clear ✕</Typography>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genresContainer}>
        {ALL_GENRES.map((genre, index) => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreChip,
              index % 2 === 0 ? styles.genreChipPrimary : styles.genreChipSecondary,
              activeGenre === genre && styles.genreChipActive,
            ]}
            onPress={() => setActiveGenre(prev => (prev === genre ? null : genre))}
          >
            <Typography
              variant="labelLg"
              color={activeGenre === genre ? 'onPrimary' : index % 2 === 0 ? 'onTertiaryContainer' : 'onSecondaryContainer'}
            >
              {genre}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending — only show when not filtering */}
      {!searchQuery && !activeGenre && (
        <>
          <View style={styles.sectionHeader}>
            <Typography variant="titleLg">Trending Now</Typography>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingContainer}>
            {trending.map(book => (
              <TouchableOpacity key={book.id} style={styles.trendingBook} onPress={() => handleAddBook(book)}>
                <Image source={book.coverImage} style={styles.trendingCover} />
                <Typography variant="labelLg" style={{ marginTop: 8 }} numberOfLines={1}>{book.title}</Typography>
                <Typography variant="labelSm" color="outline">{book.author.split(' ').pop()}</Typography>
                {isBookInLibrary(book.id, book.title) && (
                  <View style={styles.trendingBadge}>
                    <Typography variant="labelSm" color="onPrimary">✓</Typography>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Results */}
      <View style={styles.sectionHeader}>
        <Typography variant="titleLg">
          {searchQuery || activeGenre ? `Results (${filteredCatalog.length})` : 'Recommended for You'}
        </Typography>
      </View>

      {filteredCatalog.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography variant="bodyLg" color="outline">No books found.</Typography>
        </View>
      ) : (
        filteredCatalog.map(renderBookCard)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.marginMobile, paddingBottom: 100 },
  header: { marginBottom: theme.spacing.stackMd },
  searchContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: theme.spacing.stackLg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  searchInput: {
    fontFamily: theme.typography.bodyLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    color: theme.colors.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackMd,
  },
  genresContainer: { flexDirection: 'row', marginBottom: theme.spacing.stackLg },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    marginRight: 8,
  },
  genreChipPrimary: { backgroundColor: theme.colors.tertiary },
  genreChipSecondary: { backgroundColor: theme.colors.secondaryContainer },
  genreChipActive: { backgroundColor: theme.colors.primary },
  trendingContainer: { flexDirection: 'row', marginBottom: theme.spacing.stackLg },
  trendingBook: { width: 120, marginRight: 16 },
  trendingCover: {
    width: 120,
    height: 180,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
  },
  trendingBadge: {
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
  bookCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.stackMd,
  },
  bookCoverPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: theme.radius.sm,
    marginRight: 16,
    backgroundColor: theme.colors.surfaceVariant,
  },
  bookInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  ratingRow: { marginTop: 4 },
  addBtn: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.DEFAULT,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  addBtnDone: { backgroundColor: theme.colors.tertiary },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
});
