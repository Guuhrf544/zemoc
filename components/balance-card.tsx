import { StyleSheet } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';

import { HeroCard, heroStyles } from './hero-card';
import { ThemedText } from './themed-text';

interface Props {
  balance: number;
  subtitle?: string;
  previousBalance?: number;
}

export function BalanceCard({ balance, subtitle, previousBalance }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();
  const positive = balance >= 0;
  const showPrevious =
    previousBalance !== undefined && Math.abs(previousBalance) >= 0.005;

  return (
    <HeroCard gap={Spacing.xs}>
      <ThemedText style={[heroStyles.label, { color: palette.heroMuted }]}>
        {t('home.balance.label')}
      </ThemedText>
      <ThemedText
        style={[
          heroStyles.value,
          { color: positive ? palette.heroPositive : palette.danger },
        ]}
      >
        {money(balance)}
      </ThemedText>
      {showPrevious ? (
        <ThemedText style={[styles.subtitle, { color: palette.heroMuted }]}>
          {t('home.balance.previous', { amount: money(previousBalance!) })}
        </ThemedText>
      ) : null}
      {subtitle ? (
        <ThemedText style={[styles.subtitle, { color: palette.heroMuted }]}>
          {subtitle}
        </ThemedText>
      ) : null}
    </HeroCard>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
});
