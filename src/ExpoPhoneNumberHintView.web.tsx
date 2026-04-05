import * as React from 'react';

import { ExpoPhoneNumberHintViewProps } from './ExpoPhoneNumberHint.types';

export default function ExpoPhoneNumberHintView(props: ExpoPhoneNumberHintViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
