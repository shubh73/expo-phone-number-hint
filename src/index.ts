import { PhoneNumberHintErrorCodes } from "./ExpoPhoneNumberHint.types";
import { PhoneNumberHintError } from "./errors";

export {
  PhoneNumberHintErrorCodes,
  type PhoneNumberHintErrorCode,
} from "./ExpoPhoneNumberHint.types";
export { PhoneNumberHintError, isUnavailableError } from "./errors";

/**
 * Check whether the Phone Number Hint API can be used on this device.
 * Always returns `false` on non-Android platforms.
 *
 * @returns `false`.
 */
export async function isAvailable(): Promise<boolean> {
  return false;
}

/**
 * Not supported on this platform. Always throws `PhoneNumberHintError`
 * with code `ERR_UNSUPPORTED_PLATFORM`.
 */
export async function requestPhoneNumber(): Promise<string | null> {
  throw new PhoneNumberHintError(
    PhoneNumberHintErrorCodes.UNSUPPORTED_PLATFORM,
    "expo-phone-number-hint is only supported on Android.",
  );
}
