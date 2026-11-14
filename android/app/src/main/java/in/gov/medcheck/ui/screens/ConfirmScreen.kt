package `in`.gov.medcheck.ui.screens

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import `in`.gov.medcheck.domain.ScannedLabelDraft
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.theme.CalmOutline
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.PossibleAccent
import `in`.gov.medcheck.ui.theme.PossibleBackground
import `in`.gov.medcheck.ui.theme.PossibleText
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftCardSurface
import `in`.gov.medcheck.ui.theme.SoftLavenderPrimary

@Composable
fun ConfirmScreen(
    strings: MedCheckStrings,
    draft: ScannedLabelDraft,
    ocrError: String?,
    onDraftChange: (ScannedLabelDraft) -> Unit,
    onVerify: () -> Unit,
    onRetake: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = strings.confirmTitle,
            style = MaterialTheme.typography.headlineSmall,
            color = SlateBlueText
        )
        Text(
            text = strings.confirmSubtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = SlateBlueMuted
        )

        if (!ocrError.isNullOrBlank()) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = PossibleBackground
            ) {
                Text(
                    text = ocrError,
                    style = MaterialTheme.typography.bodyMedium,
                    color = PossibleText,
                    modifier = Modifier.padding(14.dp)
                )
            }
        }

        Card(
            shape = MedCheckCardShape,
            colors = CardDefaults.cardColors(containerColor = SoftCardSurface)
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                ConfidenceHighlightedField(
                    label = strings.drugNameLabel,
                    value = draft.drugName,
                    confidence = draft.drugNameConfidence,
                    isLowConfidence = draft.isDrugLowConfidence,
                    lowConfidenceHint = strings.lowConfidenceAlert,
                    onValueChange = { onDraftChange(draft.copy(drugName = it)) }
                )

                ConfidenceHighlightedField(
                    label = strings.batchNumberLabel,
                    value = draft.batchNumber,
                    confidence = draft.batchNumberConfidence,
                    isLowConfidence = draft.isBatchLowConfidence,
                    lowConfidenceHint = strings.lowConfidenceAlert,
                    onValueChange = { onDraftChange(draft.copy(batchNumber = it)) }
                )

                ConfidenceHighlightedField(
                    label = strings.manufacturerLabel,
                    value = draft.manufacturer,
                    confidence = draft.manufacturerConfidence,
                    isLowConfidence = draft.isManufacturerLowConfidence,
                    lowConfidenceHint = strings.lowConfidenceAlert,
                    onValueChange = { onDraftChange(draft.copy(manufacturer = it)) }
                )
            }
        }

        val canSubmit = draft.drugName.isNotBlank() || draft.batchNumber.isNotBlank()
        Button(
            onClick = onVerify,
            enabled = canSubmit,
            shape = RoundedCornerShape(50),
            colors = ButtonDefaults.buttonColors(containerColor = SoftLavenderPrimary),
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        ) {
            Text(strings.verifyBatchBtn, color = Color.White, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.width(8.dp))
            Icon(imageVector = Icons.Rounded.ArrowForward, contentDescription = null)
        }

        OutlinedButton(
            onClick = onRetake,
            shape = RoundedCornerShape(50),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Icon(imageVector = Icons.Rounded.Refresh, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(strings.retakeBtn)
        }
    }
}

@Composable
private fun ConfidenceHighlightedField(
    label: String,
    value: String,
    confidence: Float,
    isLowConfidence: Boolean,
    lowConfidenceHint: String,
    onValueChange: (String) -> Unit
) {
    Surface(
        shape = RoundedCornerShape(18.dp),
        color = if (isLowConfidence) PossibleBackground.copy(alpha = 0.6f) else Color.Transparent,
        border = if (isLowConfidence) BorderStroke(1.5.dp, PossibleAccent) else null,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(if (isLowConfidence) 12.dp else 0.dp)) {
            if (isLowConfidence) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Warning,
                        contentDescription = null,
                        tint = PossibleAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "$lowConfidenceHint (${(confidence * 100).toInt()}%)",
                        style = MaterialTheme.typography.labelMedium,
                        color = PossibleText
                    )
                }
            }

            OutlinedTextField(
                value = value,
                onValueChange = onValueChange,
                label = { Text(label) },
                singleLine = true,
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = if (isLowConfidence) PossibleAccent else SoftLavenderPrimary,
                    unfocusedBorderColor = if (isLowConfidence) PossibleAccent else CalmOutline
                ),
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
