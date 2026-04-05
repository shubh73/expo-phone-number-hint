import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoPhoneNumberHintViewProps } from './ExpoPhoneNumberHint.types';

const NativeView: React.ComponentType<ExpoPhoneNumberHintViewProps> =
  requireNativeView('ExpoPhoneNumberHint');

export default function ExpoPhoneNumberHintView(props: ExpoPhoneNumberHintViewProps) {
  return <NativeView {...props} />;
}
