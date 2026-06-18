export const translateText = async (
  text: string,
  fromLanguage: string,
  toLanguage: string,
) => {
  try {
    const response = await fetch(
      "https://translate.argosopentech.com/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: fromLanguage,
          target: toLanguage,
          format: "text",
        }),
      },
    );

    const data = await response.json();

    console.log("TRANSLATION RESPONSE:", data);

    return data.translatedText || "Translation failed.";
  } catch (error) {
    console.log("TRANSLATION ERROR:", error);
    return "Translation failed.";
  }
};
