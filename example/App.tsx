import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import DemoScreen from "./screens/demo-screen";
import NormalizationScreen from "./screens/normalization-screen";
import ValidationScreen from "./screens/validation-screen";

type Screen = "demo" | "normalization" | "validation";

export default function App() {
  const [screen, setScreen] = useState<Screen>("demo");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {screen === "demo" && (
          <DemoScreen
            onShowNormalization={() => setScreen("normalization")}
            onShowValidation={() => setScreen("validation")}
          />
        )}
        {screen === "normalization" && (
          <NormalizationScreen onBack={() => setScreen("demo")} />
        )}
        {screen === "validation" && (
          <ValidationScreen onBack={() => setScreen("demo")} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
