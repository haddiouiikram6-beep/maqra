import { Stack } from 'expo-router';
import { LibraryProvider } from '../hooks/useLibrary';

export default function RootLayout() {
  return (
    <LibraryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </LibraryProvider>
  );
}
