import Button from "@/components/ui/Button";
import { useAuthContext } from "@/contexts/AuthContext";
import type { ApiError } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react-native";
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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères",
      );
      return;
    }

    setIsLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      const error = err as ApiError;
      Alert.alert("Erreur", error.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const inputContainerStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
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
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#334155",
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
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
          colors={["#0F766E", "#0D9488", "#14B8A6", "#2DD4BF"] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 32,
            paddingBottom: 40,
            paddingHorizontal: 32,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          {/* Decorative circles */}
          <View
            style={{
              position: "absolute",
              top: -20,
              left: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 10,
              right: -20,
              width: 90,
              height: 90,
              borderRadius: 45,
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
              <UserPlus size={42} color="#FFFFFF" />
            </View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: -0.5,
              }}
            >
              Rejoignez-nous
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
              Créez votre compte et commencez à agir 🌱
            </Text>
          </View>
        </LinearGradient>

        {/* ── Form ──────────────────────────────────── */}
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
            Inscription
          </Text>
          <Text style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>
            Quelques infos pour commencer
          </Text>

          {/* Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={labelStyle}>Nom complet</Text>
            <View style={inputContainerStyle}>
              <View
                style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <User size={18} color="#14B8A6" />
              </View>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#1E293B",
                }}
                placeholder="Votre nom"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={labelStyle}>Email</Text>
            <View style={inputContainerStyle}>
              <View
                style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <Mail size={18} color="#14B8A6" />
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
          <View style={{ marginBottom: 28 }}>
            <Text style={labelStyle}>Mot de passe</Text>
            <View style={inputContainerStyle}>
              <View
                style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: 10,
                  padding: 6,
                }}
              >
                <Lock size={18} color="#14B8A6" />
              </View>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: "#1E293B",
                }}
                placeholder="Minimum 6 caractères"
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

          {/* Register button */}
          <Button
            title="Créer mon compte"
            onPress={handleRegister}
            isLoading={isLoading}
            size="lg"
          />

          {/* Login link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text style={{ color: "#64748B", fontSize: 15 }}>
              Déjà un compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                style={{
                  color: "#14B8A6",
                  fontWeight: "800",
                  fontSize: 15,
                }}
              >
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
