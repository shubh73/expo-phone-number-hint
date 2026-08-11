import type { PhoneNumberHintResult } from "./ExpoPhoneNumberHint.types";

export default {} as {
  isAvailableAsync?(): Promise<boolean>;
  showPhoneNumberHintAsync?(): Promise<PhoneNumberHintResult>;
  formatToE164?(number: string, regionCode: string | null): string | null;
};
