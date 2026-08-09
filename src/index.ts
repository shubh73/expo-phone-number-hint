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
 * @returns A result object. On selection, `canceled` is `false` and `hint`
 *          holds the raw `number`, its derived `e164` value and the SIM
 *          `regionCode`. On dismissal, `canceled` is `true` and `hint` is `null`.
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
 * Format a phone number to E.164 (e.g. `"+14155551234"`), validating it against
 * the region's numbering rules in the process. Powered by the Android
 * framework's bundled libphonenumber, so it adds no bytes to your bundle.
 *
 * @param number A phone number in national or international format.
 * @param regionCode The ISO 3166-1 alpha-2 region (e.g. `"US"`) to interpret
 *                   `number` against when it has no country code. May be
 *                   omitted for `"+"`-prefixed international numbers, which
 *                   carry their own country code.
 * @returns The E.164 number, or `null` if it is not a valid number (for the
 *          region, when one is given). Always returns `null` on platforms
 *          other than Android.
 */
export function formatToE164(
  number: string,
  regionCode?: string | null,
): string | null {
  if (!ExpoPhoneNumberHintModule.formatToE164) return null;

  return ExpoPhoneNumberHintModule.formatToE164(number, regionCode || null);
}

/**
 * Get the ISO 3166-1 alpha-2 region code of the active SIM (e.g. `"US"`),
 * falling back to the network region. On dual-SIM devices this is the default
 * subscription's region.
 *
 * @returns The region code, or `null` if no SIM region is available or the
 *          platform is not Android.
 */
export async function getSimRegionCodeAsync(): Promise<string | null> {
  if (!ExpoPhoneNumberHintModule.getSimRegionCodeAsync) return null;

  return await ExpoPhoneNumberHintModule.getSimRegionCodeAsync();
}
