import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BalanceCard } from '@/components/balance-card';
import { MonthSelector } from '@/components/month-selector';
import { ProfileButton } from '@/components/profile-button';
import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';
import { ThemedText } from '@/components/themed-text';
import { UpcomingCharges } from '@/components/upcoming-charges';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { subscriptionsSplitForMonth, upcomingCharges } from '@/lib/billing';
import { useT } from '@/lib/i18n';
import { expensesSplit, useExpenses } from '@/lib/store/expenses';
import { incomeForMonth, useIncomes } from '@/lib/store/incomes';
import { useSubscriptions } from '@/lib/store/subscriptions';

export default function DashboardScreen() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();

  const subscriptions = useSubscriptions((s) => s.items);
  const expenses = useExpenses((s) => s.items);
  const incomes = useIncomes((s) => s.items);

  const filter = useMonthFilter();
  const now = new Date();

  const income = useMemo(
    () => incomeForMonth(incomes, filter.monthIso),
    [incomes, filter.monthIso]
  );
  const expenseSplit = useMemo(
    () => expensesSplit(expenses, filter.monthIso, now),
    [expenses, filter.monthIso, now]
  );
  const subsSplit = useMemo(
    () => subscriptionsSplitForMonth(subscriptions, filter.monthDate, now),
    [subscriptions, filter.monthDate, now]
  );

  const spent = expenseSplit.actual + subsSplit.actual;
  const planned = expenseSplit.planned + subsSplit.planned;
  const balance = income - spent - planned;

  const upcoming = useMemo(
    () => (filter.isCurrent ? upcomingCharges(subscriptions, new Date(), 3) : []),
    [subscriptions, filter.isCurrent]
  );

  return (
    <Screen
      title={t('home.title')}
      subtitle={t('home.subtitle')}
      scrollable
      right={<ProfileButton />}
    >
      <MonthSelector filter={filter} />

      <View style={{ marginTop: Spacing.lg }}>
        <BalanceCard
          balance={balance}
          subtitle={t('home.balance.subtitle', { month: filter.monthLabel })}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard label={t('home.stat.income')} value={income} tone="positive" />
        <StatCard label={t('home.stat.spent')} value={spent} tone="negative" />
      </View>

      <View style={{ marginTop: Spacing.md }}>
        <StatCard label={t('home.stat.planned')} value={planned} tone="neutral" />
      </View>

      {filter.isCurrent ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: palette.text }]}>
              {t('home.upcoming')}
            </ThemedText>
            {upcoming.length > 0 ? (
              <Pressable onPress={() => router.push('/(tabs)/subscriptions')}>
                <ThemedText style={[styles.link, { color: palette.tint }]}>
                  {t('home.seeAll')}
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
          {upcoming.length > 0 ? (
            <UpcomingCharges items={upcoming} />
          ) : (
            <View
              style={[
                styles.placeholder,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}
            >
              <ThemedText style={[styles.placeholderText, { color: palette.textMuted }]}>
                {t('home.upcoming.empty')}
              </ThemedText>
            </View>
          )}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  section: { marginTop: Spacing.xl, gap: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
  },
  link: { fontSize: FontSize.sm, fontWeight: '600', lineHeight: FontSize.sm * 1.4 },
  placeholder: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  placeholderText: { fontSize: FontSize.md, lineHeight: FontSize.md * 1.3 },
});
