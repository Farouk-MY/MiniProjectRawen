import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { CalendarCheck, Compass, UserCircle } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_MARGIN = 24;
const BAR_WIDTH = SCREEN_WIDTH - H_MARGIN * 2;
const TAB_COUNT = 3;
const TAB_W = BAR_WIDTH / TAB_COUNT;
const BAR_H = 70;
const INDICATOR_W = 40;

/* ─── Tab Config ──────────────────────────────────────────────────── */
const TABS = [
  { name: "index", Icon: Compass, label: "Explorer" },
  { name: "my-missions", Icon: CalendarCheck, label: "Missions" },
  { name: "profile", Icon: UserCircle, label: "Profil" },
];

/* ─── Single Tab Button ───────────────────────────────────────────── */
function TabButton({
  tab,
  focused,
  onPress,
}: {
  tab: (typeof TABS)[0];
  focused: boolean;
  onPress: () => void;
}) {
  const { Icon, label } = tab;

  const iconScale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const labelTranslateY = useRef(new Animated.Value(focused ? 0 : 6)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(labelTranslateY, {
          toValue: 0,
          friction: 6,
          tension: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 0.9,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(labelTranslateY, {
          toValue: 6,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: TAB_W,
        height: BAR_H,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 2,
      }}
    >
      <Animated.View
        style={{
          alignItems: "center",
          transform: [{ scale: iconScale }],
        }}
      >
        <Icon
          size={24}
          color={focused ? "#10B981" : "#94A3B8"}
          strokeWidth={focused ? 2.4 : 1.6}
        />
        <Animated.Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#10B981",
            marginTop: 4,
            opacity: labelOpacity,
            transform: [{ translateY: labelTranslateY }],
          }}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

/* ─── Custom Tab Bar ──────────────────────────────────────────────── */
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Sliding indicator X position
  const indicatorX = useRef(
    new Animated.Value(state.index * TAB_W + TAB_W / 2 - INDICATOR_W / 2),
  ).current;

  useEffect(() => {
    const target = state.index * TAB_W + TAB_W / 2 - INDICATOR_W / 2;
    Animated.spring(indicatorX, {
      toValue: target,
      friction: 7,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <View
      style={{
        position: "absolute",
        bottom: Math.max(insets.bottom, 12) + 4,
        left: H_MARGIN,
        right: H_MARGIN,
        height: BAR_H,
        borderRadius: 24,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(226,232,240,0.8)",
        overflow: "hidden",
        ...Platform.select({
          ios: {
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 24,
          },
          android: { elevation: 12 },
        }),
      }}
    >
      {/* ── Top indicator line ───────────────────────────────── */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: INDICATOR_W,
          height: 3,
          borderRadius: 2,
          backgroundColor: "#10B981",
          transform: [{ translateX: indicatorX }],
        }}
      />

      {/* ── Tab buttons ──────────────────────────────────────── */}
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
        }}
      >
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const focused = state.index === index;

          return (
            <TabButton
              key={route.key}
              tab={tab}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

/* ─── Root Layout ─────────────────────────────────────────────────── */
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="my-missions" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
