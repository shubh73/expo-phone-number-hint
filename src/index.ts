import { UnavailabilityError } from "expo-modules-core";

import type { PhoneNumberHintResult } from "./ExpoPhoneNumberHint.types";
import ExpoPhoneNumberHintModule from "./ExpoPhoneNumberHintModule";

export {
  PhoneNumberHintErrorCodes,
  type PhoneNumberHintErrorCode,
  type PhoneNumberHint,
  type PhoneNumberHintResult,
} from "./ExpoPhoneNumberHint.types";

/**
 * Check whether the Phone Number Hint API can be used on this device.
 * Returns `false` if Google Play Services is absent or outdated.
 *
 * This function never throws.
 *
 * @returns `true` if the phone number picker can be shown, `false` otherwise.
 */
export async function isAvailableAsync(): Promise<boolean> {
  if (!ExpoPhoneNumberHintModule.isAvailableAsync) return false;

  try {
    return await ExpoPhoneNumberHintModule.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Show the system phone number hint picker. The picker displays phone numbers
 * from the device's SIM cards and returns the user's selection.
 *
 * @returns A promise that fulfills with a `PhoneNumberHintResult`. When the
 *          user selects a number, `canceled` is `false` and `hint` holds the
 *          verbatim `number`, its derived `e164` form, and the SIM `regionCode`.
 *          When the user dismisses the picker, `canceled` is `true` and `hint`
 *          is `null`.
 *
 * @example
 * ```ts
 * const result = await showPhoneNumberHintAsync();
 * if (!result.canceled) {
 *   console.log(result.hint.e164); // "+14155551234" (or null if not derivable)
 * }
 * ```
 */
export async function showPhoneNumberHintAsync(): Promise<PhoneNumberHintResult> {
  if (!ExpoPhoneNumberHintModule.showPhoneNumberHintAsync) {
    throw new UnavailabilityError(
      "expo-phone-number-hint",
      "showPhoneNumberHintAsync",
    );
  }

  return await ExpoPhoneNumberHintModule.showPhoneNumberHintAsync();
}

/**
 * Formats a phone number as E.164 (e.g. `"+14155551234"`), validating it
 * against the region's numbering rules. Uses the `libphonenumber`
 * implementation bundled with the Android OS, so it adds nothing to your
 * app's bundle.
 *
 * On iOS and web, this returns `null`.
 *
 * @param number The phone number to format, in national or international format.
 * @param regionCode The ISO 3166-1 alpha-2 region code (e.g. `"US"`) used to
 *                   interpret `number` when it does not include a country code.
 *                   Can be omitted when `number` starts with `+`.
 * @returns The number in E.164 format, or `null` if it is not a valid phone
 *          number.
 * @platform android
 */
export function formatToE164(
  number: string,
  regionCode?: string | null,
): string | null {
  if (!ExpoPhoneNumberHintModule.formatToE164) return null;

  return ExpoPhoneNumberHintModule.formatToE164(number, regionCode || null);
}
