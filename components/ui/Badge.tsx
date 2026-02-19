import type { Category } from "@/types";
import React from "react";
import { Platform, Text, View } from "react-native";

interface BadgeProps {
  label: string;
  category?: Category | string;
  size?: "sm" | "md";
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "beach-cleanup": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "tree-planting": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "zero-waste": { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  recycling: { bg: "#FDF2F8", text: "#BE185D", border: "#FBCFE8" },
  education: { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF" },
};

const DEFAULT_COLORS = { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };

export default function Badge({ label, category, size = "sm" }: BadgeProps) {
  const colors = category
    ? CATEGORY_COLORS[category] || DEFAULT_COLORS
    : DEFAULT_COLORS;

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 50,
        paddingHorizontal: size === "md" ? 14 : 10,
        paddingVertical: size === "md" ? 6 : 4,
        alignSelf: "flex-start",
        ...Platform.select({
          ios: {
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          },
          android: { elevation: 1 },
        }),
      }}
    >
      <Text
        style={{
          fontSize: size === "md" ? 13 : 11,
          fontWeight: "700",
          color: colors.text,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
