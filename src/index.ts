import { UnavailabilityError } from "expo-modules-core";

import ExpoPhoneNumberHintModule from "./ExpoPhoneNumberHintModule";

export {
  PhoneNumberHintErrorCodes,
  type PhoneNumberHintErrorCode,
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
 * @returns The selected phone number in E.164 format (e.g. `"+14155551234"`),
 *          or `null` if the user dismissed the picker.
 *
 * @example
 * ```ts
 * const phoneNumber = await showPhoneNumberHintAsync();
 * if (phoneNumber) {
 *   // user selected a number
 * } else {
 *   // user dismissed
 * }
 * ```
 */
export async function showPhoneNumberHintAsync(): Promise<string | null> {
  if (!ExpoPhoneNumberHintModule.showPhoneNumberHintAsync) {
    throw new UnavailabilityError(
      "expo-phone-number-hint",
      "showPhoneNumberHintAsync",
    );
  }

  return await ExpoPhoneNumberHintModule.showPhoneNumberHintAsync();
}
