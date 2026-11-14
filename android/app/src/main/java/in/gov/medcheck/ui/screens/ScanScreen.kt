package `in`.gov.medcheck.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CameraAlt
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.NoPhotography
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import `in`.gov.medcheck.i18n.MedCheckStrings
import `in`.gov.medcheck.ui.theme.MedCheckCardShape
import `in`.gov.medcheck.ui.theme.PaleSkyBlue
import `in`.gov.medcheck.ui.theme.SlateBlueMuted
import `in`.gov.medcheck.ui.theme.SlateBlueText
import `in`.gov.medcheck.ui.theme.SoftLavenderPrimary
import java.io.ByteArrayOutputStream

@Composable
fun ScanScreen(
    strings: MedCheckStrings,
    isScanningOcr: Boolean,
    onPhotoCaptured: (ByteArray) -> Unit,
    onFallbackManual: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED
        )
    }
    var permissionDenied by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
        permissionDenied = !granted
    }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    val imageCapture = remember {
        ImageCapture.Builder()
            .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
            .build()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = strings.scanTitle,
            style = MaterialTheme.typography.headlineSmall,
            color = SlateBlueText
        )
        Text(
            text = strings.scanSubtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = SlateBlueMuted
        )

        if (!hasCameraPermission && permissionDenied) {
            // Camera-permission-denied fallback directly to Manual Entry
            Card(
                shape = MedCheckCardShape,
                colors = CardDefaults.cardColors(containerColor = PaleSkyBlue),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.NoPhotography,
                        contentDescription = null,
                        tint = SlateBlueText,
                        modifier = Modifier.size(44.dp)
                    )
                    Text(
                        text = strings.cameraDeniedTitle,
                        style = MaterialTheme.typography.titleLarge,
                        color = SlateBlueText,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = strings.cameraDeniedBody,
                        style = MaterialTheme.typography.bodyMedium,
                        color = SlateBlueText,
                        textAlign = TextAlign.Center
                    )
                    Button(
                        onClick = onFallbackManual,
                        shape = RoundedCornerShape(50),
                        colors = ButtonDefaults.buttonColors(containerColor = SoftLavenderPrimary),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Icon(imageVector = Icons.Rounded.Edit, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(strings.cameraDeniedFallbackBtn, color = Color.White)
                    }
                }
            }
            return@Column
        }

        // CameraX Preview Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(MedCheckCardShape),
            contentAlignment = Alignment.Center
        ) {
            if (hasCameraPermission) {
                AndroidView(
                    factory = { ctx ->
                        val previewView = PreviewView(ctx)
                        val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                        cameraProviderFuture.addListener({
                            val cameraProvider = cameraProviderFuture.get()
                            val preview = Preview.Builder().build().also {
                                it.surfaceProvider = previewView.surfaceProvider
                            }
                            try {
                                cameraProvider.unbindAll()
                                cameraProvider.bindToLifecycle(
                                    lifecycleOwner,
                                    CameraSelector.DEFAULT_BACK_CAMERA,
                                    preview,
                                    imageCapture
                                )
                            } catch (_: Exception) {
                            }
                        }, ContextCompat.getMainExecutor(ctx))
                        previewView
                    },
                    modifier = Modifier.fillMaxSize()
                )

                // Soft viewfinder guide overlay
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color.Transparent,
                    border = BorderStroke(2.dp, PaleSkyBlue.copy(alpha = 0.85f)),
                    modifier = Modifier.size(230.dp)
                ) {}
            } else {
                CircularProgressIndicator(color = SoftLavenderPrimary)
            }

            if (isScanningOcr) {
                Surface(
                    shape = MedCheckCardShape,
                    color = Color.Black.copy(alpha = 0.65f),
                    modifier = Modifier.fillMaxSize()
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        CircularProgressIndicator(color = Color.White)
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = strings.readingLabelMsg,
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }

        Button(
            onClick = {
                imageCapture.takePicture(
                    ContextCompat.getMainExecutor(context),
                    object : ImageCapture.OnImageCapturedCallback() {
                        override fun onCaptureSuccess(image: ImageProxy) {
                            val bytes = imageProxyToJpegBytes(image)
                            image.close()
                            if (bytes != null) {
                                onPhotoCaptured(bytes)
                            } else {
                                onFallbackManual()
                            }
                        }

                        override fun onError(exception: ImageCaptureException) {
                            onFallbackManual()
                        }
                    }
                )
            },
            enabled = hasCameraPermission && !isScanningOcr,
            shape = RoundedCornerShape(50),
            colors = ButtonDefaults.buttonColors(containerColor = SoftLavenderPrimary),
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        ) {
            Icon(imageVector = Icons.Rounded.CameraAlt, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(strings.capturePhotoBtn, color = Color.White, style = MaterialTheme.typography.titleMedium)
        }

        OutlinedButton(
            onClick = onFallbackManual,
            enabled = !isScanningOcr,
            shape = RoundedCornerShape(50),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            Icon(imageVector = Icons.Rounded.Edit, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(strings.enterManuallyCta)
        }
    }
}

private fun imageProxyToJpegBytes(image: ImageProxy): ByteArray? {
    val buffer = image.planes.firstOrNull()?.buffer ?: return null
    val bytes = ByteArray(buffer.remaining())
    buffer.get(bytes)
    val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size) ?: return bytes
    val out = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, 85, out)
    return out.toByteArray()
}
