import { NativeModule, requireNativeModule } from "expo";

declare class ExpoPhoneNumberHintNativeModule extends NativeModule<
  Record<string, never>
> {
  isAvailable(): Promise<boolean>;
  requestPhoneNumber(): Promise<string | null>;
}

export default requireNativeModule<ExpoPhoneNumberHintNativeModule>(
  "ExpoPhoneNumberHint",
);
