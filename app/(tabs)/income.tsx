import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { FAB } from '@/components/fab';
import { IncomeItem } from '@/components/income-item';
import { MonthSelector } from '@/components/month-selector';
import { QuickIncomeInput } from '@/components/quick-income-input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { dateForDay } from '@/lib/parse-day';
import {
  incomeForMonth,
  incomesForMonthList,
  useIncomes,
} from '@/lib/store/incomes';
import type { IncomeCategory } from '@/types/models';

export default function IncomeScreen() {
  const items = useIncomes((s) => s.items);
  const add = useIncomes((s) => s.add);
  const filter = useMonthFilter();
  const t = useT();
  const money = useMoney();

  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const total = useMemo(
    () => incomeForMonth(items, filter.monthIso),
    [items, filter.monthIso]
  );

  const listItems = useMemo(
    () =>
      incomesForMonthList(items, filter.monthIso).sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    [items, filter.monthIso]
  );

  const now = new Date().getTime();

  const goIncome = useCallback(
    (id: string) => router.push(`/income/${id}` as never),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof listItems)[number] }) => (
      <IncomeItem
        income={item}
        planned={new Date(item.date).getTime() > now}
        onPress={goIncome}
      />
    ),
    [goIncome, now]
  );

  const handleQuickAdd = (d: {
    amount: number;
    source: string;
    category: IncomeCategory;
    day: number | null;
  }) => {
    const date = dateForDay(filter.monthDate, d.day, filter.isCurrent);
    add({
      source: d.source,
      amount: d.amount,
      category: d.category,
      date: date.toISOString(),
    });
  };

  const ListHeader = (
    <View style={styles.headerGroup}>
      <QuickIncomeInput onSubmit={handleQuickAdd} monthDate={filter.monthDate} />
      <MonthSelector filter={filter} />
      <View
        style={[
          styles.totalCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <ThemedText style={[styles.totalLabel, { color: palette.textMuted }]}>
          {filter.isCurrent
            ? t('income.thisMonth')
            : t('income.thisMonthIn', { month: filter.monthLabel })}
        </ThemedText>
        <ThemedText style={[styles.totalValue, { color: palette.success }]}>
          +{money(total)}
        </ThemedText>
      </View>
      <ThemedText style={[styles.sectionTitle, { color: palette.text }]}>
        {t('income.all')}
      </ThemedText>
    </View>
  );

  return (
    <Screen title={t('income.title')} subtitle={t('income.subtitle')}>
      <FlatList
        data={listItems}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <ThemedText style={[styles.emptyHint, { color: palette.textMuted }]}>
            {t('income.empty')}
          </ThemedText>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
      <FAB onPress={() => router.push('/income/new')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerGroup: { gap: Spacing.lg, marginBottom: Spacing.lg },
  totalCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  totalValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    lineHeight: FontSize.xxl * 1.25,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
  },
  listContainer: { paddingBottom: 120 },
  emptyHint: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.5 },
});
