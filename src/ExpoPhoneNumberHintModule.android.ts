import { requireNativeModule } from "expo";

export default requireNativeModule<{
  isAvailableAsync(): Promise<boolean>;
  showPhoneNumberHintAsync(): Promise<string | null>;
}>("ExpoPhoneNumberHint");
