package `in`.gov.medcheck.data.remote

import android.util.Base64
import `in`.gov.medcheck.BuildConfig
import `in`.gov.medcheck.data.local.FlaggedBatchEntity
import `in`.gov.medcheck.domain.ScannedLabelDraft
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

data class RemoteAlertsSyncResult(
    val batches: List<FlaggedBatchEntity>,
    val dataUpdatedAt: String
)

/**
 * Communicates with MedCheck's backend proxy (server.ts).
 * The Gemini API key stays strictly on the server and is never bundled into the APK.
 */
object LabelScannerApi {

    suspend fun scanLabelImage(jpegBytes: ByteArray): Result<ScannedLabelDraft> =
        withContext(Dispatchers.IO) {
            runCatching {
                val base64 = Base64.encodeToString(jpegBytes, Base64.NO_WRAP)
                val dataUrl = "data:image/jpeg;base64,$base64"

                val endpoint = URL("${BuildConfig.BACKEND_BASE_URL.trimEnd('/')}/api/scan-label")
                val conn = (endpoint.openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    connectTimeout = 15_000
                    readTimeout = 30_000
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json")
                }

                val payload = JSONObject().apply {
                    put("imageBase64", dataUrl)
                    put("mimeType", "image/jpeg")
                }

                OutputStreamWriter(conn.outputStream, Charsets.UTF_8).use { writer ->
                    writer.write(payload.toString())
                    writer.flush()
                }

                val code = conn.responseCode
                val stream = if (code in 200..299) conn.inputStream else conn.errorStream
                val bodyText = BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).use {
                    it.readText()
                }
                conn.disconnect()

                val json = JSONObject(bodyText)
                if (code !in 200..299) {
                    throw IllegalStateException(
                        json.optString("error", "Unable to read medicine label ($code).")
                    )
                }

                val drugName = json.optString("drug_name", json.optString("medicineName", ""))
                val batchNumber = json.optString("batch_number", json.optString("batchNumber", ""))
                val manufacturer = json.optString("manufacturer", "")

                ScannedLabelDraft(
                    drugName = drugName,
                    drugNameConfidence = json.optDouble("drug_name_confidence", 0.5).toFloat(),
                    batchNumber = batchNumber,
                    batchNumberConfidence = json.optDouble("batch_number_confidence", 0.5).toFloat(),
                    manufacturer = manufacturer,
                    manufacturerConfidence = json.optDouble("manufacturer_confidence", 0.5).toFloat(),
                    notes = json.optString("notes", ""),
                    fromOcr = true
                )
            }
        }

    suspend fun fetchAlerts(): Result<RemoteAlertsSyncResult> =
        withContext(Dispatchers.IO) {
            runCatching {
                val endpoint = URL("${BuildConfig.BACKEND_BASE_URL.trimEnd('/')}/api/alerts")
                val conn = (endpoint.openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    connectTimeout = 10_000
                    readTimeout = 15_000
                }
                val code = conn.responseCode
                val bodyText = BufferedReader(
                    InputStreamReader(
                        if (code in 200..299) conn.inputStream else conn.errorStream,
                        Charsets.UTF_8
                    )
                ).use { it.readText() }
                conn.disconnect()

                if (code !in 200..299) {
                    throw IllegalStateException("Alerts sync failed ($code)")
                }

                val json = JSONObject(bodyText)
                val updatedAt = json.optString("dataUpdatedAt", "")
                val arr = json.optJSONArray("alerts")
                val list = mutableListOf<FlaggedBatchEntity>()
                if (arr != null) {
                    for (i in 0 until arr.length()) {
                        val obj = arr.getJSONObject(i)
                        list.add(
                            FlaggedBatchEntity(
                                id = obj.optString("id", "remote-$i"),
                                drugName = obj.optString("medicineName", ""),
                                genericName = obj.optString("genericName", ""),
                                batchNumber = obj.optString("batchNumber", ""),
                                manufacturer = obj.optString("manufacturer", ""),
                                reasonSummary = obj.optString("reasonSummary", ""),
                                state = obj.optString("state", ""),
                                alertMonth = obj.optString("alertMonth", ""),
                                bulletinSource = obj.optString("bulletinSource", ""),
                                testingLab = obj.optString("testingLab", ""),
                                severity = obj.optString("severity", "nsq"),
                                datasetLabel = "CDSCO"
                            )
                        )
                    }
                }
                RemoteAlertsSyncResult(batches = list, dataUpdatedAt = updatedAt)
            }
        }
}
