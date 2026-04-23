import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.tabIconSelected,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.home'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: t('tab.subs'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="repeat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: t('tab.expenses'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: t('tab.income'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="banknote.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t('tab.insights'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="lightbulb.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
