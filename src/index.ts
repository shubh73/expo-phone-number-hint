import { PhoneNumberHintErrorCodes } from "./ExpoPhoneNumberHint.types";
import ExpoPhoneNumberHintModule from "./ExpoPhoneNumberHintModule";
import { PhoneNumberHintError } from "./errors";

export {
  PhoneNumberHintErrorCodes,
  type PhoneNumberHintErrorCode,
} from "./ExpoPhoneNumberHint.types";
export { PhoneNumberHintError } from "./errors";

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
    throw new PhoneNumberHintError(
      PhoneNumberHintErrorCodes.UNSUPPORTED_PLATFORM,
      "expo-phone-number-hint is only supported on Android.",
    );
  }

  try {
    return await ExpoPhoneNumberHintModule.showPhoneNumberHintAsync();
  } catch (e) {
    throw PhoneNumberHintError.from(e);
  }
}
