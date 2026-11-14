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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Delete
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import `in`.gov.medcheck.data.local.CheckHistoryEntity
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.theme.FlaggedAccent
import `in`.gov.medcheck.ui.theme.FlaggedBackground
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.NotFoundAccent
import `in`.gov.medcheck.ui.theme.NotFoundBackground
import `in`.gov.medcheck.ui.theme.PossibleAccent
import `in`.gov.medcheck.ui.theme.PossibleBackground
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HistoryScreen(
    strings: MedCheckStrings,
    history: List<CheckHistoryEntity>,
    onOpenRecord: (CheckHistoryEntity) -> Unit,
    onDeleteRecord: (Long) -> Unit,
    onClearAll: () -> Unit
) {
    val formatter = SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault())

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = strings.historyTitle,
            style = MaterialTheme.typography.headlineSmall,
            color = SlateBlueText
        )
        Text(
            text = strings.historyDeviceOnlySub,
            style = MaterialTheme.typography.bodyMedium,
            color = SlateBlueMuted
        )

        if (history.isEmpty()) {
            Card(
                shape = MedCheckCardShape,
                colors = CardDefaults.cardColors(containerColor = NotFoundBackground),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = strings.historyEmpty,
                    style = MaterialTheme.typography.bodyLarge,
                    color = SlateBlueText,
                    modifier = Modifier.padding(24.dp)
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(history, key = { it.id }) { item ->
                    val (bg, accent, icon) = when (item.status) {
                        "flagged" -> Triple(FlaggedBackground, FlaggedAccent, Icons.Rounded.Warning)
                        "possible_match" -> Triple(PossibleBackground, PossibleAccent, Icons.Rounded.Search)
                        else -> Triple(NotFoundBackground, NotFoundAccent, Icons.Rounded.Info)
                    }
                    Card(
                        shape = MedCheckCardShape,
                        colors = CardDefaults.cardColors(containerColor = bg),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onOpenRecord(item) }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = icon,
                                contentDescription = null,
                                tint = accent,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.queryDrugName,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = SlateBlueText
                                )
                                Text(
                                    text = item.queryBatchNumber,
                                    fontFamily = FontFamily.Monospace,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = accent
                                )
                                Text(
                                    text = formatter.format(Date(item.checkedAtEpochMs)),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = SlateBlueMuted
                                )
                            }
                            IconButton(onClick = { onDeleteRecord(item.id) }) {
                                Icon(
                                    imageVector = Icons.Rounded.Delete,
                                    contentDescription = "Delete",
                                    tint = SlateBlueMuted
                                )
                            }
                        }
                    }
                }
            }

            OutlinedButton(
                onClick = onClearAll,
                shape = RoundedCornerShape(50),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(strings.clearHistoryBtn)
            }
        }
    }
}
