package `in`.gov.medcheck.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "check_history")
data class CheckHistoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val queryDrugName: String,
    val queryBatchNumber: String,
    val status: String, // "flagged", "possible_match", "not_found"
    val matchedBatchId: String?,
    val checkedAtEpochMs: Long,
    val dataUpdatedAt: String
)
