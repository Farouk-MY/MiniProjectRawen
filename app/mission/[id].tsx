import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMission } from "@/hooks/useMissions";
import {
    useCancelParticipation,
    useJoinMission,
    useMyParticipations,
} from "@/hooks/useParticipations";
import { CATEGORIES } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    MapPin,
    Share2,
    Users,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();

  const { data: mission, isLoading, isError, refetch } = useMission(id);
  const { data: participations } = useMyParticipations(user?.id || "");
  const joinMutation = useJoinMission();
  const cancelMutation = useCancelParticipation();

  const serverParticipation = useMemo(
    () => participations?.find((p) => p.missionId === id),
    [participations, id],
  );

  const [localJoined, setLocalJoined] = useState<boolean | null>(null);

  useEffect(() => {
    setLocalJoined(null);
  }, [serverParticipation?.id]);

  const isJoined = localJoined !== null ? localJoined : !!serverParticipation;
  const isMutating = joinMutation.isPending || cancelMutation.isPending;
  const spotsLeft = mission ? mission.spotsTotal - mission.spotsTaken : 0;
  const isFull = spotsLeft <= 0 && !isJoined;
  const categoryInfo = CATEGORIES.find((c) => c.key === mission?.category);

  const formattedDate = mission
    ? new Date(mission.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formattedTime = mission
    ? new Date(mission.date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleJoin = () => {
    if (!user || !mission || isMutating || isJoined) return;

    if (isFull) {
      Alert.alert("Complet", "Cette mission n'a plus de places disponibles");
      return;
    }

    setLocalJoined(true);

    joinMutation.mutate(
      { userId: user.id, missionId: mission.id },
      {
        onError: () => {
          setLocalJoined(false);
          Alert.alert("Erreur", "Impossible de s'inscrire à cette mission.");
        },
      },
    );
  };

  const handleCancel = () => {
    if (!user || !serverParticipation || !mission || isMutating) return;

    Alert.alert(
      "Annuler la participation",
      "Êtes-vous sûr de vouloir annuler votre participation ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: () => {
            setLocalJoined(false);

            cancelMutation.mutate(
              {
                participationId: serverParticipation.id,
                missionId: mission.id,
                userId: user.id,
              },
              {
                onError: () => {
                  setLocalJoined(true);
                  Alert.alert(
                    "Erreur",
                    "Impossible d'annuler la participation.",
                  );
                },
              },
            );
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (isError || !mission) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}
      >
        <ErrorState
          message="Impossible de charger cette mission"
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const spotsPercent = Math.min(
    100,
    (mission.spotsTaken / mission.spotsTotal) * 100,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Image ───────────────────────────────── */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: mission.image }}
            style={{ width: "100%", height: 340 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* Back button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: insets.top + 8,
              left: 16,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 10,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                },
                android: { elevation: 6 },
              }),
            }}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>

          {/* Share button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: insets.top + 8,
              right: 16,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 10,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                },
                android: { elevation: 6 },
              }),
            }}
            activeOpacity={0.8}
          >
            <Share2 size={22} color="#1E293B" />
          </TouchableOpacity>

          {/* Bottom info overlay */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 24,
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Badge
                label={categoryInfo?.label || mission.category}
                category={mission.category}
                size="md"
              />
              {isJoined && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#10B981",
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <CheckCircle2 size={14} color="#FFFFFF" />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "700",
                      marginLeft: 4,
                    }}
                  >
                    Inscrit
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#FFFFFF",
                lineHeight: 30,
                letterSpacing: -0.3,
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowRadius: 6,
                textShadowOffset: { width: 0, height: 2 },
              }}
            >
              {mission.title}
            </Text>
          </View>
        </View>

        {/* ── Content ──────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Organizer */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderRadius: 12,
                padding: 8,
              }}
            >
              <Building2 size={16} color="#10B981" />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: "#475569",
                marginLeft: 10,
                fontWeight: "600",
              }}
            >
              {mission.organizer}
            </Text>
          </View>

          {/* ── Info Grid ────────────────────────────────── */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            {/* Date */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: 16,
                alignItems: "center",
                borderTopWidth: 3,
                borderTopColor: "#10B981",
                ...Platform.select({
                  ios: {
                    shadowColor: "#10B981",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                  },
                  android: { elevation: 4 },
                }),
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 14,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Calendar size={20} color="#10B981" />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Date
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#1E293B",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {formattedDate}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#10B981",
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                {formattedTime}
              </Text>
            </View>

            {/* Duration */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: 16,
                alignItems: "center",
                borderTopWidth: 3,
                borderTopColor: "#0EA5E9",
                ...Platform.select({
                  ios: {
                    shadowColor: "#0EA5E9",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                  },
                  android: { elevation: 4 },
                }),
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0F9FF",
                  borderRadius: 14,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Clock size={20} color="#0EA5E9" />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Durée
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#1E293B",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {mission.duration}
              </Text>
            </View>

            {/* Spots */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: 16,
                alignItems: "center",
                borderTopWidth: 3,
                borderTopColor: "#8B5CF6",
                ...Platform.select({
                  ios: {
                    shadowColor: "#8B5CF6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                  },
                  android: { elevation: 4 },
                }),
              }}
            >
              <View
                style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: 14,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Users size={20} color="#8B5CF6" />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Places
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#1E293B",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {spotsLeft} restantes
              </Text>
            </View>
          </View>

          {/* Location Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 16,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              borderLeftWidth: 4,
              borderLeftColor: "#EF4444",
              ...Platform.select({
                ios: {
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                },
                android: { elevation: 3 },
              }),
            }}
          >
            <View
              style={{
                backgroundColor: "#FEF2F2",
                borderRadius: 14,
                padding: 12,
              }}
            >
              <MapPin size={22} color="#EF4444" />
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Lieu
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#1E293B",
                  marginTop: 2,
                }}
              >
                {mission.location}
              </Text>
            </View>
          </View>

          {/* Participants Progress */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 20,
              marginBottom: 20,
              ...Platform.select({
                ios: {
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                },
                android: { elevation: 3 },
              }),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#475569" }}
              >
                Participants
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "800", color: "#1E293B" }}
              >
                <Text style={{ color: "#10B981" }}>{mission.spotsTaken}</Text>/
                {mission.spotsTotal}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#F1F5F9",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  borderRadius: 4,
                  backgroundColor: spotsLeft <= 3 ? "#EF4444" : "#10B981",
                  width: `${spotsPercent}%`,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: "#94A3B8",
                marginTop: 10,
                fontWeight: "500",
              }}
            >
              {spotsLeft <= 3 && spotsLeft > 0
                ? "⚡ Dépêchez-vous, il reste peu de places !"
                : isFull
                  ? "😔 Cette mission est complète"
                  : `🌿 ${spotsLeft} places disponibles`}
            </Text>
          </View>

          {/* Why Participate */}
          <View
            style={{
              backgroundColor: "#ECFDF5",
              borderRadius: 24,
              padding: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#A7F3D0",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#065F46",
                marginBottom: 8,
                letterSpacing: -0.2,
              }}
            >
              💚 Pourquoi participer ?
            </Text>
            <Text style={{ fontSize: 14, color: "#047857", lineHeight: 22 }}>
              {mission.description.split("\n")[0]}
            </Text>
          </View>

          {/* Full Description */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#1E293B",
                marginBottom: 12,
                letterSpacing: -0.2,
              }}
            >
              📋 À propos de cette mission
            </Text>
            <Text style={{ fontSize: 15, color: "#475569", lineHeight: 24 }}>
              {mission.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ──────────────────────────── */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(255,255,255,0.97)",
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
          ...Platform.select({
            ios: {
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
            },
            android: { elevation: 12 },
          }),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 11,
                color: "#94A3B8",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Durée
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#1E293B",
                marginTop: 2,
              }}
            >
              {mission.duration}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            {isJoined ? (
              <Button
                title="Annuler ma participation"
                variant="danger"
                size="lg"
                onPress={handleCancel}
                isLoading={cancelMutation.isPending}
                disabled={isMutating}
              />
            ) : (
              <Button
                title={isFull ? "Complet" : "Participer 🌱"}
                variant="primary"
                size="lg"
                onPress={handleJoin}
                isLoading={joinMutation.isPending}
                disabled={isFull || isMutating}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
