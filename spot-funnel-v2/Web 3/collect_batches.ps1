$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".html", ".css", ".json", ".md", ".yml", ".yaml")

$files = @()

function Add-File($path) {
    if (Test-Path $path -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        # Skip package-lock.json and non-code
        if ($extensions -contains $ext -and $path -notlike "*package-lock.json*") {
            $relPath = $path.Substring($root.Length + 1).Replace('\', '/')
            $content = [System.IO.File]::ReadAllText($path)
            $files += @{ path = $relPath; content = $content }
        }
    }
}

Write-Host "Root: $root"

# Root files
$rootFiles = @("index.html", "vite.config.ts", "package.json", "tsconfig.json", "tailwind.config.js", "postcss.config.js", "tsconfig.node.json")
foreach ($f in $rootFiles) { 
    $p = Join-Path $root $f
    if (Test-Path $p) { Add-File $p }
}

# Src recursive
$src = Join-Path $root "src"
if (Test-Path $src) {
    Get-ChildItem -Path $src -Recurse -File | ForEach-Object { Add-File $_.FullName }
}

# Public recursive
$pub = Join-Path $root "public"
if (Test-Path $pub) {
    Get-ChildItem -Path $pub -Recurse -File | ForEach-Object { Add-File $_.FullName }
}

Write-Host "Collected $($files.Count) files."

# Batching
$batchSize = 35
$batchCount = [math]::Ceiling($files.Count / $batchSize)

if ($files.Count -eq 0) {
    Write-Error "No files collected!"
}

for ($i = 0; $i -lt $batchCount; $i++) {
    $skip = $i * $batchSize
    $batch = $files | Select-Object -Skip $skip -First $batchSize
    # Use Compress to make it readable in one line
    $json = $batch | ConvertTo-Json -Depth 2 -Compress
    $outfile = "batch_$($i+1).json"
    [System.IO.File]::WriteAllText((Join-Path $root $outfile), $json)
    Write-Host "Wrote $outfile"
}
