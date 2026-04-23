import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryBarChart } from '@/components/category-bar-chart';
import { EmptyState } from '@/components/empty-state';
import { ForecastCard } from '@/components/forecast-card';
import { ReviewSubscriptionItem } from '@/components/review-subscription-item';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import {
  endOfMonthForecast,
  potentialSavings,
  subscriptionsToReview,
  topSpendingCategories,
} from '@/lib/insights';
import { useExpenses } from '@/lib/store/expenses';
import { useSubscriptions } from '@/lib/store/subscriptions';

export default function InsightsScreen() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();

  const expenses = useExpenses((s) => s.items);
  const subscriptions = useSubscriptions((s) => s.items);

  const nowIso = new Date().toISOString();

  const forecast = useMemo(
    () => endOfMonthForecast(expenses, subscriptions, new Date()),
    [expenses, subscriptions]
  );

  const topCategories = useMemo(
    () => topSpendingCategories(expenses, nowIso, 5),
    [expenses, nowIso]
  );

  const toReview = useMemo(
    () => subscriptionsToReview(subscriptions, 3),
    [subscriptions]
  );

  const savings = potentialSavings(toReview);

  const hasData = expenses.length > 0 || subscriptions.length > 0;

  if (!hasData) {
    return (
      <Screen title={t('insights.title')} subtitle={t('insights.subtitle')}>
        <EmptyState
          title={t('insights.empty.title')}
          message={t('insights.empty.message')}
        />
      </Screen>
    );
  }

  return (
    <Screen title={t('insights.title')} subtitle={t('insights.subtitle')} scrollable>
      <ForecastCard forecast={forecast} />

      {topCategories.length > 0 ? (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: palette.text }]}>
            {t('insights.topCategories')}
          </ThemedText>
          <ThemedText style={[styles.sectionHint, { color: palette.textMuted }]}>
            {t('insights.thisMonthSoFar')}
          </ThemedText>
          <CategoryBarChart data={topCategories} />
        </View>
      ) : null}

      {toReview.length > 0 ? (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: palette.text }]}>
            {t('insights.reviewSubs')}
          </ThemedText>
          <ThemedText style={[styles.sectionHint, { color: palette.textMuted }]}>
            {t('insights.reviewSubs.hint', { monthly: money(savings) })}
            {savings > 0
              ? t('insights.reviewSubs.hintYear', { yearly: money(savings * 12) })
              : ''}
          </ThemedText>
          <View style={styles.list}>
            {toReview.map((r) => (
              <ReviewSubscriptionItem
                key={r.subscription.id}
                item={r}
                onPress={() => router.push(`/subscription/${r.subscription.id}`)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.tipCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <ThemedText style={[styles.tipTitle, { color: palette.tint }]}>
          {t('insights.tip')}
        </ThemedText>
        <ThemedText style={[styles.tipText, { color: palette.text }]}>
          {forecast.subscriptionsShare > 0
            ? t('insights.tip.subs', {
                amount: money(forecast.subscriptionsShare),
                example: money(10),
                exampleYear: money(120),
              })
            : t('insights.tip.logMore')}
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.xl, gap: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
  },
  sectionHint: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    marginBottom: Spacing.xs,
  },
  list: { gap: Spacing.sm },
  tipCard: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  tipTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    lineHeight: FontSize.xs * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tipText: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.5 },
});
