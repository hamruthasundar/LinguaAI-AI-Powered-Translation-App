import * as Speech from "expo-speech";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  text: string;
};

export default function SpeakButton({ text }: Props) {
  const handleSpeak = () => {
    if (text.trim()) {
      Speech.speak(text);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSpeak}>
      <Text style={styles.text}>🔊 Speak</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
