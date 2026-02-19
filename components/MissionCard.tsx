import Badge from "@/components/ui/Badge";
import type { Mission } from "@/types";
import { CATEGORIES } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar, MapPin, Users } from "lucide-react-native";
import React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

interface MissionCardProps {
  mission: Mission;
}

const CAUSE_TAGLINES: Record<string, string> = {
  "beach-cleanup": "Protégeons nos océans 🌊",
  "tree-planting": "Un arbre = un avenir 🌱",
  "zero-waste": "Moins de déchets, plus de vie ♻️",
  recycling: "Chaque geste compte 📦",
  education: "Inspirer les générations futures 📚",
};

export default function MissionCard({ mission }: MissionCardProps) {
  const router = useRouter();
  const spotsLeft = mission.spotsTotal - mission.spotsTaken;
  const categoryInfo = CATEGORIES.find((c) => c.key === mission.category);
  const spotsPercent = (mission.spotsTaken / mission.spotsTotal) * 100;

  const formattedDate = new Date(mission.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 20,
        marginHorizontal: 16,
        ...Platform.select({
          ios: {
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
          },
          android: {
            elevation: 8,
          },
        }),
      }}
      activeOpacity={0.92}
      onPress={() => router.push(`/mission/${mission.id}`)}
    >
      {/* Image with gradient overlay */}
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: mission.image }}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.65)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
          }}
        />

        {/* Spots overlay */}
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
              spotsLeft <= 3 ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Users size={12} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: "700",
              marginLeft: 5,
            }}
          >
            {spotsLeft <= 0 ? "Complet" : `${spotsLeft} places`}
          </Text>
        </View>

        {/* Category badge on image */}
        <View style={{ position: "absolute", bottom: 12, left: 16 }}>
          <Badge
            label={`${categoryInfo?.emoji || ""} ${categoryInfo?.label || mission.category}`}
            category={mission.category}
            size="md"
          />
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {/* Title */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#1E293B",
            letterSpacing: -0.2,
            lineHeight: 24,
          }}
          numberOfLines={2}
        >
          {mission.title}
        </Text>

        {/* Cause tagline */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#059669",
            marginTop: 4,
          }}
        >
          {CAUSE_TAGLINES[mission.category] || "Agissons ensemble 🌍"}
        </Text>

        {/* Meta info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
            gap: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                borderRadius: 8,
                padding: 4,
                marginRight: 6,
                backgroundColor: "#F0FDF4",
              }}
            >
              <Calendar size={12} color="#10B981" />
            </View>
            <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "500" }}>
              {formattedDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                borderRadius: 8,
                padding: 4,
                marginRight: 6,
                backgroundColor: "#FEF2F2",
              }}
            >
              <MapPin size={12} color="#EF4444" />
            </View>
            <Text
              style={{ fontSize: 13, color: "#64748B", fontWeight: "500" }}
              numberOfLines={1}
            >
              {mission.location}
            </Text>
          </View>
        </View>

        {/* Spots progress bar */}
        <View style={{ marginTop: 14 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: "#94A3B8",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Participants
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#475569" }}>
              <Text style={{ color: spotsLeft <= 3 ? "#EF4444" : "#10B981" }}>
                {mission.spotsTaken}
              </Text>
              /{mission.spotsTotal}
            </Text>
          </View>
          <View
            style={{
              height: 6,
              backgroundColor: "#F1F5F9",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                borderRadius: 3,
                width: `${spotsPercent}%`,
                backgroundColor: spotsLeft <= 3 ? "#EF4444" : "#10B981",
              }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
