/**
 * All error codes that can be thrown by `showPhoneNumberHintAsync()`.
 */
export const PhoneNumberHintErrorCodes = {
  /** Google Play Services is unavailable. */
  PLAY_SERVICES_UNAVAILABLE: "ERR_PLAY_SERVICES_UNAVAILABLE",
  /** No phone number hints available. */
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
  /** Called on a platform where the picker is not available (iOS or web). */
  UNAVAILABLE: "ERR_UNAVAILABLE",
} as const;

/**
 * Union of all error code string literals.
 */
export type PhoneNumberHintErrorCode =
  (typeof PhoneNumberHintErrorCodes)[keyof typeof PhoneNumberHintErrorCodes];

/**
 * A phone number selected from the system hint picker.
 */
export type PhoneNumberHint = {
  /**
   * The phone number as returned by Google Play Services.
   */
  number: string;
  /**
   * The number in E.164 format (e.g. `"+14155551234"`), derived from `number`
   * and `regionCode` as a best-effort convenience, or `null` if `number`
   * could not be validated as a phone number.
   */
  e164: string | null;
  /**
   * The ISO 3166-1 alpha-2 region code of the active SIM used to derive
   * `e164`, or `null` if no SIM region was available. If the device has dual
   * SIM cards, this is the region for the default subscription, which may not
   * be the SIM the selected number belongs to — reading per-SIM regions would
   * require the `READ_PHONE_STATE` permission, which this library does not
   * request.
   */
  regionCode: string | null;
};

/**
 * The result of `showPhoneNumberHintAsync()`. Check `canceled` to determine
 * whether the user selected a number or dismissed the picker.
 */
export type PhoneNumberHintResult =
  | { canceled: false; hint: PhoneNumberHint }
  | { canceled: true; hint: null };
