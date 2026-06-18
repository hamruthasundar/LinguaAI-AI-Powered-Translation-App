import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

// Adjust this path only if your project stores getHistory elsewhere.
import { getHistory } from "@/lib/translation";

type TranslationHistoryItem = {
  id?: string;
  input?: string;
  originalText?: string;
  translatedText?: string;
  result?: string;
  fromLanguage?: string;
  toLanguage?: string;
  from?: string;
  to?: string;
  createdAt?: string | number;
};

const theme = {
  accent: "#FF5C7A",
  text: "#2D2545",
  muted: "#81779D",
  bg1: "#D7D0F7",
  bg2: "#CFC8F4",
  bg3: "#BEB5ED",
};

function normalizeHistoryItem(item: TranslationHistoryItem, index: number) {
  return {
    id: item.id ?? `${item.createdAt ?? index}`,
    input: item.input ?? item.originalText ?? "",
    result: item.translatedText ?? item.result ?? "",
    from: item.fromLanguage ?? item.from ?? "",
    to: item.toLanguage ?? item.to ?? "",
  };
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    const items = await getHistory();
    setHistory(Array.isArray(items) ? items : []);
  }, []);

  useEffect(() => {
    loadHistory().catch(() => undefined);
  }, [loadHistory]);

  const normalizedHistory = history.map(normalizeHistoryItem);

  return (
    <LinearGradient
      colors={[theme.bg1, theme.bg2, theme.bg3]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>
              Your recent translations, saved locally.
            </Text>
          </View>

          <FlatList
            data={normalizedHistory}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Ionicons name="time-outline" size={34} color={theme.accent} />
                <Text style={styles.emptyTitle}>No translations yet</Text>
                <Text style={styles.emptyCopy}>
                  Saved translations will appear here after you translate text.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <View style={styles.cardTop}>
                  <Text style={styles.languageMeta}>
                    {item.from} → {item.to}
                  </Text>
                  <View style={styles.iconBubble}>
                    <Ionicons
                      name="bookmark-outline"
                      size={17}
                      color={theme.accent}
                    />
                  </View>
                </View>
                <Text style={styles.inputText}>{item.input}</Text>
                <Text style={styles.resultText}>{item.result}</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: theme.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: "rgba(45,37,69,0.68)",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },
  list: {
    paddingBottom: 126,
    gap: 14,
  },
  historyCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    padding: 18,
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  languageMeta: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "900",
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.68)",
  },
  inputText: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 24,
  },
  resultText: {
    color: theme.muted,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 10,
  },
  emptyCard: {
    minHeight: 260,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    marginTop: 28,
  },
  emptyTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
  },
  emptyCopy: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
});
