import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  history: any[];
};

export default function HistoryList({ history }: Props) {
  return (
    <View>
      <Text style={styles.title}>🕘 Recent Translations</Text>

      {history.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text>
            {item.from} → {item.to}
          </Text>

          <Text>{item.input}</Text>

          <Text>{item.output}</Text>
        </View>
      ))}

      {history.length === 0 ? (
        <Text style={styles.emptyText}>No translations yet 🚀</Text>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text>
              {item.from} → {item.to}
            </Text>

            <Text style={styles.lang}>
              🌍 {item.from} → 🌎 {item.to}
            </Text>
            <Text>{item.input}</Text>

            <Text>{item.output}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",

    padding: 14,

    borderRadius: 18,

    marginBottom: 12,
  },

  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
  },

  lang: {
    fontWeight: "bold",
    marginBottom: 6,
  },
});
