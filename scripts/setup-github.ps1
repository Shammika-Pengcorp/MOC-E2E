#!/usr/bin/env powershell
# GitHub Repository Setup Script
# This script creates a new GitHub repository and pushes the local code

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoName = "MOC-E2E",
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    
    [Parameter(Mandatory=$false)]
    [bool]$IsPrivate = $false
)

# Ensure we're in the right directory
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "📦 MOC E2E GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create GitHub repository via GitHub CLI or API
Write-Host "1️⃣  Creating GitHub repository..." -ForegroundColor Yellow

# Check if gh CLI is available
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "   Using GitHub CLI..." -ForegroundColor Gray
    $PrivateFlag = if ($IsPrivate) { "--private" } else { "--public" }
    gh repo create $RepoName $PrivateFlag --source=. --remote=origin --push
} else {
    Write-Host "   GitHub CLI not found. Using Git with HTTPS..." -ForegroundColor Gray
    Write-Host "   ⚠️  Please create the repository manually:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "   2. Enter Repository name: $RepoName" -ForegroundColor White
    Write-Host "   3. Choose Public or Private" -ForegroundColor White
    Write-Host "   4. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
    Write-Host "   5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter once you've created the repository..."
}

# Step 2: Add remote and push
Write-Host ""
Write-Host "2️⃣  Adding remote and pushing code..." -ForegroundColor Yellow

$RemoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"

try {
    # Remove existing remote if it exists
    git remote remove origin 2>$null
    
    # Add new remote
    git remote add origin $RemoteUrl
    
    # Create main branch and push
    git branch -M main
    git push -u origin main
    
    Write-Host "   ✅ Successfully pushed to $RemoteUrl" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error pushing to repository: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Enable GitHub Pages
Write-Host ""
Write-Host "3️⃣  Repository Information" -ForegroundColor Yellow
Write-Host "   Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
Write-Host "   Actions Tab: https://github.com/$GitHubUsername/$RepoName/actions" -ForegroundColor Cyan
Write-Host ""

# Step 4: Instructions for GitHub Pages (optional)
Write-Host "4️⃣  Enable GitHub Pages for Reports (Optional)" -ForegroundColor Yellow
Write-Host "   1. Go to Settings → Pages" -ForegroundColor White
Write-Host "   2. Source: Deploy from branch" -ForegroundColor White
Write-Host "   3. Branch: gh-pages / root folder" -ForegroundColor White
Write-Host "   4. Save" -ForegroundColor White
Write-Host ""

Write-Host "✨ Repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Actions tab to see workflows" -ForegroundColor White
Write-Host "2. Manual trigger: Click 'Run workflow'" -ForegroundColor White
Write-Host "3. Workflows will run on next push/PR" -ForegroundColor White
Write-Host "4. Ortoni Reports will be generated automatically" -ForegroundColor White
