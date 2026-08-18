# Stage 1: Builder with all dependencies
FROM node:18-alpine AS builder

RUN apk add --no-cache build-base vips-dev

ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app
COPY package*.json ./
RUN npm install --include=optional
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so the
# backend API URL must be supplied here as a build arg (defaults to the local
# backend published on the host). It must be reachable from the browser.
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Content Studio admin API (blog CMS), called directly from the browser like
# the main API above — must be a browser-reachable URL, baked at build time.
ARG NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:8009/admin-api/
ENV NEXT_PUBLIC_ADMIN_API_BASE_URL=$NEXT_PUBLIC_ADMIN_API_BASE_URL

# Blog CMS delivery API (Strapi-shaped, read-only) — also called from the
# browser and baked at build time. Same host as the admin API in prod.
ARG NEXT_PUBLIC_BLOG_API_BASE_URL=http://localhost:8009/api
ENV NEXT_PUBLIC_BLOG_API_BASE_URL=$NEXT_PUBLIC_BLOG_API_BASE_URL

# Canonical public origin, baked into canonical tags / OG / JSON-LD / sitemap
# at build time. Defaults to the canonical non-www host; never set this to
# www.flarize.com, which 301s and would publish redirecting URLs to Google.
ARG NEXT_PUBLIC_SITE_URL=https://flarize.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# Stage 2 (dev only): dependencies without a production build. The source is
# bind-mounted by docker-compose.override.yml and `next dev` compiles on the
# fly, so a code change never needs an image rebuild. Not used in production —
# the final stage below stays the default build target.
FROM node:18-alpine AS dev

RUN apk add --no-cache build-base vips-dev

# Chromium for the quotation PDF: the document is rendered by real Chrome via
# puppeteer-core rather than rasterised in JS, so the PDF matches the page
# exactly. puppeteer-core ships no browser of its own, hence the system one.
# icu-data-full is required on top of the chromium package's default (reduced,
# English-only) ICU data — without it, Chromium mis-shapes/mis-segments
# non-Latin complex scripts (e.g. Malayalam conjuncts render broken).
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates \
        ttf-freefont font-noto font-noto-emoji icu-data-full
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm install --include=optional

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# Stage 3: Production image
FROM node:18-alpine

# Chromium for the quotation PDF: the document is rendered by real Chrome via
# puppeteer-core rather than rasterised in JS, so the PDF matches the page
# exactly. puppeteer-core ships no browser of its own, hence the system one.
# icu-data-full is required on top of the chromium package's default (reduced,
# English-only) ICU data — without it, Chromium mis-shapes/mis-segments
# non-Latin complex scripts (e.g. Malayalam conjuncts render broken).
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates \
        ttf-freefont font-noto font-noto-emoji icu-data-full
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000
CMD ["npm", "start"]