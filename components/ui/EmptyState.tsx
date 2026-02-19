import { Inbox } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingVertical: 64,
      }}
    >
      <View
        style={{
          backgroundColor: "#F0FDF4",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
        }}
      >
        {icon || <Inbox size={36} color="#10B981" />}
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#1E293B",
          marginBottom: 8,
          textAlign: "center",
          letterSpacing: -0.2,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 14,
            color: "#64748B",
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
