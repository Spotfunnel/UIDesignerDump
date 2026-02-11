$ErrorActionPreference = "Stop"
$root = "c:\Users\leoge\OneDrive\Documents\AI Activity\antigravity\UI Designer\spot-funnel-v2"
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".html", ".css", ".json", ".md", ".yml", ".yaml")

$count = 0

function Add-File($path) {
    if (Test-Path $path -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        if ($extensions -contains $ext) {
            $script:count++
        }
    }
}

try {
    # Root files
    $rootFiles = @("index.html", "vite.config.ts", "package.json", "tsconfig.json", "tailwind.config.js", "postcss.config.js", "tsconfig.node.json")
    foreach ($f in $rootFiles) { Add-File (Join-Path $root $f) }

    # Src recursive
    Get-ChildItem -Path (Join-Path $root "src") -Recurse -File | ForEach-Object { Add-File $_.FullName }
    
    # Public recursive
    if (Test-Path (Join-Path $root "public")) {
        Get-ChildItem -Path (Join-Path $root "public") -Recurse -File | ForEach-Object { Add-File $_.FullName }
    }

    Write-Host "Total Files: $count"
}
catch {
    Write-Error $_
}
