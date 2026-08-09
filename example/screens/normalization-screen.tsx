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
  formatToE164,
  getSimRegionCodeAsync,
} from "expo-phone-number-hint";

const isAndroid = Platform.OS === "android";

type Preset = { label: string; number: string; regionCode: string };

// Inputs that exercise formatToE164's recovery — and its limits. The +44 case
// returns null on purpose: stripping a misattributed prefix is the consuming
// app's policy, not the library's job. An empty region exercises the
// region-less mode for "+"-prefixed international numbers.
const PRESETS: Preset[] = [
  { label: "National (IN)", number: "9705783855", regionCode: "IN" },
  { label: "Leading zero (IN)", number: "09705783855", regionCode: "IN" },
  { label: "No plus (IN)", number: "919705783855", regionCode: "IN" },
  { label: "US national", number: "2025550173", regionCode: "US" },
  { label: "International, no region", number: "+919705783855", regionCode: "" },
  { label: "No plus, no region → null", number: "9705783855", regionCode: "" },
  { label: "Misattributed +44 → null", number: "+44919705783855", regionCode: "IN" },
];

export default function NormalizationScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [number, setNumber] = useState("9705783855");
  const [regionCode, setRegionCode] = useState("IN");
  const [e164, setE164] = useState<string | null | undefined>(undefined);
  const [simRegion, setSimRegion] = useState<string | null | undefined>(
    undefined,
  );

  const format = (nextNumber: string, nextRegion: string) => {
    setNumber(nextNumber);
    setRegionCode(nextRegion);
    setE164(formatToE164(nextNumber, nextRegion.trim() || undefined));
  };

  const handleGetSimRegion = async () => {
    setSimRegion(await getSimRegionCodeAsync());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Normalization</Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      {!isAndroid ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            formatToE164 and getSimRegionCodeAsync are Android-only.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Number</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>
              Region code (ISO 3166-1 alpha-2, blank for none)
            </Text>
            <TextInput
              style={styles.input}
              value={regionCode}
              onChangeText={setRegionCode}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={2}
            />
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => format(number, regionCode)}
          >
            <Text style={styles.primaryButtonText}>Format to E.164</Text>
          </Pressable>

          {e164 !== undefined && (
            <View style={[styles.resultCard, !e164 && styles.resultCardNull]}>
              <Text style={[styles.resultText, !e164 && styles.resultTextNull]}>
                {e164 ?? "null (not a valid number)"}
              </Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>Presets</Text>
          <View style={styles.presets}>
            {PRESETS.map((preset) => (
              <Pressable
                key={preset.label}
                style={styles.presetButton}
                onPress={() => format(preset.number, preset.regionCode)}
              >
                <Text style={styles.presetText}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.divider} />

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  banner: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 16,
  },
  bannerText: {
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
  },
  inputSection: {
    gap: 6,
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
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    padding: 16,
  },
  resultCardNull: {
    backgroundColor: "#fef2f2",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#166534",
    fontVariant: ["tabular-nums"],
  },
  resultTextNull: {
    fontSize: 15,
    color: "#991b1b",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  presets: {
    gap: 8,
  },
  presetButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  presetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
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
});
