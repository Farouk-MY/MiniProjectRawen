import CategoryFilter from "@/components/CategoryFilter";
import MissionCard from "@/components/MissionCard";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MissionCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMissions } from "@/hooks/useMissions";
import type { Category, Mission } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { Leaf, TrendingUp } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { FlatList, Platform, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: missions,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useMissions(selectedCategory ?? undefined, searchQuery);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderMission = useCallback(
    ({ item }: { item: Mission }) => <MissionCard mission={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Mission) => item.id, []);

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
        {/* Decorative circles */}
        <View
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -10,
            left: -15,
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Bonjour 👋
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: -0.3,
                marginTop: 2,
              }}
            >
              {user?.name || "Bénévole"}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: 10,
            }}
          >
            <Leaf size={24} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      {/* ── Eco Impact Banner ───────────────────── */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 16,
          borderRadius: 20,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ECFDF5",
          borderWidth: 1,
          borderColor: "#A7F3D0",
          ...Platform.select({
            ios: {
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: { elevation: 3 },
          }),
        }}
      >
        <View
          style={{
            backgroundColor: "#10B981",
            borderRadius: 14,
            padding: 10,
            marginRight: 12,
          }}
        >
          <TrendingUp size={18} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#065F46",
            }}
          >
            🌍 Ensemble, faisons la différence
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#047857",
              marginTop: 2,
            }}
          >
            {missions?.length || 0} missions disponibles près de chez vous
          </Text>
        </View>
      </View>

      {/* Search */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Category Filter */}
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Mission List */}
      {isLoading ? (
        <View className="flex-1">
          {[1, 2, 3].map((i) => (
            <MissionCardSkeleton key={i} />
          ))}
        </View>
      ) : isError ? (
        <ErrorState
          message={
            (error as Error)?.message || "Impossible de charger les missions"
          }
          onRetry={handleRefresh}
        />
      ) : missions && missions.length === 0 ? (
        <EmptyState
          title="Aucune mission trouvée"
          description="Essayez de modifier vos filtres ou votre recherche"
        />
      ) : (
        <FlatList
          data={missions}
          renderItem={renderMission}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#10B981"
              colors={["#10B981"]}
            />
          }
        />
      )}
    </View>
  );
}
