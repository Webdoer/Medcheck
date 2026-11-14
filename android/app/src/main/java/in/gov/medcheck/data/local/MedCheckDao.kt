package `in`.gov.medcheck.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

@Dao
interface MedCheckDao {
    @Query("SELECT * FROM flagged_batches ORDER BY alertMonth DESC, drugName ASC")
    fun observeFlaggedBatches(): Flow<List<FlaggedBatchEntity>>

    @Query("SELECT * FROM flagged_batches")
    suspend fun getAllFlaggedBatches(): List<FlaggedBatchEntity>

    @Query("SELECT * FROM flagged_batches WHERE id = :id LIMIT 1")
    suspend fun getFlaggedBatchById(id: String): FlaggedBatchEntity?

    @Query("SELECT COUNT(*) FROM flagged_batches")
    suspend fun countFlaggedBatches(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFlaggedBatches(items: List<FlaggedBatchEntity>)

    @Query("SELECT * FROM check_history ORDER BY checkedAtEpochMs DESC LIMIT 20")
    fun observeRecentHistory(): Flow<List<CheckHistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistoryItem(item: CheckHistoryEntity)

    @Query(
        """
        DELETE FROM check_history
        WHERE id NOT IN (
            SELECT id FROM check_history ORDER BY checkedAtEpochMs DESC LIMIT 20
        )
        """
    )
    suspend fun trimHistoryToLast20()

    @Transaction
    suspend fun recordCheckAndTrim(item: CheckHistoryEntity) {
        insertHistoryItem(item)
        trimHistoryToLast20()
    }

    @Query("DELETE FROM check_history WHERE id = :id")
    suspend fun deleteHistoryItem(id: Long)

    @Query("DELETE FROM check_history")
    suspend fun clearAllHistory()
}
