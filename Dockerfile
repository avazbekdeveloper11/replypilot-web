# syntax=docker/dockerfile:1

# --- deps --------------------------------------------------------------------
# Separate stage so `npm ci` is only re-run when package*.json actually
# change, not on every source edit — Docker layer caching.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder -------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# GO_API_URL only needs to be correct at runtime (it's read from
# process.env inside Route Handlers and next.config.ts's rewrites(),
# both of which execute server-side, per request — see
# src/config/env.ts's doc comment). No NEXT_PUBLIC_* vars exist in this
# app, so the build itself needs no secrets and this image is safe to
# build once and reuse across environments.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- runner --------------------------------------------------------------------
# `output: "standalone"` (next.config.ts) traces the build down to only
# the node_modules actually used and copies them into .next/standalone —
# this stage never runs `npm install`, so it stays small and has no dev
# dependencies at all.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
