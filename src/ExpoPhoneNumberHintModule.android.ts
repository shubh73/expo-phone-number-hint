import { requireNativeModule } from "expo";

import type { PhoneNumberHintResult } from "./ExpoPhoneNumberHint.types";

export default requireNativeModule<{
  isAvailableAsync(): Promise<boolean>;
  showPhoneNumberHintAsync(): Promise<PhoneNumberHintResult>;
  formatToE164(number: string, regionCode: string | null): string | null;
  getSimRegionCodeAsync(): Promise<string | null>;
}>("ExpoPhoneNumberHint");
