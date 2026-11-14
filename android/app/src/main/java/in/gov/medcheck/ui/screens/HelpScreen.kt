package `in`.gov.medcheck.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Translate
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.components.HelplineCard
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.MistySage
import `in`.gov.medcheck.ui.theme.PaleSkyBlue
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftCardSurface
import `in`.gov.medcheck.util.HelplineHelper

@Composable
fun HelpScreen(
    strings: MedCheckStrings,
    dataUpdatedAt: String,
    onChangeLanguage: () -> Unit
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = strings.helpTitle,
            style = MaterialTheme.typography.headlineSmall,
            color = SlateBlueText
        )

        Card(
            shape = MedCheckCardShape,
            colors = CardDefaults.cardColors(containerColor = MistySage)
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = strings.helpPrivacyBody,
                    style = MaterialTheme.typography.bodyMedium,
                    color = SlateBlueText
                )
            }
        }

        Card(
            shape = MedCheckCardShape,
            colors = CardDefaults.cardColors(containerColor = PaleSkyBlue)
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = strings.helpOfflineNote,
                    style = MaterialTheme.typography.bodyMedium,
                    color = SlateBlueText
                )
                Text(
                    text = "${strings.dataLastUpdatedLabel} $dataUpdatedAt",
                    style = MaterialTheme.typography.labelMedium,
                    color = SlateBlueMuted
                )
            }
        }

        HelplineCard(
            label = strings.helpHelplineDesc,
            containerColor = SoftCardSurface,
            onCallClick = { HelplineHelper.dialHelpline(context) }
        )

        OutlinedButton(
            onClick = onChangeLanguage,
            shape = RoundedCornerShape(50),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Icon(imageVector = Icons.Rounded.Translate, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(strings.changeLanguageBtn)
        }
    }
}
