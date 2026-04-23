import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { CATEGORY_COLOR, type Category } from '@/types/models';

import { ThemedText } from './themed-text';

export interface CategoryTotal {
  category: Category;
  total: number;
}

interface Props {
  data: CategoryTotal[];
}

export function CategoryBarChart({ data }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();

  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.total));
  const sorted = [...data].sort((a, b) => b.total - a.total);

  return (
    <View style={styles.container}>
      {sorted.map((d) => {
        const pct = max > 0 ? d.total / max : 0;
        return (
          <View key={d.category} style={styles.row}>
            <View style={styles.labelRow}>
              <ThemedText style={[styles.category, { color: palette.text }]}>
                {t(`category.${d.category}` as never)}
              </ThemedText>
              <ThemedText style={[styles.amount, { color: palette.textMuted }]}>
                {money(d.total)}
              </ThemedText>
            </View>
            <View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}>
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: CATEGORY_COLOR[d.category],
                    width: `${Math.max(6, pct * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  row: { gap: Spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { fontSize: FontSize.sm, fontWeight: '600', lineHeight: FontSize.sm * 1.4 },
  amount: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.4 },
  track: { height: 8, borderRadius: Radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius.pill },
});
