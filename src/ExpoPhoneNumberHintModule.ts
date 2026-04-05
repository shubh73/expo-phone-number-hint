import { NativeModule, requireNativeModule } from 'expo';

import { ExpoPhoneNumberHintModuleEvents } from './ExpoPhoneNumberHint.types';

declare class ExpoPhoneNumberHintModule extends NativeModule<ExpoPhoneNumberHintModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoPhoneNumberHintModule>('ExpoPhoneNumberHint');
