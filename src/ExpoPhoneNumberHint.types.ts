/**
 * All error codes that can be thrown by `requestPhoneNumber()`.
 */
export const PhoneNumberHintErrorCodes = {
  /** Google Play Services is missing or outdated. */
  PLAY_SERVICES_UNAVAILABLE: "ERR_PLAY_SERVICES_UNAVAILABLE",
  /** No phone number hints available (no SIM or no stored numbers). */
  NO_HINT_AVAILABLE: "ERR_NO_HINT_AVAILABLE",
  /** No foreground activity available. */
  NO_ACTIVITY: "ERR_NO_ACTIVITY",
  /** Failed to launch the system phone number picker. */
  LAUNCH_FAILED: "ERR_LAUNCH_FAILED",
  /** Failed to extract the phone number from the picker result. */
  EXTRACTION_FAILED: "ERR_EXTRACTION_FAILED",
  /** Another request is already in progress. Await the current request first. */
  ALREADY_IN_PROGRESS: "ERR_ALREADY_IN_PROGRESS",
  /** The native module was destroyed before a result was received. */
  MODULE_DESTROYED: "ERR_MODULE_DESTROYED",
  /** Called on a platform that does not support this API (iOS, web). */
  UNSUPPORTED_PLATFORM: "ERR_UNSUPPORTED_PLATFORM",
} as const;

/**
 * Union of all error code string literals.
 */
export type PhoneNumberHintErrorCode =
  (typeof PhoneNumberHintErrorCodes)[keyof typeof PhoneNumberHintErrorCodes];
