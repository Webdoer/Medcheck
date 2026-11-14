package `in`.gov.medcheck.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import `in`.gov.medcheck.data.local.CheckHistoryEntity
import `in`.gov.medcheck.data.local.DemoSeedData
import `in`.gov.medcheck.data.local.FlaggedBatchEntity
import `in`.gov.medcheck.data.repository.MedCheckRepository
import `in`.gov.medcheck.domain.AppLanguage
import `in`.gov.medcheck.domain.AppScreen
import `in`.gov.medcheck.domain.BottomNavTab
import `in`.gov.medcheck.domain.ScannedLabelDraft
import `in`.gov.medcheck.domain.VerificationOutcome
import `in`.gov.medcheck.util.MedCheckTtsManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class MedCheckUiState(
    val language: AppLanguage = AppLanguage.HI,
    val screen: AppScreen = AppScreen.LanguagePicker,
    val dataUpdatedAt: String = DemoSeedData.DEMO_UPDATED_AT,
    val draft: ScannedLabelDraft = ScannedLabelDraft(),
    val outcome: VerificationOutcome? = null,
    val isScanningOcr: Boolean = false,
    val ocrError: String? = null
)

class MedCheckViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = MedCheckRepository(application)
    private val ttsManager = MedCheckTtsManager(application)

    private val _uiState = MutableStateFlow(
        MedCheckUiState(
            language = repository.getSelectedLanguage(),
            screen = if (repository.hasCompletedLanguagePicker()) {
                AppScreen.MainTab(BottomNavTab.HOME)
            } else {
                AppScreen.LanguagePicker
            },
            dataUpdatedAt = repository.getDataLastUpdated()
        )
    )
    val uiState: StateFlow<MedCheckUiState> = _uiState.asStateFlow()

    val flaggedBatches: StateFlow<List<FlaggedBatchEntity>> =
        repository.observeFlaggedBatches()
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DemoSeedData.flaggedBatches)

    val history: StateFlow<List<CheckHistoryEntity>> =
        repository.observeHistory()
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val isOnline: StateFlow<Boolean> =
        repository.observeIsOnline()
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), true)

    val isSpeaking: StateFlow<Boolean> = ttsManager.isSpeaking

    init {
        viewModelScope.launch {
            val updatedAt = repository.ensureSeededAndSync()
            _uiState.update { it.copy(dataUpdatedAt = updatedAt) }
        }
    }

    fun selectLanguage(lang: AppLanguage) {
        repository.saveLanguage(lang, markPicked = false)
        _uiState.update { it.copy(language = lang) }
    }

    fun completeLanguagePicker() {
        ttsManager.stop()
        repository.saveLanguage(_uiState.value.language, markPicked = true)
        _uiState.update { it.copy(screen = AppScreen.MainTab(BottomNavTab.HOME)) }
    }

    fun openLanguagePicker() {
        ttsManager.stop()
        _uiState.update { it.copy(screen = AppScreen.LanguagePicker) }
    }

    fun navigateToTab(tab: BottomNavTab) {
        ttsManager.stop()
        _uiState.update {
            it.copy(
                screen = AppScreen.MainTab(tab),
                ocrError = null
            )
        }
    }

    fun openManualEntry(prefillDrug: String = "", prefillBatch: String = "") {
        ttsManager.stop()
        _uiState.update {
            it.copy(
                draft = ScannedLabelDraft(
                    drugName = prefillDrug,
                    batchNumber = prefillBatch,
                    manufacturer = "",
                    fromOcr = false
                ),
                ocrError = null,
                screen = AppScreen.Confirm
            )
        }
    }

    fun updateDraft(updated: ScannedLabelDraft) {
        _uiState.update { it.copy(draft = updated) }
    }

    fun processCapturedPhoto(jpegBytes: ByteArray) {
        ttsManager.stop()
        viewModelScope.launch {
            _uiState.update { it.copy(isScanningOcr = true, ocrError = null) }
            val result = repository.scanLabelViaBackend(jpegBytes)
            result.onSuccess { scanned ->
                _uiState.update {
                    it.copy(
                        isScanningOcr = false,
                        draft = scanned,
                        screen = AppScreen.Confirm
                    )
                }
            }.onFailure { err ->
                _uiState.update {
                    it.copy(
                        isScanningOcr = false,
                        ocrError = err.message ?: "Could not read label. Please enter details manually.",
                        draft = ScannedLabelDraft(fromOcr = false),
                        screen = AppScreen.Confirm
                    )
                }
            }
        }
    }

    fun verifyCurrentDraft() {
        val currentDraft = _uiState.value.draft
        verifyDirect(currentDraft.drugName, currentDraft.batchNumber)
    }

    fun verifyDirect(drugName: String, batchNumber: String) {
        ttsManager.stop()
        viewModelScope.launch {
            _uiState.update { it.copy(screen = AppScreen.Checking) }
            delay(500)
            val outcome = repository.verifyBatchAndRecord(drugName, batchNumber)
            _uiState.update {
                it.copy(
                    outcome = outcome,
                    screen = AppScreen.Result
                )
            }
        }
    }

    fun openSeededBatchDetail(batch: FlaggedBatchEntity) {
        ttsManager.stop()
        val outcome = VerificationOutcome.Flagged(
            queryDrugName = batch.drugName,
            queryBatchNumber = batch.batchNumber,
            matchedBatch = batch,
            checkedAtEpochMs = System.currentTimeMillis(),
            dataUpdatedAt = _uiState.value.dataUpdatedAt
        )
        _uiState.update { it.copy(outcome = outcome, screen = AppScreen.Result) }
    }

    fun confirmPossibleMatch(batch: FlaggedBatchEntity) {
        ttsManager.stop()
        val queryDrug = _uiState.value.outcome?.queryDrugName ?: batch.drugName
        viewModelScope.launch {
            val flagged = repository.recordConfirmedMatch(queryDrug, batch)
            _uiState.update { it.copy(outcome = flagged) }
        }
    }

    fun rejectPossibleMatch() {
        ttsManager.stop()
        val current = _uiState.value.outcome ?: return
        viewModelScope.launch {
            val notFound = repository.recordNotFound(
                queryDrugName = current.queryDrugName,
                queryBatchNumber = current.queryBatchNumber
            )
            _uiState.update { it.copy(outcome = notFound) }
        }
    }

    fun openHistoryItem(item: CheckHistoryEntity) {
        ttsManager.stop()
        viewModelScope.launch {
            val outcome = repository.openHistoryRecord(item)
            _uiState.update { it.copy(outcome = outcome, screen = AppScreen.Result) }
        }
    }

    fun deleteHistoryItem(id: Long) {
        viewModelScope.launch { repository.deleteHistoryItem(id) }
    }

    fun clearAllHistory() {
        viewModelScope.launch { repository.clearHistory() }
    }

    fun toggleSpeech(text: String) {
        if (ttsManager.isSpeaking.value) {
            ttsManager.stop()
        } else {
            ttsManager.speak(text, _uiState.value.language)
        }
    }

    fun stopSpeech() = ttsManager.stop()

    override fun onCleared() {
        super.onCleared()
        ttsManager.shutdown()
    }
}
