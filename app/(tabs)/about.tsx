import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const theme = {
  primary: "#B9A9F3",
  accent: "#FF5C7A",
  text: "#2D2545",
  muted: "#81779D",
  bg1: "#D7D0F7",
  bg2: "#CFC8F4",
  bg3: "#BEB5ED",
};

const user = {
  name: "Hamrutha",
  joinedAt: "17/06/2026",
  dob: "24/04/2007",
  languagesKnown: ["Tamil", "English"],
};

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={[theme.bg1, theme.bg2, theme.bg3]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>About</Text>
              <Text style={styles.subtitle}>
                Your LinguaAI profile details.
              </Text>
            </View>

            <View style={styles.profileCard}>
              <LinearGradient
                colors={["rgba(255,255,255,0.96)", "rgba(255,255,255,0.58)"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>H</Text>
              </LinearGradient>

              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.role}>LinguaAI user</Text>

              <View style={styles.divider} />

              <InfoRow
                icon={
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={theme.accent}
                  />
                }
                label="Joined"
                value={user.joinedAt}
              />
              <InfoRow
                icon={
                  <Ionicons
                    name="gift-outline"
                    size={20}
                    color={theme.accent}
                  />
                }
                label="DOB"
                value={user.dob}
              />
              <InfoRow
                icon={
                  <MaterialCommunityIcons
                    name="translate"
                    size={20}
                    color={theme.accent}
                  />
                }
                label="Languages known"
                value={user.languagesKnown.join(", ")}
              />
            </View>

            <View style={styles.preferenceCard}>
              <View style={styles.preferenceIcon}>
                <Ionicons name="sparkles-outline" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>
                  Personalized translations
                </Text>
                <Text style={styles.preferenceCopy}>
                  LinguaAI can prioritize Tamil and English as your most
                  familiar languages.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
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
    paddingBottom: 126,
  },
  header: {
    marginBottom: 20,
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
  profileCard: {
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.64)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    padding: 22,
    alignItems: "center",
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.76)",
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  avatarText: {
    color: theme.text,
    fontSize: 38,
    fontWeight: "900",
  },
  name: {
    color: theme.text,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 16,
  },
  role: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(45,37,69,0.08)",
    marginVertical: 20,
  },
  infoRow: {
    width: "100%",
    minHeight: 64,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.52)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 3,
  },
  preferenceCard: {
    marginTop: 16,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.56)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.58)",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.accent,
    marginRight: 14,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "900",
  },
  preferenceCopy: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 4,
  },
});
