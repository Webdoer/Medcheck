package `in`.gov.medcheck.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CameraAlt
import androidx.compose.material.icons.rounded.HelpOutline
import androidx.compose.material.icons.rounded.History
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Phone
import androidx.compose.material.icons.rounded.Stop
import androidx.compose.material.icons.rounded.VolumeUp
import androidx.compose.material.icons.rounded.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import `in`.gov.medcheck.domain.BottomNavTab
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.theme.CreamBackground
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.MistySage
import `in`.gov.medcheck.ui.theme.MistySageDeep
import `in`.gov.medcheck.ui.theme.PaleSkyBlue
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftCardSurface
import `in`.gov.medcheck.ui.theme.SoftLavenderContainer
import `in`.gov.medcheck.ui.theme.SoftLavenderPrimary

@Composable
fun OfflineStatusBanner(
    visible: Boolean,
    message: String
) {
    AnimatedVisibility(visible = visible) {
        Surface(
            color = PaleSkyBlue,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Rounded.WifiOff,
                    contentDescription = null,
                    tint = SlateBlueText,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = message,
                    style = MaterialTheme.typography.labelMedium,
                    color = SlateBlueText
                )
            }
        }
    }
}

@Composable
fun ListenActionCard(
    isSpeaking: Boolean,
    listenLabel: String,
    stopLabel: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        shape = RoundedCornerShape(50),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isSpeaking) SoftLavenderPrimary else PaleSkyBlue,
            contentColor = if (isSpeaking) Color.White else SlateBlueText
        ),
        modifier = modifier
            .fillMaxWidth()
            .height(54.dp)
    ) {
        Icon(
            imageVector = if (isSpeaking) Icons.Rounded.Stop else Icons.Rounded.VolumeUp,
            contentDescription = null,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = if (isSpeaking) stopLabel else listenLabel,
            style = MaterialTheme.typography.titleMedium,
            color = if (isSpeaking) Color.White else SlateBlueText
        )
    }
}

@Composable
fun HelplineCard(
    label: String,
    onCallClick: () -> Unit,
    modifier: Modifier = Modifier,
    containerColor: Color = MistySage
) {
    Card(
        shape = MedCheckCardShape,
        colors = CardDefaults.cardColors(containerColor = containerColor),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyMedium,
                    color = SlateBlueText
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "1800-11-4477",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MistySageDeep
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Button(
                onClick = onCallClick,
                shape = RoundedCornerShape(50),
                colors = ButtonDefaults.buttonColors(containerColor = MistySageDeep)
            ) {
                Icon(
                    imageVector = Icons.Rounded.Phone,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text("1800-11-4477", maxLines = 1)
            }
        }
    }
}

@Composable
fun MedCheckBottomBar(
    currentTab: BottomNavTab,
    strings: MedCheckStrings,
    onSelectTab: (BottomNavTab) -> Unit
) {
    NavigationBar(
        containerColor = SoftCardSurface,
        tonalElevation = 2.dp
    ) {
        val items = listOf(
            Triple(BottomNavTab.HOME, strings.navHome, Icons.Rounded.Home),
            Triple(BottomNavTab.SCAN, strings.navScan, Icons.Rounded.CameraAlt),
            Triple(BottomNavTab.HISTORY, strings.navHistory, Icons.Rounded.History),
            Triple(BottomNavTab.HELP, strings.navHelp, Icons.Rounded.HelpOutline)
        )
        items.forEach { (tab, label, icon) ->
            NavigationBarItem(
                selected = currentTab == tab,
                onClick = { onSelectTab(tab) },
                icon = { Icon(imageVector = icon, contentDescription = label) },
                label = { Text(text = label, maxLines = 1) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = SoftLavenderPrimary,
                    selectedTextColor = SoftLavenderPrimary,
                    indicatorColor = SoftLavenderContainer,
                    unselectedIconColor = SlateBlueText.copy(alpha = 0.65f),
                    unselectedTextColor = SlateBlueText.copy(alpha = 0.65f)
                )
            )
        }
    }
}
