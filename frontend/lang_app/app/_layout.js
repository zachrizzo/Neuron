import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "react-native";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <Layout />
      </PersistGate>
    </Provider>
  );
}

export function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000E7",
        },
        headerTitleStyle: {
          color: "#FFFFFF",
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
    </Stack>
  );
}
