/**
 * Error thrown by `showPhoneNumberHintAsync()` on non-cancellation failures.
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
      const code =
        "code" in error && typeof error.code === "string"
          ? error.code
          : "ERR_UNKNOWN";
      return new PhoneNumberHintError(code, error.message);
    }
    return new PhoneNumberHintError("ERR_UNKNOWN", String(error));
  }
}
