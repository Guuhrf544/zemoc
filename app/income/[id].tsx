import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button } from '@/components/button';
import { CategoryChips } from '@/components/category-chips';
import { Input } from '@/components/input';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { guessIncomeCategory } from '@/lib/categorize-income';
import { formatLongMonth, parseMoneyInput } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { useIncomes } from '@/lib/store/incomes';
import { CURRENCY_SYMBOL, useSettings } from '@/lib/store/settings';
import {
  ALL_INCOME_CATEGORIES,
  type IncomeCategory,
} from '@/types/models';

export default function IncomeFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const t = useT();

  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const currency = useSettings((s) => s.settings.currency);
  const currencySymbol = CURRENCY_SYMBOL[currency];

  const items = useIncomes((s) => s.items);
  const add = useIncomes((s) => s.add);
  const update = useIncomes((s) => s.update);
  const remove = useIncomes((s) => s.remove);

  const existing = useMemo(
    () => (isNew ? undefined : items.find((i) => i.id === id)),
    [isNew, id, items]
  );

  const baseDate = useMemo(
    () => (existing ? new Date(existing.date) : new Date()),
    [existing]
  );
  const monthLabel = formatLongMonth(baseDate);

  const [source, setSource] = useState(existing?.source ?? '');
  const [amountText, setAmountText] = useState(
    existing ? existing.amount.toFixed(2) : ''
  );
  const [category, setCategory] = useState<IncomeCategory>(
    existing?.category ?? 'Salary'
  );
  const [categoryTouched, setCategoryTouched] = useState(!isNew);
  const [dayText, setDayText] = useState(String(baseDate.getDate()));

  const onSourceChange = (text: string) => {
    setSource(text);
    if (!categoryTouched && text.trim()) {
      setCategory(guessIncomeCategory(text));
    }
  };

  const onCategoryChange = (c: IncomeCategory) => {
    setCategory(c);
    setCategoryTouched(true);
  };

  const onSave = () => {
    const trimmed = source.trim();
    const amount = parseMoneyInput(amountText);
    const day = Math.max(1, Math.min(31, parseInt(dayText, 10) || 0));

    if (!trimmed) {
      Alert.alert(t('alert.source.title'), t('alert.source.msg'));
      return;
    }
    if (amount <= 0) {
      Alert.alert(t('alert.amount.title'), t('alert.amount.msg'));
      return;
    }
    if (!day) {
      Alert.alert(t('alert.day.title'), t('alert.day.msg'));
      return;
    }

    const newDate = new Date(baseDate);
    const lastDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();
    newDate.setDate(Math.min(day, lastDay));
    newDate.setHours(12, 0, 0, 0);

    const data = {
      source: trimmed,
      amount,
      category,
      date: newDate.toISOString(),
    };

    if (isNew) {
      add(data);
    } else if (existing) {
      update(existing.id, data);
    }
    router.back();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert(
      t('alert.delete.income'),
      t('common.remove.message', { name: existing.source }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            remove(existing.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: palette.background }}
    >
      <Stack.Screen
        options={{
          title: isNew ? t('incomeForm.new') : t('incomeForm.edit'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label={t('incomeForm.source')}
          placeholder={t('incomeForm.source.placeholder')}
          value={source}
          onChangeText={onSourceChange}
          autoCapitalize="sentences"
        />
        <Input
          label={t('expenseForm.amount', { symbol: currencySymbol })}
          placeholder="3000.00"
          value={amountText}
          onChangeText={(t) => setAmountText(t.replace(/[^\d.,]/g, ''))}
          keyboardType="decimal-pad"
        />
        <Input
          label={t('expenseForm.day')}
          placeholder="14"
          value={dayText}
          onChangeText={(t) => setDayText(t.replace(/[^\d]/g, '').slice(0, 2))}
          keyboardType="number-pad"
          hint={t('expenseForm.day.hint', { month: monthLabel })}
        />

        <View style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: palette.textMuted }]}>
            {t('subs.form.category')}
          </ThemedText>
          <CategoryChips
            value={category}
            onChange={onCategoryChange}
            categories={ALL_INCOME_CATEGORIES}
            labelFor={(c) => t(`incomeCategory.${c}` as never)}
          />
        </View>

        <View style={styles.actions}>
          <Button label={isNew ? t('common.add') : t('common.save')} onPress={onSave} />
          {!isNew ? (
            <Button label={t('common.delete')} variant="danger" onPress={onDelete} />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  section: { gap: Spacing.xs },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  actions: { gap: Spacing.md, marginTop: Spacing.md },
});
