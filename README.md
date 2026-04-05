# expo-phone-number-hint

A system-level phone number picker powered by Google's [Phone Number Hint API](https://developer.android.com/identity/phone-number-hint). Shows a bottom-sheet with the device's SIM-based phone numbers and returns the selection in E.164 format.

## Installation

```
npx expo install expo-phone-number-hint
```

No additional setup required.

## API

### `isAvailable()`

```typescript
function isAvailable(): Promise<boolean>
```

Check whether the Phone Number Hint API can be used on this device. Never throws.

### `requestPhoneNumber()`

```typescript
function requestPhoneNumber(): Promise<string | null>
```

Show the system phone number picker.

Returns the selected phone number in E.164 format (e.g. `"+14155551234"`), or `null` if the user dismissed the picker.

Throws `PhoneNumberHintError` on failure.

### Error codes

| Code | Meaning |
|------|---------|
| `ERR_PLAY_SERVICES_UNAVAILABLE` | Google Play Services missing or outdated |
| `ERR_NO_HINT_AVAILABLE` | No phone numbers available (no SIM / no stored numbers) |
| `ERR_NO_ACTIVITY` | No foreground activity |
| `ERR_LAUNCH_FAILED` | Failed to launch the picker |
| `ERR_EXTRACTION_FAILED` | Failed to extract phone number from result |
| `ERR_INTERRUPTED` | A new request superseded a pending one |
| `ERR_UNSUPPORTED_PLATFORM` | Called on iOS or web |

### `isUnavailableError(error)`

```typescript
function isUnavailableError(error: unknown): boolean
```

Returns `true` if the error indicates the feature is unavailable on this device — useful for deciding whether to hide the feature entirely.

## Usage

```typescript
import { requestPhoneNumber } from "expo-phone-number-hint";

const phoneNumber = await requestPhoneNumber();

if (phoneNumber) {
  // User selected a number
  console.log(phoneNumber); // "+919876543210"
} else {
  // User dismissed the picker
}
```

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.
