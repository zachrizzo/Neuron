import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "react-native";
import { colorsDark } from "../utility/color";
import { RevenueCatProvider } from "../providers/revenueCatProvider";
import { UserProvider } from "../context/userContext";

export default function App() {
  return (
    <Provider store={store}>
      <RevenueCatProvider>
        <UserProvider>
          <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
            <Layout />
          </PersistGate>
        </UserProvider>
      </RevenueCatProvider>
    </Provider>
  );
}

export function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          // backgroundColor: "#000000E7",
          backgroundColor: colorsDark.secondary,
        },
        headerTitleStyle: {
          color: colorsDark.mainText,
        },
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="store"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
          headerTitle: "Store",
        }}
      />
    </Stack>
  );
}
