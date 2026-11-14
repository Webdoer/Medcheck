package `in`.gov.medcheck.domain

import `in`.gov.medcheck.data.local.FlaggedBatchEntity
import kotlin.math.max
import kotlin.math.min

object BatchMatcher {

    private val prefixRegex = Regex(
        pattern = "^(B\\.?\\s*NO\\.?|BATCH\\s*NO\\.?|BATCH|LOT)\\s*[:#-]\\s*",
        option = RegexOption.IGNORE_CASE
    )

    fun normalizeBatchCode(raw: String): String {
        return raw.uppercase()
            .replace(prefixRegex, "")
            .replace(Regex("[^A-Z0-9]"), "")
    }

    /**
     * Normalises visually confusable characters printed on foil/labels:
     * 0/O, 1/I/L, 5/S, 8/B
     */
    fun normalizeLookalikes(normalized: String): String {
        return normalized
            .replace('O', '0')
            .replace('I', '1')
            .replace('L', '1')
            .replace('S', '5')
            .replace('B', '8')
    }

    fun levenshteinDistance(a: String, b: String): Int {
        val m = a.length
        val n = b.length
        if (m == 0) return n
        if (n == 0) return m

        val dp = Array(m + 1) { IntArray(n + 1) }
        for (i in 0..m) dp[i][0] = i
        for (j in 0..n) dp[0][j] = j

        for (i in 1..m) {
            for (j in 1..n) {
                val cost = if (a[i - 1] == b[j - 1]) 0 else 1
                dp[i][j] = min(
                    min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost
                )
            }
        }
        return dp[m][n]
    }

    fun computeCharDiff(userInput: String, alertBatch: String): Pair<List<BatchDiffChar>, List<BatchDiffChar>> {
        val uClean = userInput.uppercase().removePrefix("#").trim()
        val aClean = alertBatch.uppercase().removePrefix("#").trim()
        val maxLen = max(uClean.length, aClean.length)

        val userDiff = mutableListOf<BatchDiffChar>()
        val alertDiff = mutableListOf<BatchDiffChar>()

        for (i in 0 until maxLen) {
            val uc = uClean.getOrNull(i)
            val ac = aClean.getOrNull(i)
            val isDiff = uc != ac
            if (uc != null) userDiff.add(BatchDiffChar(uc, isDiff))
            if (ac != null) alertDiff.add(BatchDiffChar(ac, isDiff))
        }
        return userDiff to alertDiff
    }

    private fun drugTokenOverlap(queryDrug: String, item: FlaggedBatchEntity): Double {
        val tokens = queryDrug.lowercase()
            .replace(Regex("[^a-z0-9\\s]"), " ")
            .split(Regex("\\s+"))
            .filter { it.length >= 3 }
        if (tokens.isEmpty()) return 0.0

        val target = "${item.drugName} ${item.genericName}".lowercase()
        val matched = tokens.count { target.contains(it) }
        return matched.toDouble() / tokens.size.toDouble()
    }

    fun match(
        drugQuery: String,
        batchQuery: String,
        flaggedList: List<FlaggedBatchEntity>,
        dataUpdatedAt: String,
        nowMs: Long = System.currentTimeMillis()
    ): VerificationOutcome {
        val trimmedDrug = drugQuery.trim()
        val trimmedBatch = batchQuery.trim()
        val normBatch = normalizeBatchCode(trimmedBatch)
        val lookalikeQuery = normalizeLookalikes(normBatch)

        // 1. Exact batch match -> Flagged immediately
        if (normBatch.length >= 3) {
            val exact = flaggedList.firstOrNull { normalizeBatchCode(it.batchNumber) == normBatch }
            if (exact != null) {
                return VerificationOutcome.Flagged(
                    queryDrugName = trimmedDrug.ifBlank { exact.drugName },
                    queryBatchNumber = trimmedBatch.ifBlank { exact.batchNumber },
                    matchedBatch = exact,
                    checkedAtEpochMs = nowMs,
                    dataUpdatedAt = dataUpdatedAt
                )
            }
        }

        // 2. Look-alike (0/O, 1/I, 5/S, 8/B), fuzzy Levenshtein, or drug-name match -> PossibleMatch
        val candidates = mutableListOf<PossibleMatchCandidate>()
        val seenIds = mutableSetOf<String>()

        for (item in flaggedList) {
            val alertNorm = normalizeBatchCode(item.batchNumber)
            val alertLookalike = normalizeLookalikes(alertNorm)
            val drugScore = if (trimmedDrug.isNotBlank()) drugTokenOverlap(trimmedDrug, item) else 0.0

            if (normBatch.length >= 3) {
                if (lookalikeQuery == alertLookalike) {
                    seenIds.add(item.id)
                    val (uDiff, aDiff) = computeCharDiff(trimmedBatch, item.batchNumber)
                    candidates.add(PossibleMatchCandidate(item, MatchReason.LOOKALIKE, uDiff, aDiff))
                    continue
                }

                val rawDist = levenshteinDistance(normBatch, alertNorm)
                val lookalikeDist = levenshteinDistance(lookalikeQuery, alertLookalike)
                val bestDist = min(rawDist, lookalikeDist)
                val maxAllowed = if (normBatch.length >= 6) 2 else 1

                if (bestDist in 1..maxAllowed) {
                    seenIds.add(item.id)
                    val (uDiff, aDiff) = computeCharDiff(trimmedBatch, item.batchNumber)
                    candidates.add(PossibleMatchCandidate(item, MatchReason.FUZZY_TYPO, uDiff, aDiff))
                    continue
                }

                if (drugScore >= 0.5 && (alertNorm.startsWith(normBatch) || normBatch.startsWith(alertNorm))) {
                    seenIds.add(item.id)
                    val (uDiff, aDiff) = computeCharDiff(trimmedBatch, item.batchNumber)
                    candidates.add(PossibleMatchCandidate(item, MatchReason.DRUG_NAME_MATCH, uDiff, aDiff))
                    continue
                }
            } else if (trimmedDrug.length >= 3 && drugScore >= 0.5 && !seenIds.contains(item.id)) {
                seenIds.add(item.id)
                val (uDiff, aDiff) = computeCharDiff(trimmedBatch.ifBlank { "—" }, item.batchNumber)
                candidates.add(PossibleMatchCandidate(item, MatchReason.DRUG_NAME_MATCH, uDiff, aDiff))
            }
        }

        if (candidates.isNotEmpty()) {
            return VerificationOutcome.PossibleMatch(
                queryDrugName = trimmedDrug.ifBlank { candidates.first().batch.drugName },
                queryBatchNumber = trimmedBatch.ifBlank { "—" },
                candidates = candidates,
                checkedAtEpochMs = nowMs,
                dataUpdatedAt = dataUpdatedAt
            )
        }

        // 3. Not found (never green, never "safe", explicitly not a guarantee)
        return VerificationOutcome.NotFound(
            queryDrugName = trimmedDrug.ifBlank { "Medicine Label" },
            queryBatchNumber = trimmedBatch.ifBlank { "—" },
            checkedAtEpochMs = nowMs,
            dataUpdatedAt = dataUpdatedAt
        )
    }
}
