import { Search, X } from "lucide-react-native";
import React from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Rechercher une mission...",
}: SearchBarProps) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
        ...Platform.select({
          ios: {
            shadowColor: "#64748B",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
          },
          android: {
            elevation: 3,
          },
        }),
      }}
    >
      <View
        style={{
          backgroundColor: "#F0FDF4",
          borderRadius: 10,
          padding: 6,
        }}
      >
        <Search size={18} color="#10B981" />
      </View>
      <TextInput
        style={{
          flex: 1,
          marginLeft: 12,
          fontSize: 15,
          color: "#1E293B",
        }}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          activeOpacity={0.7}
          style={{
            backgroundColor: "#F1F5F9",
            borderRadius: 10,
            padding: 6,
          }}
        >
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      )}
    </View>
  );
}
