import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Keep these wired to your existing project files.
// Adjust only the paths if your app does not use the @ alias.
import { getHistory, saveTranslation, translateText } from "@/lib/translation";

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

type Language = {
  label: string;
  code: string;
};

const theme = {
  primary: "#B9A9F3",
  secondary: "#D7D0F7",
  accent: "#FF5C7A",
  text: "#2D2545",
  muted: "#81779D",
  bg1: "#D7D0F7",
  bg2: "#CFC8F4",
  bg3: "#BEB5ED",
  glass: "rgba(255,255,255,0.65)",
  glassStrong: "rgba(255,255,255,0.82)",
};

const languages: Language[] = [
  { label: "English", code: "en" },
  { label: "Tamil", code: "ta" },
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "Hindi", code: "hi" },
  { label: "Telugu", code: "te" },
  { label: "Malayalam", code: "ml" },
  { label: "Kannada", code: "kn" },
  { label: "Bengali", code: "bn" },
  { label: "Gujarati", code: "gu" },
  { label: "Marathi", code: "mr" },
  { label: "Urdu", code: "ur" },
  { label: "German", code: "de" },
  { label: "Italian", code: "it" },
  { label: "Portuguese", code: "pt" },
  { label: "Dutch", code: "nl" },
  { label: "Turkish", code: "tr" },
  { label: "Arabic", code: "ar" },
  { label: "Indonesian", code: "id" },
  { label: "Vietnamese", code: "vi" },
  { label: "Thai", code: "th" },
  { label: "Chinese", code: "zh-CN" },
  { label: "Japanese", code: "ja" },
  { label: "Korean", code: "ko" },
  { label: "Russian", code: "ru" },
];

function normalizeHistoryItem(item: TranslationHistoryItem, index: number) {
  return {
    id: item.id ?? `${item.createdAt ?? index}`,
    input: item.input ?? item.originalText ?? "",
    result: item.translatedText ?? item.result ?? "",
    from: item.fromLanguage ?? item.from ?? "",
    to: item.toLanguage ?? item.to ?? "",
  };
}

