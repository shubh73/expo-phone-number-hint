import { registerWebModule, NativeModule } from 'expo';

import { ExpoPhoneNumberHintModuleEvents } from './ExpoPhoneNumberHint.types';

class ExpoPhoneNumberHintModule extends NativeModule<ExpoPhoneNumberHintModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoPhoneNumberHintModule, 'ExpoPhoneNumberHintModule');
