import type { Category } from "@/types";
import { CATEGORIES } from "@/types";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CategoryFilterProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <View style={{ height: 52, marginBottom: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 10,
          alignItems: "center",
        }}
        style={{ flex: 1 }}
      >
        {/* All filter */}
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 50,
            backgroundColor: selected === null ? "#10B981" : "#FFFFFF",
            borderWidth: selected === null ? 0 : 1.5,
            borderColor: selected === null ? "transparent" : "#E2E8F0",
            ...Platform.select({
              ios: {
                shadowColor: selected === null ? "#059669" : "#64748B",
                shadowOffset: { width: 0, height: selected === null ? 4 : 1 },
                shadowOpacity: selected === null ? 0.35 : 0.08,
                shadowRadius: selected === null ? 8 : 4,
              },
              android: {
                elevation: selected === null ? 6 : 2,
              },
            }),
          }}
          onPress={() => onSelect(null)}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: selected === null ? "#FFFFFF" : "#475569",
            }}
          >
            🌍 Tous
          </Text>
        </TouchableOpacity>

        {/* Category pills */}
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 50,
                backgroundColor: isActive ? cat.color : "#FFFFFF",
                borderWidth: isActive ? 0 : 1.5,
                borderColor: isActive ? "transparent" : `${cat.color}30`,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                ...Platform.select({
                  ios: {
                    shadowColor: isActive ? cat.color : "#64748B",
                    shadowOffset: { width: 0, height: isActive ? 4 : 1 },
                    shadowOpacity: isActive ? 0.35 : 0.08,
                    shadowRadius: isActive ? 8 : 4,
                  },
                  android: {
                    elevation: isActive ? 6 : 2,
                  },
                }),
              }}
              onPress={() => onSelect(isActive ? null : cat.key)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: isActive ? "#FFFFFF" : "#475569",
                }}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
