import { AlertTriangle } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Button from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Une erreur est survenue",
  onRetry,
}: ErrorStateProps) {
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
          backgroundColor: "#FEF2F2",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#FECACA",
        }}
      >
        <AlertTriangle size={36} color="#EF4444" />
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
        Oops !
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#64748B",
          textAlign: "center",
          marginBottom: 24,
          lineHeight: 20,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Réessayer"
          variant="outline"
          size="sm"
          onPress={onRetry}
        />
      )}
    </View>
  );
}
