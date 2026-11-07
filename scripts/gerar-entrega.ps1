param(
    [Parameter(Mandatory = $true)][string]$Integrantes,
    [string]$Documentacao,
    [switch]$ValidarSomente
)

$ErrorActionPreference = 'Stop'
$projetoRaiz = Split-Path -Parent $PSScriptRoot
$arquivoIntegrantes = (Resolve-Path -LiteralPath $Integrantes).Path
$equipe = @(Import-Csv -LiteralPath $arquivoIntegrantes -Delimiter ';' -Encoding UTF8)
if ($equipe.Count -eq 0) { throw 'O arquivo precisa conter os integrantes da equipe.' }
foreach ($pessoa in $equipe) {
    if ([string]::IsNullOrWhiteSpace($pessoa.'Nome completo') -or
        $pessoa.'Nome completo' -match 'PREENCHER' -or
        $pessoa.GRR -notmatch '^GRR\d+$' -or
        $pessoa.'E-mail' -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') {
        throw 'Preencha nome completo, GRR e e-mail válidos para todos os integrantes.'
    }
}
if ($Documentacao) {
    $arquivoDocumentacao = (Resolve-Path -LiteralPath $Documentacao).Path
    if ([IO.Path]::GetExtension($arquivoDocumentacao) -notin @('.doc', '.odt')) {
        throw 'A documentação solicitada deve estar em .doc ou .odt.'
    }
}

Push-Location -LiteralPath $projetoRaiz
try {
    $fontes = @(git -c core.quotepath=false ls-files --cached --others --exclude-standard -- Back Front docs scripts .github .gitignore README.md)
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível listar os fontes pelo Git.' }
    $fontes = @($fontes | Where-Object {
        $_ -notmatch '(^|/)(node_modules|target|dist|\.angular|repository)(/|$)' -and
        $_ -notmatch '\.(log|zip|class|jar)$' -and
        $_ -notmatch '(^|/)\.env($|\.)' -and
        (Test-Path -LiteralPath (Join-Path $projetoRaiz $_) -PathType Leaf)
    })
    if ($ValidarSomente) {
        Write-Output "Validação concluída: $($equipe.Count) integrantes e $($fontes.Count) arquivos de fontes."
        return
    }
    $destino = Join-Path $projetoRaiz ('entrega/' + (Get-Date -Format 'yyyyMMdd-HHmmss-fff'))
    $pastaFontes = Join-Path $destino 'Fontes'
    New-Item -ItemType Directory -Path $pastaFontes -Force | Out-Null
    Copy-Item -LiteralPath $arquivoIntegrantes -Destination (Join-Path $destino 'Integrantes.txt')
    foreach ($relativo in $fontes) {
        $origem = Join-Path $projetoRaiz $relativo
        if (-not (Test-Path -LiteralPath $origem -PathType Leaf)) { continue }
        $copia = Join-Path $pastaFontes $relativo
        New-Item -ItemType Directory -Path (Split-Path -Parent $copia) -Force | Out-Null
        Copy-Item -LiteralPath $origem -Destination $copia
    }
    if ($Documentacao) {
        $pastaDocumentacao = Join-Path $destino 'Documentacao'
        New-Item -ItemType Directory -Path $pastaDocumentacao | Out-Null
        Copy-Item -LiteralPath $arquivoDocumentacao -Destination $pastaDocumentacao
    }
    $arquivoZip = "$destino.zip"
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [IO.Compression.ZipFile]::CreateFromDirectory($destino, $arquivoZip)
    Write-Output "Pasta da entrega: $destino"
    Write-Output "Arquivo ZIP: $arquivoZip"
} finally {
    Pop-Location
}
