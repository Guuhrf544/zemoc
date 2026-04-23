// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'repeat': 'repeat',
  'creditcard.fill': 'credit-card',
  'lightbulb.fill': 'lightbulb',
  'banknote.fill': 'payments',
  'plus': 'add',
  'trash': 'delete',
  'pencil': 'edit',
  'xmark': 'close',
  'globe': 'language',
  'dollarsign.circle': 'attach-money',
  'mappin.and.ellipse': 'place',
  'paintbrush': 'palette',
  'bell': 'notifications',
  'lock': 'lock',
  'faceid': 'face',
  'clock': 'schedule',
  'icloud': 'cloud',
  'arrow.counterclockwise': 'restore',
  'square.and.arrow.up': 'file-upload',
  'info.circle': 'info',
  'doc.text': 'description',
  'bubble.left': 'chat',
  'gearshape': 'settings',
  'checkmark': 'check',
  'chevron.down': 'expand-more',
  'calendar': 'calendar-today',
  'delete.left': 'backspace',
  'arrow.down.doc': 'file-download',
  'arrow.up.doc': 'file-upload',
  'shield': 'shield',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
