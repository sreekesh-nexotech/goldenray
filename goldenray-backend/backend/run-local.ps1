$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$python = Join-Path $PSScriptRoot 'venv\Scripts\python.exe'
if (-not (Test-Path $python)) {
    throw "Backend virtual environment missing. Create it and install requirements.txt first."
}

$env:DB_ENGINE = 'django.db.backends.sqlite3'
$env:DB_NAME = Join-Path $PSScriptRoot 'local.sqlite3'
$env:DJANGO_ALLOWED_HOSTS = 'localhost,127.0.0.1'
$env:PYTHONIOENCODING = 'utf-8'

& $python manage.py migrate --noinput --verbosity 0
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $python manage.py runserver 127.0.0.1:8000
