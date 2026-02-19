import StatCard from "@/components/StatCard";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import {
    Award,
    ChevronRight,
    Clock,
    LogOut,
    TreePine,
} from "lucide-react-native";
import React from "react";
import { Alert, Image, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const impactRows = [
    {
      label: "Missions réalisées",
      value: `${user?.missionsCompleted || 0}`,
      color: "#10B981",
    },
    {
      label: "Heures de bénévolat",
      value: `${user?.hoursVolunteered || 0}h`,
      color: "#0EA5E9",
    },
    {
      label: "Arbres plantés",
      value: `${user?.treesPlanted || 0}`,
      color: "#22C55E",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* ── Gradient Profile Header ───────────────────── */}
      <LinearGradient
        colors={["#047857", "#059669", "#10B981", "#34D399"] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: 60,
          paddingHorizontal: 24,
          alignItems: "center",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        {/* Decorative circles */}
        <View
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: -20,
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Avatar */}
        <View
          style={{
            borderRadius: 50,
            padding: 3,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginBottom: 16,
          }}
        >
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/png?seed=default",
            }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              borderWidth: 3,
              borderColor: "#FFFFFF",
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: -0.3,
          }}
        >
          {user?.name || "Bénévole"}
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {user?.email}
        </Text>
      </LinearGradient>

      {/* ── Stats Cards ────────────────────────────────── */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          paddingHorizontal: 24,
          marginTop: -32,
        }}
      >
        <StatCard
          icon={<Award size={22} color="#10B981" />}
          value={user?.missionsCompleted || 0}
          label="Missions"
          color="#10B981"
        />
        <StatCard
          icon={<Clock size={22} color="#0EA5E9" />}
          value={user?.hoursVolunteered || 0}
          label="Heures"
          color="#0EA5E9"
        />
        <StatCard
          icon={<TreePine size={22} color="#22C55E" />}
          value={user?.treesPlanted || 0}
          label="Arbres"
          color="#22C55E"
        />
      </View>

      {/* ── Impact Section ──────────────────────────────── */}
      <View style={{ paddingHorizontal: 24, marginTop: 28 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#1E293B",
            marginBottom: 16,
            letterSpacing: -0.2,
          }}
        >
          Mon Impact
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            ...Platform.select({
              ios: {
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
              },
              android: { elevation: 4 },
            }),
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#94A3B8",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Votre contribution
          </Text>

          {impactRows.map((row, index) => (
            <View key={row.label}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#475569",
                    fontWeight: "500",
                  }}
                >
                  {row.label}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: row.color,
                      fontWeight: "800",
                      fontSize: 16,
                      marginRight: 4,
                    }}
                  >
                    {row.value}
                  </Text>
                  <ChevronRight size={16} color="#CBD5E1" />
                </View>
              </View>
              {index < impactRows.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F1F5F9",
                  }}
                />
              )}
            </View>
          ))}
        </View>

        {/* Logout */}
        <View style={{ marginTop: 8 }}>
          <Button
            title="Se déconnecter"
            variant="danger"
            onPress={handleLogout}
            icon={<LogOut size={18} color="#FFFFFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
