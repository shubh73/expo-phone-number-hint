import { PhoneNumberHintErrorCodes } from "./ExpoPhoneNumberHint.types";
import ExpoPhoneNumberHintModule from "./ExpoPhoneNumberHintModule";
import { PhoneNumberHintError } from "./errors";

export {
  PhoneNumberHintErrorCodes,
  type PhoneNumberHintErrorCode,
} from "./ExpoPhoneNumberHint.types";
export { PhoneNumberHintError, isUnavailableError } from "./errors";

/**
 * Check whether the Phone Number Hint API can be used on this device.
 * Returns `false` if Google Play Services is absent or outdated.
 *
 * This function never throws.
 *
 * @returns `true` if the phone number picker can be shown, `false` otherwise.
 */
export async function isAvailable(): Promise<boolean> {
  if (!ExpoPhoneNumberHintModule.isAvailable) return false;

  try {
    return await ExpoPhoneNumberHintModule.isAvailable();
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
 * const phoneNumber = await requestPhoneNumber();
 * if (phoneNumber) {
 *   // user selected a number
 * } else {
 *   // user dismissed
 * }
 * ```
 */
export async function requestPhoneNumber(): Promise<string | null> {
  if (!ExpoPhoneNumberHintModule.requestPhoneNumber) {
    throw new PhoneNumberHintError(
      PhoneNumberHintErrorCodes.UNSUPPORTED_PLATFORM,
      "expo-phone-number-hint is only supported on Android.",
    );
  }

  try {
    return await ExpoPhoneNumberHintModule.requestPhoneNumber();
  } catch (e) {
    throw PhoneNumberHintError.from(e);
  }
}
