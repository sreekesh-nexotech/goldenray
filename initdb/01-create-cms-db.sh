#!/bin/bash
# Runs once, the first time the Postgres data volume is initialised (the
# postgres image executes everything in /docker-entrypoint-initdb.d/ on init).
# Creates the Blog CMS database alongside the main app database in the same
# Postgres server. Idempotent-safe: only ever runs on a fresh volume.
set -e

CMS_DB="${CMS_DB_NAME:-blog_cms}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE "$CMS_DB"'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$CMS_DB')\gexec
EOSQL

echo "initdb: ensured database '$CMS_DB' exists"