export default function TranslateScreen() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState<Language>(languages[1]);
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const previewHistory = useMemo(
    () => history.slice(0, 3).map(normalizeHistoryItem),
    [history],
  );

  const handleCopy = async () => {
    if (!translatedText.trim()) return;

    await Clipboard.setStringAsync(translatedText);

    Alert.alert("Copied", "Translation copied to clipboard.");
  };

  const refreshHistory = useCallback(async () => {
    const items = await getHistory();
    setHistory(Array.isArray(items) ? items : []);
  }, []);

  useEffect(() => {
    refreshHistory().catch(() => undefined);
  }, [refreshHistory]);

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText || inputText);
    setTranslatedText(inputText && translatedText ? inputText : "");
  };

  const handleSpeak = () => {
    if (!translatedText.trim()) return;

    Speech.speak(translatedText, {
      language: targetLanguage.code,
      pitch: 1,
      rate: 0.9,
    });
  };

  const handleTranslate = async () => {
    const text = inputText.trim();

    if (!text) {
      Alert.alert("Add text", "Type or paste something to translate.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await translateText(
        text,
        sourceLanguage.code,
        targetLanguage.code,
      );
      setTranslatedText(result);

      await saveTranslation({
        input: text,
        translatedText: result,
        fromLanguage: sourceLanguage.label,
        toLanguage: targetLanguage.label,
        createdAt: new Date().toISOString(),
      });

      await refreshHistory();
    } catch (error) {
      Alert.alert("Translation failed", "Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.bg1, theme.bg2, theme.bg3]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Hi, Hamru!</Text>
                <Text style={styles.subtitle}>
                  What would you like to translate today?
                </Text>
              </View>

              <LinearGradient
                colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.58)"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>H</Text>
              </LinearGradient>
            </View>

            <View style={styles.languageCard}>
              <LanguageDropdown
                label="From"
                value={sourceLanguage.code}
                onChange={(code) => {
                  const selected = languages.find(
                    (language) => language.code === code,
                  );
                  if (selected) setSourceLanguage(selected);
                }}
              />

              <Pressable
                style={styles.swapButton}
                onPress={handleSwapLanguages}
              >
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={24}
                  color={theme.accent}
                />
              </Pressable>

              <LanguageDropdown
                label="To"
                value={targetLanguage.code}
                onChange={(code) => {
                  const selected = languages.find(
                    (language) => language.code === code,
                  );
                  if (selected) setTargetLanguage(selected);
                }}
              />
            </View>

            <View style={styles.cardStack}>
              <View style={styles.inputCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Input</Text>

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable style={styles.speakGhost} onPress={handleCopy}>
                      <Ionicons
                        name="copy-outline"
                        size={18}
                        color={theme.muted}
                      />
                    </Pressable>

                    <Pressable style={styles.speakGhost} onPress={handleSpeak}>
                      <Ionicons
                        name="volume-medium-outline"
                        size={18}
                        color={theme.muted}
                      />
                    </Pressable>
                  </View>
                </View>

                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type or paste text here..."
                  placeholderTextColor="rgba(45,37,69,0.38)"
                  multiline
                  textAlignVertical="top"
                  style={styles.input}
                />

                <View style={styles.inputFooter}>
                  <Text style={styles.counter}>
                    {inputText.length} characters
                  </Text>
                  <View style={styles.microActions}>
                    <Pressable style={styles.roundTool}>
                      <Ionicons
                        name="clipboard-outline"
                        size={17}
                        color={theme.text}
                      />
                    </Pressable>
                    <Pressable style={styles.roundTool}>
                      <Ionicons
                        name="mic-outline"
                        size={17}
                        color={theme.text}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.translateFabShadow,
                  pressed && styles.translateFabPressed,
                ]}
                onPress={handleTranslate}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#FF6E89", theme.accent, "#E449AE"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.translateFab}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="translate"
                      size={30}
                      color="#FFFFFF"
                    />
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Translation</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable style={styles.speakGhost} onPress={handleCopy}>
                      <Ionicons
                        name="copy-outline"
                        size={18}
                        color={theme.muted}
                      />
                    </Pressable>

                    <Pressable style={styles.speakGhost} onPress={handleSpeak}>
                      <Ionicons
                        name="volume-medium-outline"
                        size={18}
                        color={theme.muted}
                      />
                    </Pressable>
                  </View>
                </View>

                {translatedText ? (
                  <Text style={styles.resultText}>{translatedText}</Text>
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <MaterialCommunityIcons
                        name="creation-outline"
                        size={28}
                        color={theme.accent}
                      />
                    </View>
                    <Text style={styles.emptyTitle}>
                      Your translation will appear here
                    </Text>
                    <Text style={styles.emptyCopy}>
                      Enter text above and tap the floating translate button.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Recent translations</Text>
              <Pressable onPress={() => router.push("/history")}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>

            {previewHistory.length > 0 ? (
              <>
                <FlatList
                  data={previewHistory}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.historyStrip}
                  renderItem={({ item }) => (
                    <View style={styles.historyCard}>
                      <Text numberOfLines={1} style={styles.historyMeta}>
                        {item.from} → {item.to}
                      </Text>
                      <Text numberOfLines={2} style={styles.historyInput}>
                        {item.input}
                      </Text>
                      <Text numberOfLines={2} style={styles.historyOutput}>
                        {item.result}
                      </Text>
                    </View>
                  )}
                />
              </>
            ) : (
              <View style={styles.historyEmpty}>
                <Ionicons name="time-outline" size={22} color={theme.muted} />
                <Text style={styles.historyEmptyText}>
                  No saved translations yet.
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function LanguageDropdown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.dropdownLabel}>{label}</Text>

      <Picker
        selectedValue={value}
        onValueChange={onChange}
        dropdownIconColor={theme.accent}
        style={styles.picker}
      >
        {languages.map((language) => (
          <Picker.Item
            key={language.code}
            label={language.label}
            value={language.code}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 128,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  greeting: {
    color: theme.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0,
  },
  subtitle: {
    color: "rgba(45,37,69,0.66)",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
    maxWidth: 260,
    lineHeight: 21,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    color: theme.text,
    fontSize: 19,
    fontWeight: "900",
  },
  languageCard: {
    minHeight: 86,
    borderRadius: 28,
    backgroundColor: theme.glass,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.56)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 12,
  },

  languageLabel: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "800",
  },
  languageCode: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  swapButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
    marginHorizontal: 10,
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  cardStack: {
    marginTop: 18,
    alignItems: "center",
  },
  inputCard: {
    width: "100%",
    minHeight: 230,
    borderRadius: 30,
    backgroundColor: theme.glass,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    padding: 18,
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  resultCard: {
    width: "100%",
    minHeight: 214,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    padding: 18,
    paddingTop: 38,
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  cardHeader: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "900",
  },
  tinyAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.62)",
  },
  input: {
    flex: 1,
    color: theme.text,
    fontSize: 21,
    fontWeight: "700",
    lineHeight: 30,
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 122,
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  microActions: {
    flexDirection: "row",
    gap: 10,
  },
  roundTool: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  translateFabShadow: {
    width: 74,
    height: 74,
    borderRadius: 37,
    marginTop: -16,
    marginBottom: -18,
    zIndex: 2,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.36,
    shadowRadius: 22,
    elevation: 18,
  },
  translateFabPressed: {
    transform: [{ scale: 0.96 }],
  },
  translateFab: {
    flex: 1,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.45)",
  },
  speakGhost: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.52)",
  },
  resultText: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 31,
    marginTop: 12,
  },
  emptyState: {
    flex: 1,
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.68)",
    marginBottom: 12,
  },
  emptyTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyCopy: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },

  sectionTitle: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "900",
  },
  sectionCopy: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 5,
  },

  historyHeader: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAll: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "900",
  },
  historyStrip: {
    paddingTop: 12,
    paddingBottom: 4,
    gap: 12,
  },
  historyCard: {
    width: 210,
    minHeight: 132,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    padding: 15,
  },
  historyMeta: {
    color: theme.accent,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
  },
  historyInput: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  historyOutput: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8,
  },
  historyEmpty: {
    marginTop: 12,
    height: 86,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.48)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.56)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  historyEmptyText: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  hiddenCompatibility: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },

  dropdownWrap: {
    flex: 1,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.56)",
    overflow: "hidden",
    justifyContent: "center",
  },

  dropdownLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 14,
    marginBottom: -4,
    textTransform: "uppercase",
  },

  picker: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "800",
  },
});
