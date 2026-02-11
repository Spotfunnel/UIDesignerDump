# Enable Network Access for Vite Dev Server
# Run this script as Administrator

Write-Host "Adding Windows Firewall rule for Vite Dev Server on port 8080..." -ForegroundColor Cyan

try {
    # Check if rule already exists
    $existingRule = Get-NetFirewallRule -DisplayName "Vite Dev Server Port 8080" -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Write-Host "Firewall rule already exists. Removing old rule..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName "Vite Dev Server Port 8080"
    }
    
    # Create new firewall rule
    New-NetFirewallRule -DisplayName "Vite Dev Server Port 8080" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -Profile Any
    
    Write-Host "✓ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now access your dev server from other devices using:" -ForegroundColor Cyan
    Write-Host "http://192.168.1.10:8080/" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "✗ Failed to add firewall rule: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Add the rule manually:" -ForegroundColor Yellow
    Write-Host "1. Open Windows Defender Firewall" -ForegroundColor White
    Write-Host "2. Advanced Settings → Inbound Rules → New Rule" -ForegroundColor White
    Write-Host "3. Port → TCP → 8080 → Allow" -ForegroundColor White
}

Read-Host "Press Enter to close"
