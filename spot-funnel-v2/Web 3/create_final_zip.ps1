$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$dest = "..\spot-funnel-final-$timestamp.zip"
$exclude = @("node_modules", ".git", "dist", ".vscode", "push_batch_*.json", "all_code.json", "split_json.ps1", "zip_project.ps1", "zip_safe.ps1", "*.zip")
Get-ChildItem -Path . -Exclude $exclude | Compress-Archive -DestinationPath $dest
Write-Host "FINAL_ZIP:$((Resolve-Path $dest).Path)"
