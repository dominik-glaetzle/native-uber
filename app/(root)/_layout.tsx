import { Stack } from "expo-router";

import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
