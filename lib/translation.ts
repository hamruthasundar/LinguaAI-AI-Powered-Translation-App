import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "translation_history";

const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
);

console.log("API Key Loaded:", !!process.env.EXPO_PUBLIC_GEMINI_API_KEY);

const languageMap: Record<string, string> = {
  en: "English",
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
  gu: "Gujarati",
  mr: "Marathi",
  ur: "Urdu",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  tr: "Turkish",
  ar: "Arabic",
  id: "Indonesian",
  vi: "Vietnamese",
  th: "Thai",
  "zh-CN": "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ru: "Russian",
};

export async function translateText(
  text: string,
  from: string,
  to: string,
): Promise<string> {
  try {
    const sourceLanguage = languageMap[from] || from;

    const targetLanguage = languageMap[to] || to;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Translate the following text.

Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}

Rules:
1. Return ONLY the translated text.
2. Do not explain.
3. Do not add quotation marks.
4. Preserve meaning and tone.
5. If the text is already in the target language, return it unchanged.

Text:
${text}
`;

    const result = await model.generateContent(prompt);

    const translated = result.response.text().trim();

    return translated;
  } catch (error) {
    console.error("Translation Error:", error);

    throw new Error("Unable to translate text");
  }
}

export async function saveTranslation(item: any) {
  const existing = await getHistory();

  const next = [
    {
      id: Date.now().toString(),
      ...item,
    },
    ...existing,
  ];

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export async function getHistory() {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);

  return raw ? JSON.parse(raw) : [];
}
