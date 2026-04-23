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
import { formatLongMonth, parseMoneyInput } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { useExpenses } from '@/lib/store/expenses';
import { CURRENCY_SYMBOL, useSettings } from '@/lib/store/settings';
import { ALL_CATEGORIES, type Category } from '@/types/models';

export default function ExpenseFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();

  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const currency = useSettings((s) => s.settings.currency);
  const currencySymbol = CURRENCY_SYMBOL[currency];

  const items = useExpenses((s) => s.items);
  const update = useExpenses((s) => s.update);
  const remove = useExpenses((s) => s.remove);

  const existing = useMemo(() => items.find((i) => i.id === id), [id, items]);

  const [description, setDescription] = useState(existing?.description ?? '');
  const [amountText, setAmountText] = useState(
    existing ? existing.amount.toFixed(2) : ''
  );
  const [category, setCategory] = useState<Category>(existing?.category ?? 'Other');
  const [dayText, setDayText] = useState(
    existing ? String(new Date(existing.date).getDate()) : ''
  );

  if (!existing) {
    return (
      <View style={[styles.center, { backgroundColor: palette.background }]}>
        <Stack.Screen options={{ title: t('expenseForm.notFound') }} />
        <ThemedText style={{ color: palette.text }}>
          {t('expenseForm.notFound')}
        </ThemedText>
      </View>
    );
  }

  const existingDate = new Date(existing.date);
  const monthLabel = formatLongMonth(existingDate);

  const onSave = () => {
    const desc = description.trim();
    const amount = parseMoneyInput(amountText);
    const day = Math.max(1, Math.min(31, parseInt(dayText, 10) || 0));

    if (!desc) {
      Alert.alert(t('alert.description.title'), t('alert.description.msg'));
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

    const newDate = new Date(existingDate);
    const lastDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();
    newDate.setDate(Math.min(day, lastDay));
    newDate.setHours(12, 0, 0, 0);

    update(existing.id, {
      description: desc,
      amount,
      category,
      date: newDate.toISOString(),
    });
    router.back();
  };

  const onDelete = () => {
    Alert.alert(
      t('alert.delete.expense'),
      t('common.remove.message', { name: existing.description }),
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
          title: t('expenseForm.edit'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label={t('expenseForm.description')}
          placeholder={t('expenseForm.description.placeholder')}
          value={description}
          onChangeText={setDescription}
          autoCapitalize="sentences"
        />
        <Input
          label={t('expenseForm.amount', { symbol: currencySymbol })}
          placeholder="29.99"
          value={amountText}
          onChangeText={(t) => setAmountText(t.replace(/[^\d.,]/g, ''))}
          keyboardType="decimal-pad"
        />
        <Input
          label={t('expenseForm.day')}
          placeholder="13"
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
            onChange={setCategory}
            categories={ALL_CATEGORIES}
            labelFor={(c) => t(`category.${c}` as never)}
          />
        </View>

        <View style={styles.actions}>
          <Button label={t('common.save')} onPress={onSave} />
          <Button label={t('common.delete')} variant="danger" onPress={onDelete} />
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
