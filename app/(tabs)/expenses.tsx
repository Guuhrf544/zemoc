import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { CategoryBarChart, type CategoryTotal } from '@/components/category-bar-chart';
import { ExpenseItem } from '@/components/expense-item';
import { MonthSelector } from '@/components/month-selector';
import { QuickExpenseInput } from '@/components/quick-expense-input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMonthFilter } from '@/hooks/use-month-filter';
import { dateForDay } from '@/lib/parse-day';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import {
  expensesForMonth,
  expensesSplit,
  isPlanned,
  useExpenses,
} from '@/lib/store/expenses';
import type { Category } from '@/types/models';

export default function ExpensesScreen() {
  const items = useExpenses((s) => s.items);
  const add = useExpenses((s) => s.add);
  const filter = useMonthFilter();
  const t = useT();
  const money = useMoney();

  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const monthItems = useMemo(
    () => expensesForMonth(items, filter.monthIso),
    [items, filter.monthIso]
  );

  const split = useMemo(
    () => expensesSplit(items, filter.monthIso),
    [items, filter.monthIso]
  );
  const totalMonth = split.actual + split.planned;

  const byCategory = useMemo<CategoryTotal[]>(() => {
    const map = new Map<Category, number>();
    monthItems.forEach((e) => {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    });
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  }, [monthItems]);

  const sorted = useMemo(
    () => [...monthItems].sort((a, b) => b.date.localeCompare(a.date)),
    [monthItems]
  );

  const goExpense = useCallback(
    (id: string) => router.push(`/expense/${id}` as never),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof sorted)[number] }) => (
      <ExpenseItem
        expense={item}
        planned={isPlanned(item)}
        onPress={goExpense}
      />
    ),
    [goExpense]
  );

  const handleQuickAdd = (d: {
    amount: number;
    description: string;
    category: Category;
    day: number | null;
  }) => {
    const date = dateForDay(filter.monthDate, d.day, filter.isCurrent);
    add({
      amount: d.amount,
      description: d.description,
      category: d.category,
      date: date.toISOString(),
    });
  };

  const ListHeader = (
    <View style={styles.headerGroup}>
      <QuickExpenseInput onSubmit={handleQuickAdd} monthDate={filter.monthDate} />
      <MonthSelector filter={filter} />
      <View
        style={[
          styles.totalCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <ThemedText style={[styles.totalLabel, { color: palette.textMuted }]}>
          {filter.isCurrent ? t('expenses.thisMonth') : filter.monthLabel}
        </ThemedText>
        <ThemedText style={[styles.totalValue, { color: palette.text }]}>
          {money(totalMonth)}
        </ThemedText>
        {split.planned > 0 ? (
          <ThemedText style={[styles.totalHint, { color: palette.textMuted }]}>
            {t('expenses.totalHint', {
              actual: money(split.actual),
              planned: money(split.planned),
            })}
          </ThemedText>
        ) : null}
      </View>

      {byCategory.length > 0 ? (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: palette.text }]}>
            {t('expenses.byCategory')}
          </ThemedText>
          <CategoryBarChart data={byCategory} />
        </View>
      ) : null}

      <ThemedText style={[styles.sectionTitle, styles.listTitle, { color: palette.text }]}>
        {t('expenses.all')}
      </ThemedText>
    </View>
  );

  return (
    <Screen title={t('expenses.title')} subtitle={t('expenses.subtitle')}>
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <ThemedText style={[styles.emptyHint, { color: palette.textMuted }]}>
            {t('expenses.empty')}
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
  totalHint: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    marginTop: Spacing.xs,
  },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
  },
  listTitle: { marginTop: Spacing.xs },
  listContainer: { paddingBottom: 120 },
  emptyHint: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.5 },
});
