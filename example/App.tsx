import { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  isAvailable,
  requestPhoneNumber,
  PhoneNumberHintError,
} from "expo-phone-number-hint";

export default function App() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    setError(null);
    const result = await isAvailable();
    setAvailable(result);
  };

  const handleRequestPhoneNumber = async () => {
    setError(null);
    setPhoneNumber(null);
    setLoading(true);

    try {
      const result = await requestPhoneNumber();
      if (result) {
        setPhoneNumber(result);
      } else {
        setError("Picker dismissed");
      }
    } catch (e) {
      if (e instanceof PhoneNumberHintError) {
        setError(`${e.code}: ${e.message}`);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>expo-phone-number-hint</Text>
        <Text style={styles.subtitle}>
          Platform: {Platform.OS} {Platform.Version}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Availability</Text>
          <Pressable style={styles.button} onPress={checkAvailability}>
            <Text style={styles.buttonText}>Check isAvailable()</Text>
          </Pressable>
          {available !== null && (
            <Text style={styles.result}>
              {available ? "Available" : "Not available"}
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phone Number Hint</Text>
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRequestPhoneNumber}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Waiting..." : "requestPhoneNumber()"}
            </Text>
          </Pressable>

          {phoneNumber && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Selected:</Text>
              <Text style={styles.resultValue}>{phoneNumber}</Text>
            </View>
          )}

          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  result: {
    marginTop: 12,
    fontSize: 15,
    color: "#333",
  },
  resultBox: {
    marginTop: 12,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 12,
  },
  resultLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2e7d32",
    fontVariant: ["tabular-nums"],
  },
  error: {
    marginTop: 12,
    fontSize: 14,
    color: "#d32f2f",
  },
});
