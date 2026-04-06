import { requireNativeModule } from "expo";

export default requireNativeModule<{
  isAvailable(): Promise<boolean>;
  requestPhoneNumber(): Promise<string | null>;
}>("ExpoPhoneNumberHint");
