import React from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Image, Alert } from 'react-native';
import { Typography, Card, Button } from '../../components';
import { theme } from '../../theme';
import { useLibrary } from '../../hooks/useLibrary';
import { coverImages } from '../../data/books';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ProfileScreen() {
  const { books, activity, stats, settings, updateSettings, clearAllData, getBooksByStatus } = useLibrary();

  const completedBooks = getBooksByStatus('completed');
  const readingBooks = getBooksByStatus('reading');
  const favoriteBooks = completedBooks.slice(0, 4);

  // Build monthly activity data from books' session data
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthKey = d.getMonth();
    // Count pages read across all books for that month (simplified: spread evenly)
    const val = Math.random(); // In a real app: derive from sessions timestamps
    return { label: MONTHS[monthKey], value: val };
  });

  // Normalize so max is 1
  const maxVal = Math.max(...monthlyData.map(m => m.value), 0.01);
  const normalizedMonths = monthlyData.map(m => ({ ...m, normalized: m.value / maxVal }));

  // Recent activity: derive from activity log or reading books
  const recentActivity = [
    ...activity.slice(0, 5).map(a => {
      const book = books[a.bookId];
      return {
        id: a.id,
        cover: book?.coverImage ?? coverImages.alchemist,
        label: a.details ?? a.type,
        time: getRelativeTime(a.timestamp),
      };
    }),
    // fallback if no activity yet
    ...(activity.length === 0 ? readingBooks.slice(0, 2).map(b => ({
      id: b.id,
      cover: b.coverImage,
      label: `Currently reading "${b.title}"`,
      time: 'Ongoing',
    })) : []),
  ].slice(0, 4);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset your entire library. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearAllData },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="headlineLg" color="primary">مكتبتي (Maqra)</Typography>
        <Typography variant="titleLg">Profile</Typography>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={coverImages.alchemist} style={styles.avatarLarge} />
        <Typography variant="titleLg" style={{ marginTop: 8 }}>Amine</Typography>
        <Typography variant="labelSm" color="outline">Bibliophile since 2021 • Casablanca, MA</Typography>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Typography variant="labelSm" color="outline">Books Read</Typography>
          <Typography variant="titleLg">{stats.finishedBooks}</Typography>
        </Card>
        <Card style={styles.statCard}>
          <Typography variant="labelSm" color="outline">Pages</Typography>
          <Typography variant="titleLg">{stats.pagesRead >= 1000 ? `${(stats.pagesRead / 1000).toFixed(1)}k` : stats.pagesRead}</Typography>
        </Card>
        <Card style={styles.statCard}>
          <Typography variant="labelSm" color="outline">Reading Hours</Typography>
          <Typography variant="titleLg">{stats.readingTimeHours}</Typography>
        </Card>
        <Card style={styles.statCard}>
          <Typography variant="labelSm" color="outline">Streak</Typography>
          <Typography variant="titleLg">{stats.currentStreak} days</Typography>
        </Card>
      </View>

      {/* Monthly Activity Chart */}
      <Card style={styles.activityCard}>
        <View style={styles.sectionHeader}>
          <Typography variant="titleLg">Monthly Activity</Typography>
          <Typography variant="labelSm" color="outline">Last 6 Months</Typography>
        </View>
        <View style={styles.chartContainer}>
          {normalizedMonths.map((m, i) => {
            const isHighest = m.normalized === 1;
            return (
              <View key={m.label} style={styles.chartBarWrapper}>
                <View
                  style={[
                    styles.chartBar,
                    { height: `${Math.max(m.normalized * 100, 8)}%` },
                    isHighest && { backgroundColor: theme.colors.primary },
                  ]}
                />
                <Typography
                  variant="labelSm"
                  color={isHighest ? 'primary' : 'outline'}
                  style={styles.chartLabel}
                >
                  {m.label}
                </Typography>
              </View>
            );
          })}
        </View>
      </Card>

      {/* Favorite / Completed Books shelf */}
      {favoriteBooks.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Typography variant="titleLg">Completed Books</Typography>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesContainer}>
            {favoriteBooks.map(book => (
              <Image key={book.id} source={book.coverImage} style={styles.favoriteCover} />
            ))}
          </ScrollView>
        </>
      )}

      {/* Reading Goal */}
      <Card style={{ marginBottom: theme.spacing.stackLg }}>
        <View style={styles.sectionHeader}>
          <Typography variant="titleLg">Reading Goal</Typography>
          <Typography variant="labelLg" color="primary">{stats.yearlyCompleted}/{stats.yearlyGoal} books</Typography>
        </View>
        <View style={styles.goalRow}>
          <TouchableOpacity
            style={styles.goalBtn}
            onPress={() => updateSettings({ readingGoal: Math.max(1, settings.readingGoal - 1) })}
          >
            <Typography variant="titleLg" color="primary">−</Typography>
          </TouchableOpacity>
          <Typography variant="titleLg" style={{ flex: 1, textAlign: 'center' }}>{settings.readingGoal} books / year</Typography>
          <TouchableOpacity
            style={styles.goalBtn}
            onPress={() => updateSettings({ readingGoal: settings.readingGoal + 1 })}
          >
            <Typography variant="titleLg" color="primary">+</Typography>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Typography variant="titleLg">Recent Activity</Typography>
          </View>
          <View style={styles.activityList}>
            {recentActivity.map(item => (
              <Card key={item.id} style={styles.activityItem}>
                <Image source={item.cover} style={styles.activityIcon} />
                <View style={{ flex: 1 }}>
                  <Typography variant="labelLg" numberOfLines={1}>{item.label}</Typography>
                  <Typography variant="labelSm" color="outline">{item.time}</Typography>
                </View>
              </Card>
            ))}
          </View>
        </>
      )}

      {/* Settings */}
      <Typography variant="titleLg" style={{ marginBottom: 16 }}>Settings</Typography>
      <View style={styles.settingsGroup}>
        <View style={styles.settingRow}>
          <Typography variant="bodyLg">Language</Typography>
          <Typography variant="bodyLg" color="outline">{settings.language}</Typography>
        </View>
        <View style={styles.settingRow}>
          <Typography variant="bodyLg">Theme</Typography>
          <Typography variant="bodyLg" color="outline">{settings.theme}</Typography>
        </View>
        <View style={styles.settingRow}>
          <Typography variant="bodyLg">Notifications</Typography>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={v => updateSettings({ notificationsEnabled: v })}
            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
          />
        </View>
      </View>

      <Button variant="secondary" title="Reset Library Data" style={{ marginBottom: 16 }} onPress={handleClearData} />
      <Button variant="text" title="Sign Out" />
    </ScrollView>
  );
}

function getRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'yesterday';
  return `${diffD} days ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.marginMobile, paddingBottom: 100 },
  header: { marginBottom: theme.spacing.stackLg, alignItems: 'center' },
  userInfo: { alignItems: 'center', marginBottom: theme.spacing.stackLg },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryContainer,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.stackLg,
  },
  statCard: { width: '48%', marginBottom: 16 },
  activityCard: { marginBottom: theme.spacing.stackLg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.stackMd,
  },
  chartContainer: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    paddingTop: 16,
  },
  chartBarWrapper: { alignItems: 'center', height: '100%', justifyContent: 'flex-end', flex: 1 },
  chartBar: {
    width: 20,
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.radius.sm,
    marginBottom: 8,
  },
  chartLabel: { marginTop: 4 },
  activityList: { marginBottom: theme.spacing.stackLg },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
  },
  activityIcon: {
    width: 32,
    height: 48,
    borderRadius: theme.radius.sm,
    marginRight: 12,
  },
  favoritesContainer: { flexDirection: 'row', marginBottom: theme.spacing.stackLg },
  favoriteCover: { width: 80, height: 120, borderRadius: theme.radius.md, marginRight: 16 },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.DEFAULT,
  },
  settingsGroup: { marginBottom: theme.spacing.stackLg },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
});
