import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "translation_history";

export const saveTranslation = async (translation: any) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);

    const history = existing ? JSON.parse(existing) : [];

    history.unshift(translation);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.log(error);
  }
};

export const getHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
