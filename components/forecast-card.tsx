import { StyleSheet, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import type { Forecast } from '@/lib/insights';

import { HeroCard, heroStyles } from './hero-card';
import { ThemedText } from './themed-text';

interface Props {
  forecast: Forecast;
}

export function ForecastCard({ forecast }: Props) {
  const palette = usePalette();
  const t = useT();
  const money = useMoney();

  const daysLeft = Math.max(0, forecast.daysInMonth - forecast.dayOfMonth);

  return (
    <HeroCard>
      <ThemedText style={[heroStyles.label, { color: palette.heroMuted }]}>
        {t('forecast.title')}
      </ThemedText>
      <ThemedText style={[heroStyles.value, { color: palette.heroText }]}>
        {money(forecast.projectedMonthEnd)}
      </ThemedText>
      <View style={styles.row}>
        <View style={styles.metric}>
          <ThemedText style={[styles.metricLabel, { color: palette.heroMuted }]}>
            {t('forecast.spentSoFar')}
          </ThemedText>
          <ThemedText style={[styles.metricValue, { color: palette.heroText }]}>
            {money(forecast.spentSoFar)}
          </ThemedText>
        </View>
        <View style={[styles.separator, { backgroundColor: palette.heroBorder }]} />
        <View style={styles.metric}>
          <ThemedText style={[styles.metricLabel, { color: palette.heroMuted }]}>
            {t('forecast.daysLeft')}
          </ThemedText>
          <ThemedText style={[styles.metricValue, { color: palette.heroText }]}>
            {daysLeft}
          </ThemedText>
        </View>
      </View>
    </HeroCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  metric: { flex: 1, gap: 2 },
  metricLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    lineHeight: FontSize.xs * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: FontSize.md * 1.3,
  },
  separator: { width: 1 },
});
