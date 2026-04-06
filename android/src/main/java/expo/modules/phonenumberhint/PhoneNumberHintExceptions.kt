package expo.modules.phonenumberhint

import expo.modules.kotlin.exception.CodedException

internal class PlayServicesUnavailableException :
  CodedException("Google Play Services is not available")

internal class NoHintAvailableException(cause: Throwable? = null) :
  CodedException("No phone number hints available", cause)

internal class LaunchFailedException(cause: Throwable? = null) :
  CodedException("Failed to launch phone number picker", cause)

internal class ExtractionFailedException(cause: Throwable? = null) :
  CodedException("Failed to extract phone number from result", cause)

internal class NoActivityException :
  CodedException("No foreground activity available")

internal class AlreadyInProgressException :
  CodedException("Phone number hint request already in progress. Await the current request first.")

internal class ModuleDestroyedException :
  CodedException("Module was destroyed before result arrived")
