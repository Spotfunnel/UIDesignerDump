$ErrorActionPreference = "Stop"
$root = Convert-Path .
$out = "all_code.json"
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".html", ".css", ".json", ".md")

# Gather list
$targets = @("src", "public", "index.html", "vite.config.ts", "package.json", "tsconfig.json", "tailwind.config.js", "postcss.config.js")

$payload = @()

foreach ($t in $targets) {
    if (Test-Path $t) {
        if ((Get-Item $t).PSIsContainer) {
            Get-ChildItem $t -Recurse -File | ForEach-Object {
                $ext = $_.Extension.ToLower()
                if ($extensions -contains $ext -and $_.Name -ne "package-lock.json") {
                    $rel = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
                    $txt = [System.IO.File]::ReadAllText($_.FullName)
                    $payload += @{ path = $rel; content = $txt }
                }
            }
        }
        else {
            # File
            $rel = (Get-Item $t).FullName.Substring($root.Length + 1).Replace('\', '/')
            $txt = [System.IO.File]::ReadAllText((Get-Item $t).FullName)
            $payload += @{ path = $rel; content = $txt }
        }
    }
}

Write-Host "Collected $($payload.Count) files."
$json = $payload | ConvertTo-Json -Depth 2 -Compress
[System.IO.File]::WriteAllText($out, $json)
Write-Host "Saved to $out"
