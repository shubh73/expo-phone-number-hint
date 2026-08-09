# expo-phone-number-hint

[![npm](https://img.shields.io/npm/v/expo-phone-number-hint?color=black)](https://www.npmjs.com/package/expo-phone-number-hint)
[![CI](https://img.shields.io/github/actions/workflow/status/shubh73/expo-phone-number-hint/ci.yml?label=ci&color=black)](https://github.com/shubh73/expo-phone-number-hint/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/shubh73/expo-phone-number-hint?color=black)](LICENSE)

Provides a frictionless way to show a user's (SIM-based) phone numbers as a hint, powered by Google's [Phone Number Hint API](https://developer.android.com/identity/phone-number-hint).

![demo](docs/demo.gif)

## Installation

```
npx expo install expo-phone-number-hint
```

## Usage

```typescript
import {
  isAvailableAsync,
  showPhoneNumberHintAsync,
} from "expo-phone-number-hint";

const isAvailable = await isAvailableAsync();
if (isAvailable) {
  const result = await showPhoneNumberHintAsync();

  if (!result.canceled) {
    // user selected a number
    console.log(result.hint.number); // raw value from Play Services
    console.log(result.hint.e164); // "+919876543210" (or null if not derivable)
    console.log(result.hint.regionCode); // "IN" (or null)
  } else {
    // user dismissed the picker
  }
}
```

## API

### `isAvailableAsync()`

```typescript
function isAvailableAsync(): Promise<boolean>
```

Check whether the Phone Number Hint API can be used on this device. Never throws.

### `showPhoneNumberHintAsync()`

```typescript
function showPhoneNumberHintAsync(): Promise<PhoneNumberHintResult>
```

Show the system phone number picker. Resolves to a result object:

```typescript
type PhoneNumberHintResult =
  | { canceled: false; hint: PhoneNumberHint }
  | { canceled: true; hint: null };

type PhoneNumberHint = {
  /** The verbatim string returned by Google Play Services. Never modified. */
  number: string;
  /** E.164 (e.g. "+14155551234"), or null if not a valid number for the region. */
  e164: string | null;
  /** ISO 3166-1 alpha-2 region of the active SIM, or null. */
  regionCode: string | null;
};
```

The hint `number` comes from Play Services SIM/device metadata and is **not** guaranteed to be in any particular format; `e164` is derived from it (using `regionCode`) as a convenience. Treat the derivation as best-effort and validate before trusting it.

Throws an error with a `code` property on failure. See [Handling errors](#handling-errors) below.

### `formatToE164(number, regionCode?)`

```typescript
function formatToE164(number: string, regionCode?: string | null): string | null
```

Format a phone number to E.164, validating it against the region's numbering rules. `regionCode` is an ISO 3166-1 alpha-2 code (e.g. `"US"`), used when `number` has no country code; it may be omitted for `"+"`-prefixed international numbers, which carry their own. Returns `null` if the number is not valid. Powered by the Android framework's bundled libphonenumber, so it adds no bytes to your bundle. Returns `null` on platforms other than Android.

### `getSimRegionCodeAsync()`

```typescript
function getSimRegionCodeAsync(): Promise<string | null>
```

Get the ISO 3166-1 alpha-2 region code of the active SIM (falling back to the network region), e.g. `"US"`. Returns `null` if unavailable or not on Android. On dual-SIM devices this is the default subscription's region — a number picked from the other SIM may belong to a different country when the SIMs are from different countries (per-SIM regions would require the `READ_PHONE_STATE` permission, which this library does not request).

## Handling errors

All known codes are exported as `PhoneNumberHintErrorCodes`.

| Code | Meaning |
|------|---------|
| `ERR_PLAY_SERVICES_UNAVAILABLE` | Google Play Services is unavailable |
| `ERR_NO_HINT_AVAILABLE` | No phone number hints available |
| `ERR_NO_ACTIVITY` | No foreground activity |
| `ERR_LAUNCH_FAILED` | Failed to launch the picker |
| `ERR_EXTRACTION_FAILED` | Failed to extract phone number from result |
| `ERR_ALREADY_IN_PROGRESS` | Another request is already showing the picker |
| `ERR_MODULE_DESTROYED` | Module destroyed before result was delivered |
| `ERR_UNAVAILABLE` | Called on a platform where the picker is not available (iOS or web) |

## Play Services Auth version

Defaults to `com.google.android.gms:play-services-auth:21.5.1`. To override, set `playServicesAuthVersion` in your root `android/build.gradle`:

```gradle
ext {
  playServicesAuthVersion = "21.4.0"
}
```
