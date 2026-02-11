$ErrorActionPreference = "Stop"
$source = "c:\Users\leoge\OneDrive\Documents\AI Activity\antigravity\UI Designer\spot-funnel-v2"
$date = Get-Date -Format "yyyyMMdd-HHmm"
$dest = "$source\SpotFunnel_Package_$date.zip"
$temp = "$source\.temp_pkg"

if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
New-Item $temp -ItemType Directory | Out-Null

Write-Host "Copying..."
# Robocopy args
robocopy "$source" "$temp" /E /XD node_modules .git dist .temp_pkg /XF *.zip *.log .DS_Store .env* package-website.ps1 simple-pack.ps1 | Out-Null

Write-Host "Zipping..."
Compress-Archive -Path "$temp\*" -DestinationPath "$dest" -Force

Remove-Item $temp -Recurse -Force
Write-Host "Done! File created at:"
Write-Host "$dest"
