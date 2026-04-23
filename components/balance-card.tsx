import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';

import { ThemedText } from './themed-text';

interface Props {
  balance: number;
  subtitle?: string;
}

export function BalanceCard({ balance, subtitle }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();
  const positive = balance >= 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.hero,
          borderColor: palette.heroBorder,
        },
      ]}
    >
      <ThemedText style={[styles.label, { color: palette.heroMuted }]}>
        {t('home.balance.label')}
      </ThemedText>
      <ThemedText
        style={[
          styles.value,
          { color: positive ? palette.heroPositive : palette.danger },
        ]}
      >
        {money(balance)}
      </ThemedText>
      {subtitle ? (
        <ThemedText style={[styles.subtitle, { color: palette.heroMuted }]}>
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: FontSize.display,
    fontWeight: '700',
    lineHeight: FontSize.display * 1.2,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
});
