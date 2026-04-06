import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import DemoScreen from "./screens/demo-screen";
import ValidationScreen from "./screens/validation-screen";

type Screen = "demo" | "validation";

export default function App() {
  const [screen, setScreen] = useState<Screen>("demo");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {screen === "demo" ? (
          <DemoScreen onShowValidation={() => setScreen("validation")} />
        ) : (
          <ValidationScreen onBack={() => setScreen("demo")} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
