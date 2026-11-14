package `in`.gov.medcheck.util

import android.content.Context
import android.content.Intent
import android.net.Uri

object HelplineHelper {
    const val CDSCO_HELPLINE = "1800114477"
    const val CDSCO_HELPLINE_DISPLAY = "1800-11-4477"

    fun dialHelpline(context: Context) {
        val intent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:$CDSCO_HELPLINE")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }
}
