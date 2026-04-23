import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import type { Forecast } from '@/lib/insights';

import { ThemedText } from './themed-text';

interface Props {
  forecast: Forecast;
}

export function ForecastCard({ forecast }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();

  const daysLeft = Math.max(0, forecast.daysInMonth - forecast.dayOfMonth);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.hero, borderColor: palette.heroBorder },
      ]}
    >
      <ThemedText style={[styles.label, { color: palette.heroMuted }]}>
        {t('forecast.title')}
      </ThemedText>
      <ThemedText style={[styles.value, { color: palette.heroText }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.md,
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
