# Run the main API locally on Windows

From this directory, run `powershell -ExecutionPolicy Bypass -File .\run-local.ps1`.
The API listens at `http://127.0.0.1:8000/api/`, matching the frontend's development default. The script applies migrations to `local.sqlite3` and starts Django. This database is for local development and is ignored by Git.

The script uses `venv\Scripts\python.exe`. If that environment is missing, create it with `py -m venv venv`, then install dependencies with `venv\Scripts\python.exe -m pip install -r requirements.txt`.

For the full Docker/PostgreSQL stack, Docker Desktop must be running and the root `.env` must be configured from `.env.example`; run `docker compose up -d --build` from the repository root.
