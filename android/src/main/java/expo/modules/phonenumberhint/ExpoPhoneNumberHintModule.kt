package expo.modules.phonenumberhint

import android.app.Activity
import android.content.IntentSender
import android.util.Log
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val TAG = "ExpoPhoneNumberHint"
private const val REQUEST_CODE = 8471

class ExpoPhoneNumberHintModule : Module() {

  @Volatile
  private var pendingPromise: Promise? = null

  private fun isPlayServicesAvailable(): Boolean {
    val context = appContext.reactContext ?: return false
    return GoogleApiAvailability.getInstance()
      .isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS
  }

  override fun definition() = ModuleDefinition {

    Name("ExpoPhoneNumberHint")

    AsyncFunction("isAvailable") {
      isPlayServicesAvailable()
    }

    AsyncFunction("requestPhoneNumber") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null || activity.isFinishing || activity.isDestroyed) {
        throw NoActivityException()
      }

      if (!isPlayServicesAvailable()) {
        promise.reject(PlayServicesUnavailableException())
        return@AsyncFunction
      }

      pendingPromise?.reject(InterruptedException())
      pendingPromise = promise

      val request = GetPhoneNumberHintIntentRequest.builder().build()
      val currentPromise = promise

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
            if (pendingPromise === currentPromise) {
              pendingPromise = null
              currentPromise.reject(LaunchFailedException(e))
            }
          }
        }
        .addOnFailureListener { e ->
          Log.e(TAG, "getPhoneNumberHintIntent failed", e)
          if (pendingPromise === currentPromise) {
            pendingPromise = null
            currentPromise.reject(NoHintAvailableException(e))
          }
        }
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode != REQUEST_CODE) return@OnActivityResult

      val promise = pendingPromise ?: return@OnActivityResult
      pendingPromise = null

      if (payload.resultCode != Activity.RESULT_OK) {
        promise.resolve(null)
        return@OnActivityResult
      }

      try {
        val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
        val phoneNumber = Identity.getSignInClient(context)
          .getPhoneNumberFromIntent(payload.data)
        promise.resolve(phoneNumber)
      } catch (e: Exception) {
        Log.e(TAG, "getPhoneNumberFromIntent failed", e)
        promise.reject(ExtractionFailedException(e))
      }
    }

    OnDestroy {
      pendingPromise?.reject(ModuleDestroyedException())
      pendingPromise = null
    }
  }
}
