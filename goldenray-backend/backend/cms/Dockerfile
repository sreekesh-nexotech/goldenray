# Blog CMS (Content Studio) — standalone Django service.
# Built independently from the main backend: its own project (config.wsgi),
# gunicorn on :8000 inside the container. Static (Django admin UI) is collected
# at build time and served by WhiteNoise; migrations run at container start.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Build deps for psycopg2 / Pillow.
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Collect the Django admin static files into STATIC_ROOT for WhiteNoise.
# DJANGO_ENV=production keeps DEBUG off during the build; no DB is touched.
RUN DJANGO_ENV=production DJANGO_SECRET_KEY=build-only \
    python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
