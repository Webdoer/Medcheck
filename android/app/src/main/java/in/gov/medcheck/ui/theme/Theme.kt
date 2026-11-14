package `in`.gov.medcheck.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

val MedCheckCardShape = RoundedCornerShape(24.dp)

private val MedCheckLightColorScheme = lightColorScheme(
    primary = SoftLavenderPrimary,
    onPrimary = SoftCardSurface,
    primaryContainer = SoftLavenderContainer,
    onPrimaryContainer = SoftLavenderDark,
    secondary = MistySageDeep,
    onSecondary = SoftCardSurface,
    secondaryContainer = MistySage,
    onSecondaryContainer = SlateBlueText,
    tertiary = NotFoundAccent,
    onTertiary = SoftCardSurface,
    tertiaryContainer = PaleSkyBlue,
    onTertiaryContainer = SlateBlueText,
    background = CreamBackground,
    onBackground = SlateBlueText,
    surface = SoftCardSurface,
    onSurface = SlateBlueText,
    surfaceVariant = SoftCardMuted,
    onSurfaceVariant = SlateBlueMuted,
    outline = CalmOutline,
    error = FlaggedAccent,
    onError = SoftCardSurface,
    errorContainer = FlaggedBackground,
    onErrorContainer = FlaggedText
)

private val MedCheckShapes = Shapes(
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(28.dp)
)

@Composable
fun MedCheckTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = MedCheckLightColorScheme,
        typography = MedCheckTypography,
        shapes = MedCheckShapes,
        content = content
    )
}
