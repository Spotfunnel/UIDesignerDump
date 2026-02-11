$ErrorActionPreference = "Stop"
$root = "c:\Users\leoge\OneDrive\Documents\AI Activity\antigravity\UI Designer\spot-funnel-v2"
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".html", ".css", ".json", ".md")

$files = @()

# Helpers
function Get-RelativePath($path) {
    return $path.Substring($root.Length + 1).Replace('\', '/')
}

function Add-File($path) {
    if (Test-Path $path -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($path)
        if ($extensions -contains $ext) {
            $content = [System.IO.File]::ReadAllText($path)
            $files += @{
                path    = Get-RelativePath $path
                content = $content
            }
        }
    }
}

# Root files
$rootFiles = @("index.html", "vite.config.ts", "package.json", "tsconfig.json", "tailwind.config.js", "postcss.config.js", "tsconfig.node.json")
foreach ($f in $rootFiles) {
    Add-File (Join-Path $root $f)
}

# Src recursive
Get-ChildItem -Path (Join-Path $root "src") -Recurse -File | ForEach-Object {
    Add-File $_.FullName
}

# Public recursive (text only)
if (Test-Path (Join-Path $root "public")) {
    Get-ChildItem -Path (Join-Path $root "public") -Recurse -File | ForEach-Object {
        Add-File $_.FullName
    }
}

$files | ConvertTo-Json -Depth 2
