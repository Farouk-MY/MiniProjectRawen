import React from "react";
import {
    ActivityIndicator,
    Platform,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<string, object> = {
  primary: {
    backgroundColor: "#10B981",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  secondary: {
    backgroundColor: "#1E293B",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  danger: {
    backgroundColor: "#EF4444",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
};

const variantTextColors: Record<string, string> = {
  primary: "#FFFFFF",
  secondary: "#FFFFFF",
  outline: "#10B981",
  danger: "#FFFFFF",
};

const sizeStyles: Record<string, object> = {
  sm: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  md: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  lg: { paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20 },
};

const sizeTextStyles: Record<string, object> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 17 },
};

export default function Button({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          ...sizeStyles[size],
          ...variantStyles[variant],
        },
        (disabled || isLoading) && { opacity: 0.5 },
        Platform.OS === "android" &&
          variant !== "outline" && {
            elevation: disabled ? 0 : 8,
          },
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#10B981" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              {
                fontWeight: "700",
                color: variantTextColors[variant],
                letterSpacing: 0.2,
              },
              sizeTextStyles[size],
              icon ? { marginLeft: 8 } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
