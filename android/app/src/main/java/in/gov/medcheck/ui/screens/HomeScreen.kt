package `in`.gov.medcheck.ui.screens

import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.rounded.CameraAlt
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
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
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.components.HelplineCard
import `in`.gov.medcheck.ui.theme.FlaggedAccent
import `in`.gov.medcheck.ui.theme.FlaggedBackground
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.MistySage
import `in`.gov.medcheck.ui.theme.PaleSkyBlue
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftCardSurface
import `in`.gov.medcheck.ui.theme.SoftLavenderPrimary
import `in`.gov.medcheck.util.HelplineHelper

@Composable
fun HomeScreen(
    strings: MedCheckStrings,
    dataUpdatedAt: String,
    flaggedBatches: List<FlaggedBatchEntity>,
    onStartScan: () -> Unit,
    onManualEntry: () -> Unit,
    onQuickCheck: (drugName: String, batchNumber: String) -> Unit,
    onOpenSeededAlert: (FlaggedBatchEntity) -> Unit
) {
    val context = LocalContext.current
    var quickQuery by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header + "Data last updated"
        Column {
            Text(
                text = strings.homeTitle,
                style = MaterialTheme.typography.headlineLarge,
                color = SlateBlueText
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "${strings.dataLastUpdatedLabel} $dataUpdatedAt",
                style = MaterialTheme.typography.labelMedium,
                color = SlateBlueMuted
            )
        }

        // Primary Calm Hero Card (24dp rounded)
        Card(
            shape = MedCheckCardShape,
            colors = CardDefaults.cardColors(containerColor = MistySage)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(50),
                    color = PaleSkyBlue
                ) {
                    Text(
                        text = strings.demoSeedBadge,
                        style = MaterialTheme.typography.labelMedium,
                        color = SlateBlueText,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp)
                    )
                }

                Text(
                    text = strings.homeSubtitle,
                    style = MaterialTheme.typography.bodyLarge,
                    color = SlateBlueText
                )

                Button(
                    onClick = onStartScan,
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = SoftLavenderPrimary,
                        contentColor = Color.White
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp)
                ) {
                    Icon(imageVector = Icons.Rounded.CameraAlt, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(strings.scanLabelCta, style = MaterialTheme.typography.titleMedium, color = Color.White)
                }

                OutlinedButton(
                    onClick = onManualEntry,
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Icon(imageVector = Icons.Rounded.Edit, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(strings.enterManuallyCta, style = MaterialTheme.typography.labelLarge)
                }
            }
        }

        // Quick Direct Search Card
        Card(
            shape = MedCheckCardShape,
            colors = CardDefaults.cardColors(containerColor = SoftCardSurface)
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = quickQuery,
                    onValueChange = { quickQuery = it },
                    label = { Text(strings.quickCheckHint) },
                    leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null) },
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                Button(
                    onClick = {
                        val trimmed = quickQuery.trim()
                        if (trimmed.isNotEmpty()) {
                            val looksLikeBatch = Regex("^[A-Za-z0-9-]{3,16}$").matches(trimmed) &&
                                trimmed.any { it.isDigit() }
                            if (looksLikeBatch) {
                                onQuickCheck("", trimmed)
                            } else {
                                onQuickCheck(trimmed, trimmed)
                            }
                        }
                    },
                    enabled = quickQuery.isNotBlank(),
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(containerColor = SoftLavenderPrimary),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    Text(strings.checkNowBtn, color = Color.White)
                }
            }
        }

        // Tap-to-call CDSCO Helpline
        HelplineCard(
            label = strings.callHelplineLabel,
            onCallClick = { HelplineHelper.dialHelpline(context) }
        )

        // Seeded Room DEMO Alerts Preview
        Text(
            text = strings.recentAlertsTitle,
            style = MaterialTheme.typography.titleLarge,
            color = SlateBlueText
        )

        flaggedBatches.take(4).forEach { batch ->
            Card(
                shape = MedCheckCardShape,
                colors = CardDefaults.cardColors(containerColor = SoftCardSurface),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onOpenSeededAlert(batch) }
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = batch.drugName,
                            style = MaterialTheme.typography.titleMedium,
                            color = SlateBlueText,
                            modifier = Modifier.weight(1f)
                        )
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = FlaggedBackground
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Warning,
                                    contentDescription = null,
                                    tint = FlaggedAccent,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = batch.datasetLabel,
                                    style = MaterialTheme.typography.labelMedium,
                                    color = FlaggedAccent
                                )
                            }
                        }
                    }

                    Text(
                        text = "${strings.batchNumberLabel}: ${batch.batchNumber}",
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.SemiBold,
                        color = FlaggedAccent,
                        style = MaterialTheme.typography.bodyMedium
                    )

                    Text(
                        text = batch.reasonSummary,
                        style = MaterialTheme.typography.bodyMedium,
                        color = SlateBlueMuted
                    )
                }
            }
        }
    }
}
