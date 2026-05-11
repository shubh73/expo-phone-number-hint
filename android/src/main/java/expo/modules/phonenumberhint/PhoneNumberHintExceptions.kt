package expo.modules.phonenumberhint

import expo.modules.kotlin.exception.CodedException

internal class PlayServicesUnavailableException :
  CodedException("ERR_PLAY_SERVICES_UNAVAILABLE", "Google Play Services is not available", null)

internal class NoHintAvailableException(
  cause: Throwable? = null,
  message: String = "No phone number hints available"
) : CodedException("ERR_NO_HINT_AVAILABLE", message, cause)

internal class LaunchFailedException(
  cause: Throwable? = null,
  message: String = "Failed to launch phone number picker"
) : CodedException("ERR_LAUNCH_FAILED", message, cause)

internal class ExtractionFailedException(
  cause: Throwable? = null,
  message: String = "Failed to extract phone number from result"
) : CodedException("ERR_EXTRACTION_FAILED", message, cause)

internal class NoActivityException :
  CodedException("ERR_NO_ACTIVITY", "No foreground activity available", null)

internal class AlreadyInProgressException :
  CodedException("ERR_ALREADY_IN_PROGRESS", "Phone number hint request already in progress. Await the current request first.", null)

internal class ModuleDestroyedException :
  CodedException("ERR_MODULE_DESTROYED", "Module was destroyed before result arrived", null)
