import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

const colors = {
  primary: "#B9A9F3",
  secondary: "#D7D0F7",
  accent: "#FF5C7A",
  text: "#2D2545",
  muted: "#8F86A8",
  glass: "rgba(255,255,255,0.72)",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={styles.androidGlass} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Translate",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <MaterialCommunityIcons
                name="translate"
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons name="time-outline" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons name="person-circle-outline" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 20,
    height: 76,
    borderTopWidth: 0,
    borderRadius: 28,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 18 : 12,
    backgroundColor: "transparent",
    shadowColor: "#6D5DA8",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 18,
    overflow: "hidden",
  },
  androidGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.glass,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  item: {
    borderRadius: 22,
  },
  iconWrap: {
    width: 42,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  iconWrapActive: {
    backgroundColor: "rgba(255,92,122,0.12)",
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
});
