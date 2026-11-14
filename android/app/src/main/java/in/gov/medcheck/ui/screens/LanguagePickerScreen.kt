package `in`.gov.medcheck.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Translate
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import `in`.gov.medcheck.domain.AppLanguage
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.components.HelplineCard
import `in`.gov.medcheck.ui.components.ListenActionCard
import `in`.gov.medcheck.ui.theme.CalmOutline
import `in`.gov.medcheck.ui.theme.CreamBackground
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.MistySage
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftCardSurface
import `in`.gov.medcheck.ui.theme.SoftLavenderContainer
import `in`.gov.medcheck.ui.theme.SoftLavenderPrimary
import `in`.gov.medcheck.util.HelplineHelper

@Composable
fun LanguagePickerScreen(
    selectedLanguage: AppLanguage,
    strings: MedCheckStrings,
    isSpeaking: Boolean,
    onSelectLanguage: (AppLanguage) -> Unit,
    onToggleListen: (String) -> Unit,
    onContinue: () -> Unit
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CreamBackground)
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(6.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Rounded.Translate,
                contentDescription = null,
                tint = SoftLavenderPrimary,
                modifier = Modifier.size(30.dp)
            )
            Spacer(modifier = Modifier.size(10.dp))
            Text(
                text = strings.appName,
                style = MaterialTheme.typography.headlineLarge,
                color = SlateBlueText
            )
        }

        Text(
            text = strings.tagline,
            style = MaterialTheme.typography.bodyLarge,
            color = SlateBlueMuted
        )

        Card(
            shape = MedCheckCardShape,
            colors = CardDefaults.cardColors(containerColor = MistySage)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(
                    text = strings.chooseLanguageTitle,
                    style = MaterialTheme.typography.titleMedium,
                    color = SlateBlueText
                )
                Spacer(modifier = Modifier.height(12.dp))

                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    AppLanguage.entries.chunked(2).forEach { pair ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            pair.forEach { lang ->
                                val selected = lang == selectedLanguage
                                Card(
                                    shape = RoundedCornerShape(18.dp),
                                    colors = CardDefaults.cardColors(
                                        containerColor = if (selected) SoftLavenderContainer else SoftCardSurface
                                    ),
                                    border = BorderStroke(
                                        width = if (selected) 2.dp else 1.dp,
                                        color = if (selected) SoftLavenderPrimary else CalmOutline
                                    ),
                                    modifier = Modifier
                                        .weight(1f)
                                        .clickable { onSelectLanguage(lang) }
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 12.dp, vertical = 12.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Column {
                                            Text(
                                                text = lang.nativeName,
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold,
                                                color = SlateBlueText
                                            )
                                            Text(
                                                text = lang.englishName,
                                                style = MaterialTheme.typography.labelMedium,
                                                color = SlateBlueMuted
                                            )
                                        }
                                        if (selected) {
                                            Icon(
                                                imageVector = Icons.Rounded.CheckCircle,
                                                contentDescription = null,
                                                tint = SoftLavenderPrimary
                                            )
                                        } else {
                                            RadioButton(
                                                selected = false,
                                                onClick = { onSelectLanguage(lang) },
                                                colors = RadioButtonDefaults.colors(
                                                    unselectedColor = SlateBlueMuted
                                                )
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        ListenActionCard(
            isSpeaking = isSpeaking,
            listenLabel = strings.listenWelcomeLabel,
            stopLabel = strings.stopListenBtn,
            onClick = { onToggleListen(strings.welcomeTtsText) }
        )

        Button(
            onClick = onContinue,
            shape = RoundedCornerShape(50),
            colors = ButtonDefaults.buttonColors(
                containerColor = SoftLavenderPrimary,
                contentColor = Color.White
            ),
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        ) {
            Text(
                text = strings.continueBtn,
                style = MaterialTheme.typography.titleMedium,
                color = Color.White
            )
            Spacer(modifier = Modifier.size(8.dp))
            Icon(imageVector = Icons.Rounded.ArrowForward, contentDescription = null)
        }

        HelplineCard(
            label = strings.callHelplineLabel,
            onCallClick = { HelplineHelper.dialHelpline(context) }
        )
    }
}
