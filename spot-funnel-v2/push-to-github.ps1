# SpotFunnel Website - Complete Package Upload to GitHub
# This includes: Landing Page + Dashboard + Auth + Everything

# Navigate to project directory
cd "c:\Users\leoge\OneDrive\Documents\AI Activity\antigravity\UI Designer\spot-funnel-v2"

# Initialize git repository
git init

# Add all files (complete website package)
git add .

# Create initial commit
git commit -m "Initial commit - SpotFunnel Complete Website Package"

# Add GitHub remote - EXACT URL FROM GITHUB
git remote add origin https://github.com/Spotfunnel/Spotfunnel-website.git

# Push to GitHub
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "✅ Successfully pushed SpotFunnel Website to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Package includes:" -ForegroundColor Cyan
Write-Host "  - Landing Page" -ForegroundColor White
Write-Host "  - Dashboard (Overview, Actions, Call Logs, Settings)" -ForegroundColor White
Write-Host "  - Authentication System" -ForegroundColor White
Write-Host "  - Supabase Integration" -ForegroundColor White
Write-Host "  - Email Templates" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next: Deploy to Vercel at vercel.com" -ForegroundColor Yellow
