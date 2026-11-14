package `in`.gov.medcheck.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [FlaggedBatchEntity::class, CheckHistoryEntity::class],
    version = 1,
    exportSchema = false
)
abstract class MedCheckDatabase : RoomDatabase() {
    abstract fun medCheckDao(): MedCheckDao

    companion object {
        @Volatile
        private var INSTANCE: MedCheckDatabase? = null

        fun getInstance(context: Context): MedCheckDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MedCheckDatabase::class.java,
                    "medcheck_local.db"
                )
                    .addCallback(object : Callback() {
                        override fun onCreate(db: SupportSQLiteDatabase) {
                            super.onCreate(db)
                            INSTANCE?.let { database ->
                                CoroutineScope(Dispatchers.IO).launch {
                                    database.medCheckDao()
                                        .insertFlaggedBatches(DemoSeedData.flaggedBatches)
                                }
                            }
                        }
                    })
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
