package `in`.gov.medcheck

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import `in`.gov.medcheck.domain.AppScreen
import `in`.gov.medcheck.domain.BottomNavTab
import `in`.gov.medcheck.i18n.StringsRepository
import `in`.gov.medcheck.ui.MedCheckViewModel
import `in`.gov.medcheck.ui.components.MedCheckBottomBar
import `in`.gov.medcheck.ui.components.OfflineStatusBanner
import `in`.gov.medcheck.ui.screens.CheckingScreen
import `in`.gov.medcheck.ui.screens.ConfirmScreen
import `in`.gov.medcheck.ui.screens.HelpScreen
import `in`.gov.medcheck.ui.screens.HistoryScreen
import `in`.gov.medcheck.ui.screens.HomeScreen
import `in`.gov.medcheck.ui.screens.LanguagePickerScreen
import `in`.gov.medcheck.ui.screens.ResultScreen
import `in`.gov.medcheck.ui.screens.ScanScreen
import `in`.gov.medcheck.ui.theme.CreamBackground
import `in`.gov.medcheck.ui.theme.MedCheckTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MedCheckTheme {
                MedCheckRootApp()
            }
        }
    }
}

@Composable
fun MedCheckRootApp(viewModel: MedCheckViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val flaggedBatches by viewModel.flaggedBatches.collectAsStateWithLifecycle()
    val history by viewModel.history.collectAsStateWithLifecycle()
    val isOnline by viewModel.isOnline.collectAsStateWithLifecycle()
    val isSpeaking by viewModel.isSpeaking.collectAsStateWithLifecycle()

    val strings = StringsRepository.get(uiState.language)

    val showBottomBar = uiState.screen !is AppScreen.LanguagePicker
    val activeTab = when (val screen = uiState.screen) {
        is AppScreen.MainTab -> screen.tab
        AppScreen.Confirm, AppScreen.Checking, AppScreen.Result -> BottomNavTab.SCAN
        AppScreen.LanguagePicker -> BottomNavTab.HOME
    }

    Scaffold(
        containerColor = CreamBackground,
        bottomBar = {
            if (showBottomBar) {
                MedCheckBottomBar(
                    currentTab = activeTab,
                    strings = strings,
                    onSelectTab = viewModel::navigateToTab
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            OfflineStatusBanner(
                visible = !isOnline,
                message = strings.offlineBanner
            )

            AnimatedContent(
                targetState = uiState.screen,
                transitionSpec = {
                    fadeIn(animationSpec = tween(220)) togetherWith fadeOut(animationSpec = tween(180))
                },
                label = "screen_nav",
                modifier = Modifier.weight(1f)
            ) { screen ->
                when (screen) {
                    AppScreen.LanguagePicker -> LanguagePickerScreen(
                        selectedLanguage = uiState.language,
                        strings = strings,
                        isSpeaking = isSpeaking,
                        onSelectLanguage = viewModel::selectLanguage,
                        onToggleListen = viewModel::toggleSpeech,
                        onContinue = viewModel::completeLanguagePicker
                    )

                    is AppScreen.MainTab -> when (screen.tab) {
                        BottomNavTab.HOME -> HomeScreen(
                            strings = strings,
                            dataUpdatedAt = uiState.dataUpdatedAt,
                            flaggedBatches = flaggedBatches,
                            onStartScan = { viewModel.navigateToTab(BottomNavTab.SCAN) },
                            onManualEntry = { viewModel.openManualEntry() },
                            onQuickCheck = { drug, batch -> viewModel.verifyDirect(drug, batch) },
                            onOpenSeededAlert = viewModel::openSeededBatchDetail
                        )

                        BottomNavTab.SCAN -> ScanScreen(
                            strings = strings,
                            isScanningOcr = uiState.isScanningOcr,
                            onPhotoCaptured = viewModel::processCapturedPhoto,
                            onFallbackManual = { viewModel.openManualEntry() }
                        )

                        BottomNavTab.HISTORY -> HistoryScreen(
                            strings = strings,
                            history = history,
                            onOpenRecord = viewModel::openHistoryItem,
                            onDeleteRecord = viewModel::deleteHistoryItem,
                            onClearAll = viewModel::clearAllHistory
                        )

                        BottomNavTab.HELP -> HelpScreen(
                            strings = strings,
                            dataUpdatedAt = uiState.dataUpdatedAt,
                            onChangeLanguage = viewModel::openLanguagePicker
                        )
                    }

                    AppScreen.Confirm -> ConfirmScreen(
                        strings = strings,
                        draft = uiState.draft,
                        ocrError = uiState.ocrError,
                        onDraftChange = viewModel::updateDraft,
                        onVerify = viewModel::verifyCurrentDraft,
                        onRetake = { viewModel.navigateToTab(BottomNavTab.SCAN) }
                    )

                    AppScreen.Checking -> CheckingScreen(strings = strings)

                    AppScreen.Result -> {
                        val outcome = uiState.outcome
                        if (outcome != null) {
                            ResultScreen(
                                strings = strings,
                                language = uiState.language,
                                outcome = outcome,
                                isSpeaking = isSpeaking,
                                onToggleListen = viewModel::toggleSpeech,
                                onConfirmPossibleMatch = viewModel::confirmPossibleMatch,
                                onRejectPossibleMatch = viewModel::rejectPossibleMatch,
                                onCheckAnother = { viewModel.navigateToTab(BottomNavTab.SCAN) }
                            )
                        }
                    }
                }
            }
        }
    }
}
