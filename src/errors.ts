import { PhoneNumberHintErrorCodes } from "./ExpoPhoneNumberHint.types";

/**
 * Error thrown by `requestPhoneNumber()` on non-cancellation failures.
 * The `code` property contains one of the `PhoneNumberHintErrorCodes` values.
 */
export class PhoneNumberHintError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PhoneNumberHintError";
    this.code = code;
  }

  /**
   * Wrap an unknown error into a `PhoneNumberHintError`.
   * If it's already a `PhoneNumberHintError`, returns it as-is.
   *
   * @param error The caught error value.
   * @returns A `PhoneNumberHintError` instance.
   */
  static from(error: unknown): PhoneNumberHintError {
    if (error instanceof PhoneNumberHintError) return error;
    if (error instanceof Error) {
      return new PhoneNumberHintError(
        (error as { code?: string }).code ?? "ERR_UNKNOWN",
        error.message,
      );
    }
    return new PhoneNumberHintError("ERR_UNKNOWN", String(error));
  }
}

/**
 * Returns `true` if the error indicates the feature is unavailable on this device
 * (Play Services missing, no SIM, or unsupported platform). Useful for deciding
 * whether to hide the phone number hint feature entirely.
 *
 * @param error The caught error value.
 * @returns `true` if the error represents an unavailability condition.
 */
export function isUnavailableError(error: unknown): boolean {
  if (error instanceof PhoneNumberHintError) {
    return (
      [
        PhoneNumberHintErrorCodes.PLAY_SERVICES_UNAVAILABLE,
        PhoneNumberHintErrorCodes.NO_HINT_AVAILABLE,
        PhoneNumberHintErrorCodes.UNSUPPORTED_PLATFORM,
      ] as string[]
    ).includes(error.code);
  }
  return false;
}
