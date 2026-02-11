$ErrorActionPreference = "Stop"

$sourceDir = "c:\Users\leoge\OneDrive\Documents\AI Activity\antigravity\UI Designer\spot-funnel-v2"
$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$zipName = "SpotFunnel_Package_$timestamp.zip"
$destinationZip = Join-Path -Path $sourceDir -ChildPath $zipName
$tempDir = Join-Path -Path $sourceDir -ChildPath ".temp_package_build"

Write-Host "📦 Packaging SpotFunnel Website..." -ForegroundColor Cyan

# Clean up any old temp dir
if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
New-Item -Path $tempDir -ItemType Directory | Out-Null

Write-Host "Copying files to temp directory..." -ForegroundColor Yellow

# Robocopy needs explicit quotes for paths with spaces when called this way
# We use cmd /c to ensure arguments are passed correctly to robocopy
$roboArgs = @(
    $sourceDir,
    $tempDir,
    "/E",
    "/XD", "node_modules", ".git", "dist", ".temp_package_build",
    "/XF", "*.zip", "*.log", ".DS_Store", ".env*", "package-website.ps1"
)
& robocopy $roboArgs | Out-Null

# Robocopy exit codes: 0-7 are success
if ($LASTEXITCODE -gt 7) {
    Write-Error "Robocopy failed with exit code $LASTEXITCODE"
}

Write-Host "Compressing..." -ForegroundColor Yellow

Compress-Archive -Path "$tempDir\*" -DestinationPath $destinationZip -Force

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force

if (Test-Path $destinationZip) {
    Write-Host ""
    Write-Host "✅ Package Created Successfully!" -ForegroundColor Green
    Write-Host "📂 File: $zipName"
    try {
        $size = (Get-Item $destinationZip).Length / 1MB
        Write-Host "   Size: $([math]::Round($size, 2)) MB"
    }
    catch {
        Write-Host "   Size: Unknown"
    }
    Write-Host "   Path: $destinationZip"
}
else {
    Write-Error "Failed to create zip file."
}
