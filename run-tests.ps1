# PowerShell Version

# Define ANSI escape sequences for colors
$RED = "`e[0;31m"
$GREEN = "`e[0;32m"
$NC = "`e[0m" # No Color

function Run-PlaywrightTestsFailingAndErrorTextFound {
    param (
        [string]$testFilename
    )

    Run-PlaywrightTests $testFilename "--conf example-files/configuration-error-texts.json" "1 failed" "expect(content).not.toContain"
}

function Print-TestParameters {
    param (
        [string]$testFilename,
        [string]$testCommandExtraParameters,
        [string]$outputContainsTestResult,
        [string]$outputContainsText,
        [string]$outputContainsText2,
        [string]$outputNotContainsText
    )

    Write-Host ""
    Write-Host "******************************************"
    Write-Host "Testing:"
    Write-Host ""
    Write-Host "filename: $testFilename"
    Write-Host "wacat parameters: $testCommandExtraParameters"
    Write-Host "contains result: $outputContainsTestResult"
    Write-Host "contains: $outputContainsText"

    if ($null -ne $outputContainsText2) {
        Write-Host "contains: $outputContainsText2"
    }

    if ($null -ne $outputNotContainsText) {
        Write-Host "not contains: $outputNotContainsText"
    }
}

function Run-PlaywrightTests {
    param (
        [string]$testFilename,
        [string]$testCommandExtraParameters,
        [string]$outputContainsTestResult,
        [string]$outputContainsText,
        [string]$outputContainsText2,
        [string]$outputNotContainsText
    )

    Print-TestParameters $testFilename $testCommandExtraParameters $outputContainsTestResult $outputContainsText $outputContainsText2 $outputNotContainsText

    Write-Host "******************************************"
    Write-Host ""

    Copy-Item "test-app/test-app/pages/$testFilename" -Destination "test-app/test-app/pages/index.tsx"

    Start-Sleep -Seconds 20

    $testOutput = wacat test $testCommandExtraParameters http://localhost:3000 2>&1

    Write-Host $testOutput

    $testSuccess = $true

    if (-not ($testOutput -like "*$outputContainsTestResult*")) {
        Write-Host "Mika1"
        $testSuccess = $false
    }
    if (-not ($testOutput -like "*$outputContainsText*")) {
        Write-Host "Mika2"
        $testSuccess = $false
    }
    if ($null -ne $outputContainsText2 -and -not ($testOutput -like "*$outputContainsText2*")) {
        Write-Host "Mika3"
        $testSuccess = $false
    }
    if ($null -ne $outputNotContainsText -and $testOutput -like "*$outputNotContainsText*") {
        Write-Host "Mika4"
        # $testSuccess = $false
    }

    if ($testSuccess) {
        Write-Host -ForegroundColor Green "successful"
    }
    else {
        Write-Host -ForegroundColor Red "failed!"

        exit 1
    }

    Write-Host "******************************************"
    Write-Host ""
}

Write-Host ""
Write-Host "******************************************"
Write-Host "Start testing"
Write-Host "******************************************"
Write-Host ""

Copy-Item "playwright.config.ts-headless-true" -Destination "playwright.config.ts"

Start-Process npm -ArgumentList "run dev" -WorkingDirectory "test-app/test-app" -NoNewWindow
Start-Sleep -Seconds 10

Run-PlaywrightTests "index-working-page2.tsx" "" "1 passedx" "Push the button #0"
Run-PlaywrightTests "index-working-page2.tsx" "" "1 passed" "Push the button #0"

Copy-Item "playwright.config.ts-headless-false" -Destination "playwright.config.ts"

Write-Host -ForegroundColor Green "Testing successful"
