import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MissionCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMission } from "@/hooks/useMissions";
import {
    useCancelParticipation,
    useMyParticipations,
} from "@/hooks/useParticipations";
import type { Participation } from "@/types";
import { CATEGORIES } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Calendar, CalendarCheck, MapPin, X } from "lucide-react-native";
import React, { useCallback } from "react";
import {
    Alert,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ParticipationCard({
  participation,
}: {
  participation: Participation;
}) {
  const router = useRouter();
  const { user } = useAuthContext();
  const cancelMutation = useCancelParticipation();
  const { data: mission, isLoading } = useMission(participation.missionId);

  const handleCancel = () => {
    Alert.alert(
      "Annuler la participation",
      "Êtes-vous sûr de vouloir annuler votre participation à cette mission ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: () => {
            if (user) {
              cancelMutation.mutate({
                participationId: participation.id,
                missionId: participation.missionId,
                userId: user.id,
              });
            }
          },
        },
      ],
    );
  };

  if (isLoading || !mission) {
    return <MissionCardSkeleton />;
  }

  const categoryInfo = CATEGORIES.find((c) => c.key === mission.category);
  const formattedDate = new Date(mission.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
        marginHorizontal: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#10B981",
        ...Platform.select({
          ios: {
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
          },
          android: { elevation: 5 },
        }),
      }}
      activeOpacity={0.9}
      onPress={() => router.push(`/mission/${mission.id}`)}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: mission.image }}
          style={{ width: 110, height: "100%" }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, padding: 14 }}>
          <Badge
            label={categoryInfo?.label || mission.category}
            category={mission.category}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#1E293B",
              marginTop: 6,
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {mission.title}
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderRadius: 6,
                padding: 3,
                marginRight: 6,
              }}
            >
              <Calendar size={12} color="#10B981" />
            </View>
            <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }}>
              {formattedDate}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            <View
              style={{
                backgroundColor: "#FEF2F2",
                borderRadius: 6,
                padding: 3,
                marginRight: 6,
              }}
            >
              <MapPin size={12} color="#EF4444" />
            </View>
            <Text
              style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }}
              numberOfLines={1}
            >
              {mission.location}
            </Text>
          </View>
        </View>

        {/* Cancel button */}
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 12,
          }}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 12,
              padding: 8,
              borderWidth: 1,
              borderColor: "#FECACA",
            }}
          >
            <X size={16} color="#EF4444" />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function MyMissionsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const {
    data: participations,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useMyParticipations(user?.id || "");

  const renderItem = useCallback(
    ({ item }: { item: Participation }) => (
      <ParticipationCard participation={item} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Participation) => item.id, []);

  return (
    <View className="flex-1 bg-slate-50">
      {/* ── Gradient Header ──────────────────────── */}
      <LinearGradient
        colors={["#047857", "#059669", "#10B981"] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 20,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        {/* Decorative circle */}
        <View
          style={{
            position: "absolute",
            top: -15,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: 10,
            }}
          >
            <CalendarCheck size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: -0.3,
              }}
            >
              Mes Missions
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}
            >
              {participations?.length || 0} mission(s) en cours
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flex: 1, paddingTop: 16 }}>
        {isLoading ? (
          <View style={{ flex: 1 }}>
            {[1, 2, 3].map((i) => (
              <MissionCardSkeleton key={i} />
            ))}
          </View>
        ) : isError ? (
          <ErrorState
            message={
              (error as Error)?.message || "Impossible de charger vos missions"
            }
            onRetry={() => refetch()}
          />
        ) : participations && participations.length === 0 ? (
          <EmptyState
            title="Aucune mission"
            description="Explorez et inscrivez-vous à des missions pour les retrouver ici !"
          />
        ) : (
          <FlatList
            data={participations}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                tintColor="#10B981"
                colors={["#10B981"]}
              />
            }
          />
        )}
      </View>
    </View>
  );
}
