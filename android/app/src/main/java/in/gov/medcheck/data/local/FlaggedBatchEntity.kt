package `in`.gov.medcheck.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "flagged_batches")
data class FlaggedBatchEntity(
    @PrimaryKey val id: String,
    val drugName: String,
    val genericName: String,
    val batchNumber: String,
    val manufacturer: String,
    val reasonSummary: String,
    val state: String,
    val alertMonth: String,
    val bulletinSource: String,
    val testingLab: String,
    val severity: String, // "nsq" or "spurious"
    val datasetLabel: String = "DEMO" // Seeded set explicitly labelled "DEMO"
)
