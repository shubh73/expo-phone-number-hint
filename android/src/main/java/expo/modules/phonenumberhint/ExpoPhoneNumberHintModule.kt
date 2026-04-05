package expo.modules.phonenumberhint

import android.app.Activity
import android.content.Context
import android.content.IntentSender
import android.util.Log
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val TAG = "ExpoPhoneNumberHint"
private const val REQUEST_CODE = 8471

class ExpoPhoneNumberHintModule : Module() {

  @Volatile
  private var pendingPromise: Promise? = null

  private val context: Context
    get() = appContext.reactContext ?: throw CodedException("ERR_CONTEXT", "React context is unavailable", null)

  override fun definition() = ModuleDefinition {

    Name("ExpoPhoneNumberHint")

    // region Functions

    AsyncFunction("isAvailable") {
      val result = GoogleApiAvailability.getInstance()
        .isGooglePlayServicesAvailable(context)
      result == ConnectionResult.SUCCESS
    }

    AsyncFunction("requestPhoneNumber") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null || activity.isFinishing || activity.isDestroyed) {
        promise.reject(CodedException("ERR_NO_ACTIVITY", "No foreground activity available", null))
        return@AsyncFunction
      }

      val playServicesResult = GoogleApiAvailability.getInstance()
        .isGooglePlayServicesAvailable(context)
      if (playServicesResult != ConnectionResult.SUCCESS) {
        promise.reject(
          CodedException(
            "ERR_PLAY_SERVICES_UNAVAILABLE",
            "Google Play Services is not available (status: $playServicesResult)",
            null
          )
        )
        return@AsyncFunction
      }

      // Reject any in-flight request before starting a new one
      pendingPromise?.reject(
        CodedException("ERR_INTERRUPTED", "A new request superseded this one", null)
      )
      pendingPromise = promise

      val request = GetPhoneNumberHintIntentRequest.builder().build()

      Identity.getSignInClient(activity)
        .getPhoneNumberHintIntent(request)
        .addOnSuccessListener { pendingIntent ->
          try {
            activity.startIntentSenderForResult(
              pendingIntent.intentSender,
              REQUEST_CODE,
              null, 0, 0, 0
            )
          } catch (e: IntentSender.SendIntentException) {
            Log.e(TAG, "Failed to launch phone number hint picker", e)
            pendingPromise?.reject(
              CodedException("ERR_LAUNCH_FAILED", e.message ?: "Failed to launch phone number picker", null)
            )
            pendingPromise = null
          }
        }
        .addOnFailureListener { e ->
          // Task failure typically means no SIM numbers available or Play Services issue
          Log.e(TAG, "getPhoneNumberHintIntent failed", e)
          pendingPromise?.reject(
            CodedException("ERR_NO_HINT_AVAILABLE", e.message ?: "No phone number hints available", null)
          )
          pendingPromise = null
        }
    }

    // endregion

    // region Lifecycle

    OnActivityResult { _, payload ->
      if (payload.requestCode != REQUEST_CODE) return@OnActivityResult

      val promise = pendingPromise ?: return@OnActivityResult
      pendingPromise = null

      if (payload.resultCode != Activity.RESULT_OK) {
        // User dismissed the picker — resolve null, not an error
        promise.resolve(null)
        return@OnActivityResult
      }

      try {
        val phoneNumber = Identity.getSignInClient(appContext.currentActivity ?: context)
          .getPhoneNumberFromIntent(payload.data)
        promise.resolve(phoneNumber)
      } catch (e: Exception) {
        Log.e(TAG, "getPhoneNumberFromIntent failed", e)
        promise.reject(
          CodedException("ERR_EXTRACTION_FAILED", e.message ?: "Failed to extract phone number from result", null)
        )
      }
    }

    OnDestroy {
      pendingPromise?.reject(
        CodedException("ERR_MODULE_DESTROYED", "Module was destroyed before result arrived", null)
      )
      pendingPromise = null
    }

    // endregion
  }
}
