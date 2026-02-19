import React from "react";
import { Platform, Text, View } from "react-native";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

export default function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        borderTopWidth: 3,
        borderTopColor: color,
        ...Platform.select({
          ios: {
            shadowColor: color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          },
          android: {
            elevation: 4,
          },
        }),
      }}
    >
      <View
        style={{
          borderRadius: 14,
          padding: 10,
          marginBottom: 8,
          backgroundColor: `${color}15`,
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          color: "#1E293B",
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: "#64748B",
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
