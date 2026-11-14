package `in`.gov.medcheck.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.QrCodeScanner
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import `in`.gov.medcheck.data.local.FlaggedBatchEntity
import `in`.gov.medcheck.domain.AppLanguage
import `in`.gov.medcheck.domain.PossibleMatchCandidate
import `in`.gov.medcheck.domain.VerificationOutcome
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.components.HelplineCard
import `in`.gov.medcheck.ui.components.ListenActionCard
import `in`.gov.medcheck.ui.theme.FlaggedAccent
import `in`.gov.medcheck.ui.theme.FlaggedBackground
import `in`.gov.medcheck.ui.theme.FlaggedText
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.NotFoundAccent
import `in`.gov.medcheck.ui.theme.NotFoundBackground
import `in`.gov.medcheck.ui.theme.NotFoundText
import `in`.gov.medcheck.ui.theme.PossibleAccent
import `in`.gov.medcheck.ui.theme.PossibleBackground
import `in`.gov.medcheck.ui.theme.PossibleText
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftCardSurface
import `in`.gov.medcheck.ui.theme.SoftLavenderPrimary
import `in`.gov.medcheck.util.HelplineHelper

@Composable
fun ResultScreen(
    strings: MedCheckStrings,
    language: AppLanguage,
    outcome: VerificationOutcome,
    isSpeaking: Boolean,
    onToggleListen: (String) -> Unit,
    onConfirmPossibleMatch: (FlaggedBatchEntity) -> Unit,
    onRejectPossibleMatch: () -> Unit,
    onCheckAnother: () -> Unit
) {
    val context = LocalContext.current
    var selectedCandidateIdx by remember(outcome) { mutableIntStateOf(0) }

    AnimatedContent(targetState = outcome, label = "result_transition") { current ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            when (current) {
                // STATE 1: FLAGGED (Dusty coral-red + warning triangle)
                is VerificationOutcome.Flagged -> {
                    val batch = current.matchedBatch
                    Card(
                        shape = MedCheckCardShape,
                        colors = CardDefaults.cardColors(containerColor = FlaggedBackground)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Rounded.Warning,
                                    contentDescription = strings.flaggedBadge,
                                    tint = FlaggedAccent,
                                    modifier = Modifier.size(26.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = strings.flaggedBadge,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = FlaggedAccent
                                )
                            }

                            Text(
                                text = batch.drugName,
                                style = MaterialTheme.typography.headlineSmall,
                                color = FlaggedText
                            )
                            Text(
                                text = "${strings.batchNumberLabel}: ${batch.batchNumber}",
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = FlaggedAccent
                            )

                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = SoftCardSurface
                            ) {
                                Column(
                                    modifier = Modifier.padding(14.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text(
                                        text = strings.reasonLabel,
                                        style = MaterialTheme.typography.labelMedium,
                                        color = SlateBlueMuted
                                    )
                                    Text(
                                        text = batch.reasonSummary,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = SlateBlueText
                                    )
                                    HorizontalDivider()
                                    Text(
                                        text = "${strings.manufacturerLabel}: ${batch.manufacturer}",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = SlateBlueText
                                    )
                                    Text(
                                        text = "${strings.sourceLabel}: ${batch.bulletinSource} (${batch.datasetLabel})",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = SlateBlueMuted
                                    )
                                }
                            }

                            Text(
                                text = strings.flaggedGuidance,
                                style = MaterialTheme.typography.bodyMedium,
                                color = FlaggedText
                            )
                        }
                    }

                    ListenActionCard(
                        isSpeaking = isSpeaking,
                        listenLabel = strings.listenBtn,
                        stopLabel = strings.stopListenBtn,
                        onClick = { onToggleListen(buildFlaggedSpeech(language, batch, strings)) }
                    )
                }

                // STATE 2: POSSIBLE MATCH (Soft amber + magnifier; candidates only until "Yes, same batch")
                is VerificationOutcome.PossibleMatch -> {
                    val active: PossibleMatchCandidate =
                        current.candidates.getOrElse(selectedCandidateIdx) { current.candidates.first() }

                    Card(
                        shape = MedCheckCardShape,
                        colors = CardDefaults.cardColors(containerColor = PossibleBackground)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Rounded.Search,
                                    contentDescription = strings.possibleBadge,
                                    tint = PossibleAccent,
                                    modifier = Modifier.size(26.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = strings.possibleBadge,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = PossibleAccent
                                )
                            }

                            Text(
                                text = strings.possibleTitle,
                                style = MaterialTheme.typography.headlineSmall,
                                color = PossibleText
                            )
                            Text(
                                text = strings.possibleSub,
                                style = MaterialTheme.typography.bodyMedium,
                                color = PossibleText
                            )

                            if (current.candidates.size > 1) {
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    current.candidates.forEachIndexed { idx, candidate ->
                                        OutlinedButton(
                                            onClick = { selectedCandidateIdx = idx },
                                            shape = RoundedCornerShape(50)
                                        ) {
                                            Text(
                                                text = candidate.batch.batchNumber,
                                                fontFamily = FontFamily.Monospace
                                            )
                                        }
                                    }
                                }
                            }

                            // Show candidates ONLY (drug name & batch code comparison — NO alert details yet)
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = SoftCardSurface
                            ) {
                                Column(
                                    modifier = Modifier.padding(14.dp),
                                    verticalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Text(
                                        text = "${strings.yourEntryLabel}: ${current.queryBatchNumber}",
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.SemiBold,
                                        color = SlateBlueText
                                    )
                                    Text(
                                        text = "${strings.candidateBatchLabel}: ${active.batch.batchNumber} (${active.batch.drugName})",
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.Bold,
                                        color = PossibleAccent
                                    )
                                }
                            }

                            Button(
                                onClick = { onConfirmPossibleMatch(active.batch) },
                                shape = RoundedCornerShape(50),
                                colors = ButtonDefaults.buttonColors(containerColor = PossibleAccent),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp)
                            ) {
                                Text(strings.yesSameBatchBtn, color = Color.White)
                            }

                            OutlinedButton(
                                onClick = onRejectPossibleMatch,
                                shape = RoundedCornerShape(50),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                            ) {
                                Text(strings.noDifferentBatchBtn, color = PossibleText)
                            }
                        }
                    }

                    ListenActionCard(
                        isSpeaking = isSpeaking,
                        listenLabel = strings.listenBtn,
                        stopLabel = strings.stopListenBtn,
                        onClick = {
                            onToggleListen(
                                "${strings.possibleTitle}. ${strings.yourEntryLabel} ${current.queryBatchNumber}. ${strings.candidateBatchLabel} ${active.batch.batchNumber}. ${strings.possibleSub}"
                            )
                        }
                    )
                }

                // STATE 3: NOT FOUND (Calm blue-grey + info icon; NEVER green, NEVER "safe"; explicitly not a guarantee)
                is VerificationOutcome.NotFound -> {
                    Card(
                        shape = MedCheckCardShape,
                        colors = CardDefaults.cardColors(containerColor = NotFoundBackground)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Rounded.Info,
                                    contentDescription = strings.notFoundBadge,
                                    tint = NotFoundAccent,
                                    modifier = Modifier.size(26.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = strings.notFoundBadge,
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = NotFoundAccent
                                )
                            }

                            Text(
                                text = strings.notFoundTitle,
                                style = MaterialTheme.typography.headlineSmall,
                                color = NotFoundText
                            )

                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = SoftCardSurface
                            ) {
                                Column(
                                    modifier = Modifier.padding(14.dp),
                                    verticalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text(
                                        text = current.queryDrugName,
                                        style = MaterialTheme.typography.titleMedium,
                                        color = SlateBlueText
                                    )
                                    Text(
                                        text = "${strings.batchNumberLabel}: ${current.queryBatchNumber}",
                                        fontFamily = FontFamily.Monospace,
                                        color = NotFoundAccent
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = strings.notFoundMeaning,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = SlateBlueText
                                    )
                                    Text(
                                        text = strings.notFoundNotGuarantee,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.SemiBold,
                                        color = NotFoundText
                                    )
                                }
                            }
                        }
                    }

                    ListenActionCard(
                        isSpeaking = isSpeaking,
                        listenLabel = strings.listenBtn,
                        stopLabel = strings.stopListenBtn,
                        onClick = {
                            onToggleListen(
                                "${strings.notFoundTitle}. ${strings.notFoundMeaning} ${strings.notFoundNotGuarantee}"
                            )
                        }
                    )
                }
            }

            HelplineCard(
                label = strings.callHelplineLabel,
                onCallClick = { HelplineHelper.dialHelpline(context) }
            )

            Button(
                onClick = onCheckAnother,
                shape = RoundedCornerShape(50),
                colors = ButtonDefaults.buttonColors(containerColor = SoftLavenderPrimary),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Icon(imageVector = Icons.Rounded.QrCodeScanner, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(strings.checkAnotherBtn, color = Color.White)
            }

            Text(
                text = "${strings.dataLastUpdatedLabel} ${current.dataUpdatedAt}",
                style = MaterialTheme.typography.labelMedium,
                color = SlateBlueMuted
            )
        }
    }
}

private fun buildFlaggedSpeech(
    language: AppLanguage,
    batch: FlaggedBatchEntity,
    strings: MedCheckStrings
): String {
    return when (language) {
        AppLanguage.HI -> "${batch.drugName}, बैच नंबर ${batch.batchNumber}, ${strings.flaggedTitle}। ${strings.flaggedGuidance}"
        else -> "${batch.drugName}, batch ${batch.batchNumber}. ${strings.flaggedTitle}. ${strings.flaggedGuidance}"
    }
}
