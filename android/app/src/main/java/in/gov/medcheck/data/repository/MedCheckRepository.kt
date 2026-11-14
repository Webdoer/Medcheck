package `in`.gov.medcheck.data.repository

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import `in`.gov.medcheck.data.local.CheckHistoryEntity
import `in`.gov.medcheck.data.local.DemoSeedData
import `in`.gov.medcheck.data.local.FlaggedBatchEntity
import `in`.gov.medcheck.data.local.MedCheckDatabase
import `in`.gov.medcheck.data.remote.LabelScannerApi
import `in`.gov.medcheck.domain.AppLanguage
import `in`.gov.medcheck.domain.BatchMatcher
import `in`.gov.medcheck.domain.ScannedLabelDraft
import `in`.gov.medcheck.domain.VerificationOutcome
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.distinctUntilChanged

class MedCheckRepository(context: Context) {
    private val appContext = context.applicationContext
    private val dao = MedCheckDatabase.getInstance(appContext).medCheckDao()
    private val prefs = appContext.getSharedPreferences("medcheck_prefs", Context.MODE_PRIVATE)

    fun getSelectedLanguage(): AppLanguage =
        AppLanguage.fromCode(prefs.getString("language_code", AppLanguage.HI.code))

    fun hasCompletedLanguagePicker(): Boolean =
        prefs.getBoolean("language_picked", false)

    fun saveLanguage(language: AppLanguage, markPicked: Boolean = true) {
        prefs.edit()
            .putString("language_code", language.code)
            .putBoolean("language_picked", markPicked)
            .apply()
    }

    fun getDataLastUpdated(): String =
        prefs.getString("data_updated_at", DemoSeedData.DEMO_UPDATED_AT)
            ?: DemoSeedData.DEMO_UPDATED_AT

    fun observeFlaggedBatches(): Flow<List<FlaggedBatchEntity>> = dao.observeFlaggedBatches()

    fun observeHistory(): Flow<List<CheckHistoryEntity>> = dao.observeRecentHistory()

    suspend fun ensureSeededAndSync(): String {
        if (dao.countFlaggedBatches() == 0) {
            dao.insertFlaggedBatches(DemoSeedData.flaggedBatches)
        }
        val remote = LabelScannerApi.fetchAlerts().getOrNull()
        if (remote != null && remote.batches.isNotEmpty()) {
            dao.insertFlaggedBatches(remote.batches)
            if (remote.dataUpdatedAt.isNotBlank()) {
                prefs.edit().putString("data_updated_at", remote.dataUpdatedAt).apply()
            }
        }
        return getDataLastUpdated()
    }

    suspend fun scanLabelViaBackend(jpegBytes: ByteArray): Result<ScannedLabelDraft> =
        LabelScannerApi.scanLabelImage(jpegBytes)

    suspend fun verifyBatchAndRecord(
        drugName: String,
        batchNumber: String
    ): VerificationOutcome {
        if (dao.countFlaggedBatches() == 0) {
            dao.insertFlaggedBatches(DemoSeedData.flaggedBatches)
        }
        val flaggedList = dao.getAllFlaggedBatches()
        val outcome = BatchMatcher.match(
            drugQuery = drugName,
            batchQuery = batchNumber,
            flaggedList = flaggedList,
            dataUpdatedAt = getDataLastUpdated()
        )
        recordOutcome(outcome)
        return outcome
    }

    suspend fun recordConfirmedMatch(
        queryDrugName: String,
        batch: FlaggedBatchEntity
    ): VerificationOutcome.Flagged {
        val flagged = VerificationOutcome.Flagged(
            queryDrugName = queryDrugName.ifBlank { batch.drugName },
            queryBatchNumber = batch.batchNumber,
            matchedBatch = batch,
            checkedAtEpochMs = System.currentTimeMillis(),
            dataUpdatedAt = getDataLastUpdated()
        )
        recordOutcome(flagged)
        return flagged
    }

    suspend fun recordNotFound(
        queryDrugName: String,
        queryBatchNumber: String
    ): VerificationOutcome.NotFound {
        val notFound = VerificationOutcome.NotFound(
            queryDrugName = queryDrugName.ifBlank { "Medicine Label" },
            queryBatchNumber = queryBatchNumber.ifBlank { "—" },
            checkedAtEpochMs = System.currentTimeMillis(),
            dataUpdatedAt = getDataLastUpdated()
        )
        recordOutcome(notFound)
        return notFound
    }

    suspend fun openHistoryRecord(record: CheckHistoryEntity): VerificationOutcome {
        val flaggedList = dao.getAllFlaggedBatches()
        if (record.status == "flagged" && record.matchedBatchId != null) {
            val matched = dao.getFlaggedBatchById(record.matchedBatchId)
            if (matched != null) {
                return VerificationOutcome.Flagged(
                    queryDrugName = record.queryDrugName,
                    queryBatchNumber = record.queryBatchNumber,
                    matchedBatch = matched,
                    checkedAtEpochMs = record.checkedAtEpochMs,
                    dataUpdatedAt = record.dataUpdatedAt
                )
            }
        }
        return BatchMatcher.match(
            drugQuery = record.queryDrugName,
            batchQuery = record.queryBatchNumber,
            flaggedList = flaggedList,
            dataUpdatedAt = record.dataUpdatedAt,
            nowMs = record.checkedAtEpochMs
        )
    }

    suspend fun deleteHistoryItem(id: Long) = dao.deleteHistoryItem(id)

    suspend fun clearHistory() = dao.clearAllHistory()

    private suspend fun recordOutcome(outcome: VerificationOutcome) {
        val (status, matchedId) = when (outcome) {
            is VerificationOutcome.Flagged -> "flagged" to outcome.matchedBatch.id
            is VerificationOutcome.PossibleMatch -> "possible_match" to outcome.candidates.firstOrNull()?.batch?.id
            is VerificationOutcome.NotFound -> "not_found" to null
        }
        dao.recordCheckAndTrim(
            CheckHistoryEntity(
                queryDrugName = outcome.queryDrugName,
                queryBatchNumber = outcome.queryBatchNumber,
                status = status,
                matchedBatchId = matchedId,
                checkedAtEpochMs = outcome.checkedAtEpochMs,
                dataUpdatedAt = outcome.dataUpdatedAt
            )
        )
    }

    fun observeIsOnline(): Flow<Boolean> = callbackFlow {
        val cm = appContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

        fun checkNow(): Boolean {
            val net = cm.activeNetwork ?: return false
            val caps = cm.getNetworkCapabilities(net) ?: return false
            return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
        }

        trySend(checkNow())

        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                trySend(true)
            }

            override fun onLost(network: Network) {
                trySend(checkNow())
            }
        }
        cm.registerDefaultNetworkCallback(callback)
        awaitClose { cm.unregisterNetworkCallback(callback) }
    }.distinctUntilChanged()
}
