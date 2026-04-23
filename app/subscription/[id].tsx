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
import { Segmented } from '@/components/segmented';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { parseMoneyInput } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { CURRENCY_SYMBOL, useSettings } from '@/lib/store/settings';
import { useSubscriptions } from '@/lib/store/subscriptions';
import { ALL_CATEGORIES, type BillingPeriod, type Category } from '@/types/models';

export default function SubscriptionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const t = useT();

  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const currency = useSettings((s) => s.settings.currency);
  const currencySymbol = CURRENCY_SYMBOL[currency];

  const items = useSubscriptions((s) => s.items);
  const add = useSubscriptions((s) => s.add);
  const update = useSubscriptions((s) => s.update);
  const remove = useSubscriptions((s) => s.remove);

  const existing = useMemo(
    () => (isNew ? undefined : items.find((i) => i.id === id)),
    [isNew, id, items]
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [period, setPeriod] = useState<BillingPeriod>(
    existing?.billingPeriod ?? 'monthly'
  );
  const [amountText, setAmountText] = useState(
    existing ? existing.amount.toFixed(2) : ''
  );
  const [billingDayText, setBillingDayText] = useState(
    existing ? String(existing.billingDay) : ''
  );
  const [billingMonthText, setBillingMonthText] = useState(
    existing?.billingMonth ? String(existing.billingMonth) : ''
  );
  const [category, setCategory] = useState<Category | undefined>(existing?.category);
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const onSave = () => {
    const trimmedName = name.trim();
    const amount = parseMoneyInput(amountText);
    const billingDay = Math.max(1, Math.min(31, parseInt(billingDayText, 10) || 0));
    const billingMonth = period === 'yearly'
      ? Math.max(1, Math.min(12, parseInt(billingMonthText, 10) || 0))
      : undefined;

    if (!trimmedName) {
      Alert.alert(t('alert.name.title'), t('alert.name.subscription'));
      return;
    }
    if (amount <= 0) {
      Alert.alert(t('alert.amount.title'), t('alert.amount.msg'));
      return;
    }
    if (!billingDay) {
      Alert.alert(t('alert.day.title'), t('alert.day.msg'));
      return;
    }
    if (period === 'yearly' && !billingMonth) {
      Alert.alert(t('alert.billingMonth.title'), t('alert.billingMonth.msg'));
      return;
    }

    const data = {
      name: trimmedName,
      amount,
      billingPeriod: period,
      billingDay,
      billingMonth,
      category,
      notes: notes.trim() || undefined,
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
      t('alert.delete.subscription'),
      t('common.remove.message', { name: existing.name }),
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
          title: isNew ? t('subs.form.new') : t('subs.form.edit'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label={t('subs.form.name')}
          placeholder={t('subs.form.name.placeholder')}
          value={name}
          onChangeText={setName}
          autoCapitalize="sentences"
          returnKeyType="next"
        />

        <View style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: palette.textMuted }]}>
            {t('subs.form.period')}
          </ThemedText>
          <Segmented
            options={[
              { value: 'monthly', label: t('subs.form.period.monthly') },
              { value: 'yearly', label: t('subs.form.period.yearly') },
            ]}
            value={period}
            onChange={setPeriod}
          />
        </View>

        <Input
          label={
            period === 'yearly'
              ? t('subs.form.amount.yearly', { symbol: currencySymbol })
              : t('subs.form.amount.monthly', { symbol: currencySymbol })
          }
          placeholder={period === 'yearly' ? '120.00' : '29.99'}
          value={amountText}
          onChangeText={(t) => setAmountText(t.replace(/[^\d.,]/g, ''))}
          keyboardType="decimal-pad"
        />

        <Input
          label={t('subs.form.day')}
          placeholder={t('subs.form.day.placeholder')}
          value={billingDayText}
          onChangeText={(t) => setBillingDayText(t.replace(/[^\d]/g, '').slice(0, 2))}
          keyboardType="number-pad"
          hint={
            period === 'yearly'
              ? t('subs.form.day.hint.yearly')
              : t('subs.form.day.hint.monthly')
          }
        />

        {period === 'yearly' ? (
          <Input
            label={t('subs.form.month')}
            placeholder={t('subs.form.month.placeholder')}
            value={billingMonthText}
            onChangeText={(t) => setBillingMonthText(t.replace(/[^\d]/g, '').slice(0, 2))}
            keyboardType="number-pad"
            hint={t('subs.form.month.hint')}
          />
        ) : null}

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

        <Input
          label={t('subs.form.notes')}
          placeholder={t('subs.form.notes.placeholder')}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.multiline}
        />

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
  multiline: { height: 96, paddingTop: Spacing.md, textAlignVertical: 'top' },
  actions: { gap: Spacing.md, marginTop: Spacing.md },
});
