import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import type { ApiError } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Leaf, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      const error = err as ApiError;
      Alert.alert(
        "Erreur de connexion",
        error.message || "Une erreur est survenue",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Premium Hero ──────────────────────────── */}
        <LinearGradient
          colors={["#047857", "#059669", "#10B981", "#34D399"] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 40,
            paddingBottom: 48,
            paddingHorizontal: 32,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          {/* Decorative circles */}
          <View
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: -20,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />

          <View className="items-center">
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 28,
                padding: 18,
                marginBottom: 16,
              }}
            >
              <Leaf size={42} color="#FFFFFF" />
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: -0.5,
              }}
            >
              EcoAction
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 15,
                marginTop: 8,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Agissons ensemble pour la planète 🌍
            </Text>
          </View>
        </LinearGradient>

        {/* ── Form Card ────────────────────────────── */}
        <View className="px-6 pt-8 pb-6 flex-1">
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#1E293B",
              letterSpacing: -0.3,
              marginBottom: 6,
            }}
          >
            Connexion
          </Text>
          <Text style={{ fontSize: 15, color: "#64748B", marginBottom: 28 }}>
            Heureux de vous revoir !
          </Text>

          {/* Email */}
          <View className="mb-5">
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#334155",
                marginBottom: 8,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              Email
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderWidth: 1.5,
                borderColor: "#E2E8F0",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: Platform.OS === "ios" ? 16 : 12,
                shadowColor: "#64748B",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <Mail size={18} color="#10B981" />
              </View>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#1E293B",
                }}
                placeholder="votre@email.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-8">
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#334155",
                marginBottom: 8,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              Mot de passe
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderWidth: 1.5,
                borderColor: "#E2E8F0",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: Platform.OS === "ios" ? 16 : 12,
                shadowColor: "#64748B",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <Lock size={18} color="#10B981" />
              </View>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#1E293B",
                }}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: "#F1F5F9",
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#64748B" />
                ) : (
                  <Eye size={18} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Login button */}
          <Button
            title="Se connecter"
            onPress={handleLogin}
            isLoading={isLoading}
            size="lg"
          />

          {/* Register link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text style={{ color: "#64748B", fontSize: 15 }}>
              Pas encore de compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text
                style={{
                  color: "#10B981",
                  fontWeight: "800",
                  fontSize: 15,
                }}
              >
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
