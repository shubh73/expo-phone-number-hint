package expo.modules.phonenumberhint

import expo.modules.kotlin.exception.CodedException

private fun withCauseDetail(message: String, cause: Throwable?): String =
  cause?.let { "$message${System.lineSeparator()}→ Caused by: ${it.localizedMessage ?: it}" }
    ?: message

internal class PlayServicesUnavailableException :
  CodedException("ERR_PLAY_SERVICES_UNAVAILABLE", "Google Play Services is not available", null)

internal class NoHintAvailableException(
  cause: Throwable? = null,
) : CodedException(
  "ERR_NO_HINT_AVAILABLE",
  withCauseDetail("No phone number hints available", cause),
  cause,
)

internal class LaunchFailedException(
  cause: Throwable? = null,
) : CodedException(
  "ERR_LAUNCH_FAILED",
  withCauseDetail("Failed to launch phone number picker", cause),
  cause,
)

internal class ExtractionFailedException(
  cause: Throwable? = null,
) : CodedException(
  "ERR_EXTRACTION_FAILED",
  withCauseDetail("Failed to extract phone number from result", cause),
  cause,
)

internal class NoActivityException :
  CodedException("ERR_NO_ACTIVITY", "No foreground activity available", null)

internal class AlreadyInProgressException :
  CodedException("ERR_ALREADY_IN_PROGRESS", "Phone number hint request already in progress. Await the current request first.", null)

internal class ModuleDestroyedException :
  CodedException("ERR_MODULE_DESTROYED", "Module was destroyed before result arrived", null)
