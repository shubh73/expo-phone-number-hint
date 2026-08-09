import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getSimRegionCodeAsync,
  isAvailableAsync,
  type PhoneNumberHint,
  showPhoneNumberHintAsync,
} from "expo-phone-number-hint";

const isAndroid = Platform.OS === "android";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "selected"; hint: PhoneNumberHint }
  | { type: "dismissed" }
  | { type: "error"; code: string; message: string };

export default function DemoScreen({
  onShowNormalization,
  onShowValidation,
}: {
  onShowNormalization: () => void;
  onShowValidation: () => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [available, setAvailable] = useState<boolean | null>(null);
  const [simRegion, setSimRegion] = useState<string | null | undefined>(
    undefined,
  );

  const handleRequestPhoneNumber = async () => {
    setStatus({ type: "loading" });

    try {
      const result = await showPhoneNumberHintAsync();

      if (!result.canceled) {
        setPhoneNumber(result.hint.e164 ?? result.hint.number);
        setStatus({ type: "selected", hint: result.hint });
      } else {
        setStatus({ type: "dismissed" });
      }
    } catch (e: any) {
      setStatus({ type: "error", code: e.code, message: e.message });
    }
  };

  const handleCheckAvailability = async () => {
    setAvailable(await isAvailableAsync());
  };

  const handleGetSimRegion = async () => {
    setSimRegion(await getSimRegionCodeAsync());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>expo-phone-number-hint</Text>
      <Text style={styles.description}>
        Provides a frictionless way to show a user's (SIM-based) phone numbers
        as a hint.
      </Text>

      {!isAndroid ? (
        <View style={styles.platformBanner}>
          <Text style={styles.platformBannerText}>
            This feature is only available on Android devices with Google Play
            Services.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              editable
            />
          </View>

          <Pressable
            style={[
              styles.primaryButton,
              status.type === "loading" && styles.buttonDisabled,
            ]}
            onPress={handleRequestPhoneNumber}
            disabled={status.type === "loading"}
          >
            <Text style={styles.primaryButtonText}>
              {status.type === "loading"
                ? "Showing phone hint..."
                : "Autofill phone number"}
            </Text>
          </Pressable>

          {status.type === "selected" && (
            <View style={styles.statusCard}>
              <Text style={styles.statusSuccess}>Number selected</Text>
              <Text style={styles.detailRow}>number: {status.hint.number}</Text>
              <Text style={styles.detailRow}>
                e164: {status.hint.e164 ?? "null"}
              </Text>
              <Text style={styles.detailRow}>
                regionCode: {status.hint.regionCode ?? "null"}
              </Text>
            </View>
          )}

          {status.type === "dismissed" && (
            <View style={styles.statusCard}>
              <Text style={styles.statusMuted}>
                Picker dismissed — no number selected
              </Text>
            </View>
          )}

          {status.type === "error" && (
            <View style={styles.errorCard}>
              <Text style={styles.statusError}>
                {status.code}: {status.message}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <Pressable
            style={styles.secondaryButton}
            onPress={handleCheckAvailability}
          >
            <Text style={styles.secondaryButtonText}>Check availability</Text>
          </Pressable>

          {available !== null && (
            <Text style={styles.availabilityText}>
              isAvailableAsync(): {String(available)}
            </Text>
          )}

          <Pressable style={styles.secondaryButton} onPress={handleGetSimRegion}>
            <Text style={styles.secondaryButtonText}>Get SIM region</Text>
          </Pressable>

          {simRegion !== undefined && (
            <Text style={styles.availabilityText}>
              getSimRegionCodeAsync(): {simRegion ?? "null"}
            </Text>
          )}
        </>
      )}

      <View style={styles.divider} />

      <Pressable style={styles.linkButton} onPress={onShowNormalization}>
        <Text style={styles.linkButtonText}>Open Normalization Playground</Text>
      </Pressable>

      <Pressable style={styles.linkButton} onPress={onShowValidation}>
        <Text style={styles.linkButtonText}>Open Validation Matrix</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginTop: 12,
  },
  description: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },
  platformBanner: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  platformBannerText: {
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
  },
  inputSection: {
    gap: 6,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: "#111827",
    backgroundColor: "#f9fafb",
    fontVariant: ["tabular-nums"],
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  statusCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  statusSuccess: {
    fontSize: 15,
    color: "#166534",
    fontWeight: "600",
  },
  detailRow: {
    fontSize: 14,
    color: "#374151",
    fontVariant: ["tabular-nums"],
  },
  statusMuted: {
    fontSize: 14,
    color: "#6b7280",
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  statusError: {
    fontSize: 14,
    color: "#991b1b",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  availabilityText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
});
