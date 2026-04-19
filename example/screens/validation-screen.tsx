import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  isAvailableAsync,
  PhoneNumberHintErrorCodes,
  showPhoneNumberHintAsync,
} from "expo-phone-number-hint";

type ScenarioId = "availability" | "standard" | "dismiss" | "concurrency";

type ScenarioStatus = "idle" | "running" | "pass" | "fail" | "na";

type LogEntry = {
  id: number;
  timestamp: string;
  level: "info" | "pass" | "fail" | "warn";
  message: string;
};

type Scenario = {
  id: ScenarioId;
  title: string;
  description: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "availability",
    title: "Availability",
    description: "isAvailableAsync() returns boolean without throwing.",
  },
  {
    id: "standard",
    title: "Select number",
    description: "Pick a number. Passes when E.164 string is returned.",
  },
  {
    id: "dismiss",
    title: "Dismiss picker",
    description: "Dismiss without selecting. Passes when result is null.",
  },
  {
    id: "concurrency",
    title: "Concurrent requests",
    description:
      "Second call rejects with ERR_ALREADY_IN_PROGRESS while first stays active.",
  },
];

const STATUS_CONFIG: Record<
  ScenarioStatus,
  { label: string; color: string; bg: string }
> = {
  idle: { label: "Not run", color: "#6b7280", bg: "#f3f4f6" },
  running: { label: "Running", color: "#1d4ed8", bg: "#dbeafe" },
  pass: { label: "Pass", color: "#166534", bg: "#dcfce7" },
  fail: { label: "Fail", color: "#991b1b", bg: "#fee2e2" },
  na: { label: "N/A", color: "#92400e", bg: "#fef3c7" },
};

export default function ValidationScreen({ onBack }: { onBack: () => void }) {
  const [statuses, setStatuses] = useState<Record<ScenarioId, ScenarioStatus>>(
    () => ({
      availability: "idle",
      standard: "idle",
      dismiss: "idle",
      concurrency: "idle",
    }),
  );
  const [notes, setNotes] = useState<Record<ScenarioId, string>>(() => ({
    availability: "",
    standard: "",
    dismiss: "",
    concurrency: "",
  }));
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const anyRunning = useMemo(
    () => Object.values(statuses).some((s) => s === "running"),
    [statuses],
  );

  const update = (id: ScenarioId, status: ScenarioStatus, note: string) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  const log = (level: LogEntry["level"], message: string) => {
    setLogs((prev) =>
      [
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
        },
        ...prev,
      ].slice(0, 80),
    );
  };

  const run = async (id: ScenarioId) => {
    if (id === "availability") {
      update("availability", "running", "");
      log("info", "Checking availability...");
      try {
        const result = await isAvailableAsync();
        update("availability", "pass", `isAvailableAsync() → ${result}`);
        log("pass", `isAvailableAsync() → ${result}`);
      } catch (e: any) {
        update("availability", "fail", `${e.code}: ${e.message}`);
        log("fail", `${e.code}: ${e.message}`);
      }
    } else if (id === "standard") {
      update("standard", "running", "Waiting for selection...");
      log("info", "Showing picker...");
      try {
        const result = await showPhoneNumberHintAsync();
        if (result) {
          update("standard", "pass", result);
          log("pass", `Selected: ${result}`);
        } else {
          update("standard", "fail", "Picker dismissed (use Dismiss test)");
          log("fail", "Dismissed instead of selecting");
        }
      } catch (e: any) {
        update("standard", "fail", `${e.code}: ${e.message}`);
        log("fail", `${e.code}: ${e.message}`);
      }
    } else if (id === "dismiss") {
      update("dismiss", "running", "Dismiss the picker...");
      log("info", "Showing picker (dismiss it)...");
      try {
        const result = await showPhoneNumberHintAsync();
        if (result === null) {
          update("dismiss", "pass", "Received null");
          log("pass", "Dismissed → null");
        } else {
          update("dismiss", "fail", `Got number instead: ${result}`);
          log("fail", `Expected null, got: ${result}`);
        }
      } catch (e: any) {
        update("dismiss", "fail", `${e.code}: ${e.message}`);
        log("fail", `${e.code}: ${e.message}`);
      }
    } else if (id === "concurrency") {
      update("concurrency", "running", "Testing overlap...");
      log("info", "Starting concurrent requests...");

      const first = showPhoneNumberHintAsync();
      let secondError: { code: string; message: string } | null = null;

      try {
        await showPhoneNumberHintAsync();
      } catch (e: any) {
        secondError = { code: e.code, message: e.message };
      }

      if (secondError?.code === PhoneNumberHintErrorCodes.ALREADY_IN_PROGRESS) {
        const r1 = await first.catch((e: any) => ({
          code: e.code,
          message: e.message,
        }));
        const firstResult =
          typeof r1 === "string"
            ? `selected: ${r1}`
            : r1 === null
              ? "dismissed"
              : `error: ${r1.code}`;
        const note = `Second call rejected with ${PhoneNumberHintErrorCodes.ALREADY_IN_PROGRESS}. First call: ${firstResult}.`;
        update("concurrency", "pass", note);
        log("pass", note);
      } else {
        const note = secondError
          ? `Second call got ${secondError.code} instead of ${PhoneNumberHintErrorCodes.ALREADY_IN_PROGRESS}`
          : "Second call did not throw";
        update("concurrency", "fail", note);
        log("fail", note);
        await first.catch(() => {});
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Validation Matrix</Text>
          <Text style={styles.subtitle}>
            {Platform.OS} {Platform.Version}
          </Text>
        </View>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      {SCENARIOS.map((scenario) => {
        const status = statuses[scenario.id];
        const note = notes[scenario.id];
        const config = STATUS_CONFIG[status];

        return (
          <View key={scenario.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{scenario.title}</Text>
                <Text
                  style={[
                    styles.badge,
                    { color: config.color, backgroundColor: config.bg },
                  ]}
                >
                  {config.label}
                </Text>
              </View>
              <Text style={styles.cardDescription}>{scenario.description}</Text>
              {note !== "" && <Text style={styles.note}>{note}</Text>}
            </View>
            <Pressable
              style={[styles.runButton, anyRunning && styles.runButtonDisabled]}
              onPress={() => run(scenario.id)}
              disabled={anyRunning}
            >
              <Text style={styles.runButtonText}>Run</Text>
            </Pressable>
          </View>
        );
      })}

      <View style={styles.logSection}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Event log</Text>
          {logs.length > 0 && (
            <Pressable onPress={() => setLogs([])}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
        </View>
        {logs.length === 0 ? (
          <Text style={styles.emptyLog}>Run a scenario to see events.</Text>
        ) : (
          logs.map((entry) => (
            <Text
              key={entry.id}
              style={[
                styles.logLine,
                entry.level === "pass" && styles.logPass,
                entry.level === "fail" && styles.logFail,
                entry.level === "warn" && styles.logWarn,
              ]}
            >
              {entry.timestamp} {entry.message}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 10,
  },
  cardTop: {
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
  },
  cardDescription: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  note: {
    fontSize: 13,
    color: "#374151",
    marginTop: 2,
  },
  runButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  runButtonDisabled: {
    opacity: 0.4,
  },
  runButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  logSection: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6,
    marginTop: 4,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
  },
  emptyLog: {
    fontSize: 13,
    color: "#9ca3af",
  },
  logLine: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
    fontVariant: ["tabular-nums"],
  },
  logPass: {
    color: "#166534",
  },
  logFail: {
    color: "#991b1b",
  },
  logWarn: {
    color: "#92400e",
  },
});
