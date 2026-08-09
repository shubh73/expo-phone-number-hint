package expo.modules.phonenumberhint

import android.app.Activity
import android.content.Context
import android.content.IntentSender
import android.telephony.PhoneNumberUtils
import android.telephony.TelephonyManager
import android.util.Log
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

private const val TAG = "ExpoPhoneNumberHint"
private const val REQUEST_CODE = 8471

internal class PhoneNumberHintRecord(
  @Field val number: String = "",
  @Field val e164: String? = null,
  @Field val regionCode: String? = null,
) : Record

internal class PhoneNumberHintResultRecord(
  @Field val canceled: Boolean = false,
  @Field val hint: PhoneNumberHintRecord? = null,
) : Record

class ExpoPhoneNumberHintModule : Module() {

  @Volatile
  private var pendingPromise: Promise? = null

  private fun isPlayServicesAvailable(): Boolean {
    val context = appContext.reactContext ?: return false
    return GoogleApiAvailability.getInstance()
      .isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS
  }

  // The SIM is the authoritative origin of a hint, so prefer its region over the
  // network region, which is wrong while roaming.
  private fun resolveSimRegion(context: Context): String? {
    val telephonyManager =
      context.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager ?: return null
    val simRegion = telephonyManager.simCountryIso
    if (!simRegion.isNullOrBlank()) return simRegion.uppercase()
    val networkRegion = telephonyManager.networkCountryIso
    if (!networkRegion.isNullOrBlank()) return networkRegion.uppercase()
    return null
  }

  // A null region is valid input: libphonenumber can parse "+"-prefixed
  // international numbers without a default region.
  private fun toE164OrNull(number: String, regionCode: String?): String? =
    try {
      PhoneNumberUtils.formatNumberToE164(number, regionCode)
    } catch (e: Exception) {
      Log.e(TAG, "formatNumberToE164 failed", e)
      null
    }

  override fun definition() = ModuleDefinition {

    Name("ExpoPhoneNumberHint")

    AsyncFunction("isAvailableAsync") {
      isPlayServicesAvailable()
    }

    Function("formatToE164") { number: String, regionCode: String? ->
      toE164OrNull(number, regionCode?.uppercase())
    }

    AsyncFunction("getSimRegionCodeAsync") {
      appContext.reactContext?.let { resolveSimRegion(it) }
    }

    AsyncFunction("showPhoneNumberHintAsync") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null || activity.isFinishing || activity.isDestroyed) {
        throw NoActivityException()
      }

      if (!isPlayServicesAvailable()) {
        promise.reject(PlayServicesUnavailableException())
        return@AsyncFunction
      }

      if (pendingPromise != null) {
        throw AlreadyInProgressException()
      }
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
            pendingPromise?.reject(LaunchFailedException(cause = e))
            pendingPromise = null
          }
        }
        .addOnFailureListener { e ->
          Log.e(TAG, "getPhoneNumberHintIntent failed", e)
          pendingPromise?.reject(NoHintAvailableException(cause = e))
          pendingPromise = null
        }
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode != REQUEST_CODE) return@OnActivityResult

      val promise = pendingPromise ?: return@OnActivityResult
      pendingPromise = null

      if (payload.resultCode != Activity.RESULT_OK) {
        promise.resolve(PhoneNumberHintResultRecord(canceled = true))
        return@OnActivityResult
      }

      try {
        val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
        val number = Identity.getSignInClient(context)
          .getPhoneNumberFromIntent(payload.data)
        val regionCode = resolveSimRegion(context)
        promise.resolve(
          PhoneNumberHintResultRecord(
            canceled = false,
            hint = PhoneNumberHintRecord(
              number = number,
              e164 = toE164OrNull(number, regionCode),
              regionCode = regionCode,
            ),
          )
        )
      } catch (e: Exception) {
        Log.e(TAG, "getPhoneNumberFromIntent failed", e)
        promise.reject(ExtractionFailedException(cause = e))
      }
    }

    OnDestroy {
      pendingPromise?.reject(ModuleDestroyedException())
      pendingPromise = null
    }
  }
}
