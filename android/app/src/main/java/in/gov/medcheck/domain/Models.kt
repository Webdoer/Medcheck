package `in`.gov.medcheck.domain

import `in`.gov.medcheck.data.local.FlaggedBatchEntity

enum class AppLanguage(
    val code: String,
    val nativeName: String,
    val englishName: String,
    val localeTag: String
) {
    HI("hi", "हिंदी", "Hindi", "hi-IN"),
    EN("en", "English", "English", "en-IN"),
    TA("ta", "தமிழ்", "Tamil", "ta-IN"),
    BN("bn", "বাংলা", "Bengali", "bn-IN"),
    MR("mr", "मराठी", "Marathi", "mr-IN"),
    TE("te", "తెలుగు", "Telugu", "te-IN");

    companion object {
        fun fromCode(code: String?): AppLanguage =
            entries.firstOrNull { it.code.equals(code, ignoreCase = true) } ?: HI
    }
}

enum class BottomNavTab {
    HOME,
    SCAN,
    HISTORY,
    HELP
}

sealed interface AppScreen {
    data object LanguagePicker : AppScreen
    data class MainTab(val tab: BottomNavTab) : AppScreen
    data object Confirm : AppScreen
    data object Checking : AppScreen
    data object Result : AppScreen
}

data class ScannedLabelDraft(
    val drugName: String = "",
    val drugNameConfidence: Float = 1.0f,
    val batchNumber: String = "",
    val batchNumberConfidence: Float = 1.0f,
    val manufacturer: String = "",
    val manufacturerConfidence: Float = 1.0f,
    val notes: String = "",
    val fromOcr: Boolean = false
) {
    val isDrugLowConfidence: Boolean get() = fromOcr && drugNameConfidence < 0.7f
    val isBatchLowConfidence: Boolean get() = fromOcr && batchNumberConfidence < 0.7f
    val isManufacturerLowConfidence: Boolean get() = fromOcr && manufacturerConfidence < 0.7f
}

data class BatchDiffChar(
    val char: Char,
    val isDifferent: Boolean
)

enum class MatchReason {
    LOOKALIKE,
    FUZZY_TYPO,
    DRUG_NAME_MATCH
}

data class PossibleMatchCandidate(
    val batch: FlaggedBatchEntity,
    val reason: MatchReason,
    val userDiff: List<BatchDiffChar>,
    val alertDiff: List<BatchDiffChar>
)

sealed interface VerificationOutcome {
    val queryDrugName: String
    val queryBatchNumber: String
    val checkedAtEpochMs: Long
    val dataUpdatedAt: String

    data class Flagged(
        override val queryDrugName: String,
        override val queryBatchNumber: String,
        val matchedBatch: FlaggedBatchEntity,
        override val checkedAtEpochMs: Long,
        override val dataUpdatedAt: String
    ) : VerificationOutcome

    data class PossibleMatch(
        override val queryDrugName: String,
        override val queryBatchNumber: String,
        val candidates: List<PossibleMatchCandidate>,
        override val checkedAtEpochMs: Long,
        override val dataUpdatedAt: String
    ) : VerificationOutcome

    data class NotFound(
        override val queryDrugName: String,
        override val queryBatchNumber: String,
        override val checkedAtEpochMs: Long,
        override val dataUpdatedAt: String
    ) : VerificationOutcome
}
