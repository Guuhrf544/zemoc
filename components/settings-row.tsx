import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface Props {
  icon: Parameters<typeof IconSymbol>[0]['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  destructive?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  switchValue,
  onSwitchChange,
  destructive,
  isLast,
}: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const hasSwitch = switchValue !== undefined;
  const isPressable = !hasSwitch && !!onPress;
  const labelColor = destructive ? palette.danger : palette.text;

  const content = (
    <View style={[styles.row, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: palette.surfaceAlt }]}>
        <IconSymbol name={icon} size={18} color={destructive ? palette.danger : palette.text} />
      </View>

      <ThemedText style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </ThemedText>

      <View style={styles.trailing}>
        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: palette.border, true: palette.tint }}
            thumbColor={scheme === 'light' ? '#FFFFFF' : palette.surface}
            ios_backgroundColor={palette.border}
          />
        ) : (
          <>
            {value ? (
              <ThemedText
                style={[styles.value, { color: palette.textMuted }]}
                numberOfLines={1}
              >
                {value}
              </ThemedText>
            ) : null}
            {isPressable ? (
              <IconSymbol name="chevron.right" size={16} color={palette.textMuted} />
            ) : null}
          </>
        )}
      </View>
    </View>
  );

  if (isPressable) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: palette.surfaceAlt }}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    lineHeight: FontSize.md * 1.3,
  },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, maxWidth: '50%' },
  value: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
});
